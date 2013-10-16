if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';


//// REPLACE WITH REAL IO

function IO() {
}

IO.getAvailable = function(uri, cb) {
  cb({
    de: 1,
    pl: 2,
  });
}

IO.getLangpack = function(domain, version, locale, cb) {
  cb({
    '/locales/music.l20n': '<title "Hello world">',
    '/locales/foo.l20n': '<foo "Foo">',
    '/locales/notifications.l20n': '<up "Up!">',
  });
}

///////////////////////////////////////////////////////

// THAT'S HOW YOU USE THE API:
/*
var lps = null;

function launch() {
  lps = new LPS();
}

function registerApp() {
  lps.registerApplication('system.gaiamobile.org', {
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
    '/locales/{{locale}}/browser.l20n',
    '/locales/{{locale}}/foo.l20n',
  ];
  var requested = ['pl', 'en-US', 'fr', 'de']; // navigator.langauges

  function cb(response) {
    console.dir(response);
  }

  lps.getResources('system.gaiamobile.org',
                   1.2,
                   uris,
                   requested,
                   cb);
}
*/
/////////////////////////////////////


  var Intl = require('./intl').Intl;

  function LPS() {
    this.apps = {};             // data from apps
    this.service = {};          // data from AMO
    this.langpacks = {};        // cached langpacks
    this.requestedLocales = [];

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
        this.apps[uri].locales[code] = manifest.languages[code];
      }
    }
  }

  LPS.prototype.getResources = function(uri, version, resuris, requested, cb) {

    var requestedLocales = requested;
    var defaultLocale = this.apps[uri]['default_locale'];

    var availableLocales = [];
    var resources = {};

    for (var code in this.apps[uri]['locales']) {
      if (availableLocales.indexOf(code) === -1) {
        availableLocales.push(code);
        resources[code] = null;
      }
    }
    for (var code in this.service[uri]) {
      if (availableLocales.indexOf(code) === -1) {
        availableLocales.push(code);
        resources[code] = {};
        for (var path in this.langpacks[uri][code]) {
          resources[code][path] = this.langpacks[uri][code][path];
        }
      }
    }

    var supportedLocales = Intl.prioritizeLocales(availableLocales,
        requestedLocales,
        defaultLocale);

    cb({
      'fallbackChain': supportedLocales,
      'resources': resources, 
    });
  }

  LPS.prototype.updateRequestedLocales = function(langList) {
    this.requestedLocales = langList;
  }


  LPS.prototype.tick = function() {
    console.log('tick');
    this._syncAvailable();
  }

  LPS.prototype._syncAvailable = function() {
    var self = this;
    // [uris]
    for (var uri in this.apps) {
      IO.getAvailable(uri, function(response) {
        for (var code in response) {
          if (!self.service[uri]) {
            self.service[uri] = {};
          }
          if (!self.service[uri][code]) {
            self.service[uri][code] = response[code];
          }
        }
        self._syncLangpacks();
      });
    }
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
      for (var code in this.service[uri]) {
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
        console.log(code);
        var appLocale = this.apps[uri]['locales'][code];
        var serviceLocale = this.service[uri][code];
        if (serviceLocale && (!appLocale || appLocale < serviceLocale)) {
          localesToDownload.push(code);
        }
      }
      for (var i in localesToDownload) {
        var code = localesToDownload[i];
        IO.getLangpack(uri, this.apps[uri].version, code, function(res) {
          if (!self.langpacks[uri]) {
            self.langpacks[uri] = {};
          }
          if (!self.langpacks[uri][code]) {
            self.langpacks[uri][code] = {};
          }
          for (var path in res) {
            self.langpacks[uri][code][path] = res[path];
          }
        });
      }
      console.dir(localesToDownload);
    }
  }

  LPS.prototype.startTicks = function() {
    this.I = setInterval(this.tick, 1000);
  }

  LPS.prototype.stopTicks = function() {
    this.I = clearInterval(this.tick);
  }


  exports.LPS = LPS;
});
