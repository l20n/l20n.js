if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

///////////////////////////////////////////////////////

// THAT'S HOW YOU USE THE API:
/*
var lps = null;

function launch() {
  lps = new LPS();
}

function registerApp() {
  lps.registerApplication('music.gaiamobile.org', {
    'version': 1.2,
    'default_locale': 'en-US',
    'languages': {
      'en-US': 1,
      'pl': 2,
    }
  });
}

function runCycle() {
  lps.tick();
}

function runApp() {
  var uris = [
    '/locales/{{locale}}/music.l20n',
    '/locales/{{locale}}/foo.l20n',
  ];
  var requested = ['pl', 'en-US', 'fr', 'de']; // navigator.langauges

  function cb2(resources) {
    console.dir(resources);
  }
  function cb(fallbackChain) {
    var locales = [];
    for (var i in fallbackChain) {
      if (fallbackChain[i]['source'] == 'service') {
        locales.push(fallbackChain[i]['code']);
      }
    }
    lps.getResources('music.gaiamobile.org',
        uris,
        locales,
        cb2);
  }

  lps.negotiateLocales('music.gaiamobile.org', requested, cb);
}

*/
/////////////////////////////////////


  var Intl = require('./intl').Intl;

  function LPS() {
    this.apps = {};             // data from apps
    this.service = {};          // data from AMO
    this.langpacks = {};        // cached langpacks
    this.requestedLocales = [];
    this.languageNames = {};

    this.I = null;

    this.updateRequestedLocales([navigator.language]);
  }

LPS.prototype.registerApplication = function(uri, manifest) {
  if (!this.apps[uri]) {
    this.apps[uri] = {
      'locales': {},
      'version': null,
      'default_locale': null,
    };

    this.apps[uri].version = manifest.version;
    this.apps[uri].default_locale = manifest.default_locale;

    for (var code in manifest.languages) {
      this.apps[uri].locales[code] = {
        'version': manifest.languages[code]
      };
    }
  }
}

LPS.prototype.negotiateLocales = function (uri, requested, cb) {
  var self = this;
  var requestedLocales = requested;
  var defaultLocale = this.apps[uri]['default_locale'];

  var availableLocales = [];

  for (var code in this.apps[uri]['locales']) {
    if (availableLocales.indexOf(code) === -1) {
      availableLocales.push(code);
    }
  }
  for (var code in this.service[uri]) {
    if (availableLocales.indexOf(code) === -1) {
      availableLocales.push(code);
    }
  }

  var supportedLocales = Intl.prioritizeLocales(availableLocales,
      requestedLocales,
      defaultLocale);

  var res = [];

  supportedLocales.forEach(function(locale) {
    var source = 'service';
    if (self.apps[uri]['locales'][locale] &&
      (!self.service[uri]['locales'][locale] ||
       self.service[uri]['locales'][locale].version <= self.apps[uri]['locales'][locale].version)) {
         source = 'local';
       }
    res.push({
      code: locale,
      source: source
    });
  });

  cb(res);
}

LPS.prototype.getResources = function(uri, resuris, locales, cb) {

  var resources = {};

  for (var i in locales) {
    var code = locales[i];
    if (this.langpacks[uri]['locales'][code]) {
      resources[code] = {};
      for (var path in this.langpacks[uri]['locales'][code]) {
        if (resuris.indexOf(path) !== -1) {
          resources[code][path] = this.langpacks[uri]['locales'][code][path];
        }
      }
    }
  }

  cb(resources);
}

LPS.prototype.updateRequestedLocales = function(langList) {
  this.requestedLocales = langList;
}


LPS.prototype.tick = function() {
  console.log('tick');
  this._syncAvailable(this._syncLangpacks);
}

LPS.prototype._syncAvailable = function(cb) {
  var self = this;
  var uris = [];
  for (var uri in this.apps) {
    uris.push(uri);
  }
  LPS.IO.getAvailable(uris.join(','), function(response) {
    var domains = response.domains;
    for (var uri in domains) {
      for (var code in domains[uri]) {
        if (!self.service[uri]) {
          self.service[uri] = {
            'locales': {},
          };
        }
        if (!self.service[uri]['locales'][code]) {
          self.service[uri]['locales'][code] = {
            'version': domains[uri][code]
          };
        }
      }
    }
    self.languageNames = response.nativeNames;
    if (cb) {
      cb();
    }
  });
}

LPS.prototype._syncLangpacks = function() {
  var self = this;
  for (var uri in this.apps) {
    var availableLocales = [];
    for (var code in this.apps[uri]['locales']) {
      if (availableLocales.indexOf(code) === -1) {
        availableLocales.push(code);
      }
    }
    for (var code in this.service[uri]['locales']) {
      if (availableLocales.indexOf(code) === -1) {
        availableLocales.push(code);
      }
    }
    var fallbackChain = Intl.prioritizeLocales(availableLocales,
        this.requestedLocales,
        this.apps['default_locale']);

    var localesToDownload = [];

    for (var i in fallbackChain) {
      var code = fallbackChain[i];
      var appLocale = this.apps[uri]['locales'][code];
      var serviceLocale = this.service[uri]['locales'][code];
      if (serviceLocale && (!appLocale || appLocale.version < serviceLocale.version)) {
        localesToDownload.push(code);
      }
    }
    for (var i in localesToDownload) {
      var code = localesToDownload[i];
      LPS.IO.getLangpack(uri, this.apps[uri].version, code, function(res) {
        if (!self.langpacks[uri]) {
          self.langpacks[uri] = {
            'locales': {},
          };
        }
        if (!self.langpacks[uri]['locales'][code]) {
          self.langpacks[uri]['locales'][code] = {};
        }
        for (var path in res) {
          self.langpacks[uri]['locales'][code][path] = res[path];
        }
      });
    }
  }
}

LPS.prototype.getSupportedLanguages = function(cb) {
  cb(this.languageNames);
}

LPS.prototype.addSystemLanguages = function(locales, cb) {
  for (var i in locales) {
    if (!this.languageNames[i]) {
      this.languageNames[i] = locales[i];
    }
  }
  cb();
}

LPS.prototype.startTicks = function() {
  this.I = setInterval(this.tick, 1000);
}

LPS.prototype.stopTicks = function() {
  this.I = clearInterval(this.tick);
}

////////////////// Service - Server shim

LPS.IO = function () {
}

LPS.IO.getAvailable = function(uris, cb) {
  cb({
    'domains': {
      "system.gaiamobile.org": {
        "de": 1
      }
    },
    'nativeNames': {
      "de": "Deutsch",
    }
  });
}

LPS.IO.getLangpack = function(domain, version, locale, cb) {
  cb({
    '/locales/{{locale}}/music.l20n': '<title "Hello world">',
    '/locales/{{locale}}/foo.l20n': '<foo "Foo">',
    '/locales/{{locale}}/notifications.l20n': '<up "Up!">',
  });
}

  exports.LPS = LPS;
});
