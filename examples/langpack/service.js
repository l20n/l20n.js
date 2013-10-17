var SERVER = true;

function LPS() {
  if (SERVER) {
    this.serverURL = 'http://localhost:3000';
  } else {
    this.serverURL = false;
  }

  this.apps = {};             // data from apps
  this.service = {};          // data from AMO
  this.langpacks = {};        // cached langpacks
  this.requestedLocales = [];
  this.systemLanguageNames = {};
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
  if (this.service[uri]) {
    for (var code in this.service[uri]['locales']) {
      if (availableLocales.indexOf(code) === -1) {
        availableLocales.push(code);
      }
    }
  }

  var supportedLocales = Intl.prioritizeLocales(availableLocales,
      requestedLocales,
      defaultLocale);

  var res = [];

  supportedLocales.forEach(function(locale) {
    var source = 'service';
    if (self.apps[uri]['locales'][locale] &&
      (!self.service[uri] ||
       !self.service[uri]['locales'][locale] ||
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

LPS.prototype.updateRequestedLocales = function(langList, cb) {
  this.requestedLocales = langList;
  this._syncLangpacks(cb);
}


LPS.prototype.tick = function(cb) {
  console.log('tick');
  this._syncAvailable(this._syncLangpacks.bind(this, cb));
}

LPS.prototype._syncAvailable = function(cb) {
  var self = this;
  var uris = [];
  for (var uri in this.apps) {
    uris.push(uri);
  }
  LPS.IO.getAvailable(this.serverURL, uris.join(','), function(response) {
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

LPS.prototype._syncLangpacks = function(cb) {
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
    var downloadedLocales = 0;
    if (localesToDownload.length == 0) {
      if (cb) {
        cb();
      }
    }

    for (var i in localesToDownload) {
      var code = localesToDownload[i];
      LPS.IO.getLangpack(this.serverURL, uri, this.apps[uri].version, code, function(res) {
        if (res === null) {
          console.error('could not download langpack for '+uri+' for locale '+code);
          if (cb) {
            cb(false);
          }
        }
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
        downloadedLocales++;
        if (downloadedLocales == localesToDownload.length) {
          if (cb) {
            cb(true);
          }
        }
      });
    }
  }
}

LPS.prototype.getSupportedLanguages = function(cb) {
  var languageNames = {};
  for (var i in this.systemLanguageNames) {
    languageNames[i] = this.systemLanguageNames[i];
  }
  for (var i in this.languageNames) {
    languageNames[i] = this.languageNames[i];
  }
  cb(languageNames);
}

LPS.prototype.addSystemLanguages = function(locales, cb) {
  this.systemLanguageNames = locales;
  cb();
}

LPS.prototype.startTicks = function() {
  this.tick();
  this.I = setInterval(this.tick.bind(this), 10000);
}

LPS.prototype.stopTicks = function() {
  this.I = clearInterval(this.I);
}

////////////////// Service - Server shim

LPS.IO = function () {
}

LPS.IO.loadAsync = function(href, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onerror = function() {
    console.error('Failed to fetch file: ' + href, xhr.statusText);
  };
  xhr.onload = function() {
    callback(xhr.response);
  };
  xhr.open('GET', href, true); // async
  xhr.responseType = 'json';
  xhr.send();
}

LPS.IO.getAvailable = function(serverUrl, uris, cb) {
  if (serverUrl) {
    var url = serverUrl + '/available?domains='+uris;
    LPS.IO.loadAsync(url, cb);
    return;
  }
  
  cb({
    'domains': {
      "localhost": {
        "de": 1
      }
    },
    'nativeNames': {
      "de": "Deutsch",
    }
  });
}

LPS.IO.getLangpack = function(serverUrl, domain, version, locale, cb) {
  if (serverUrl) {
    var url = serverUrl + '/resource?domain='+domain+'&version='+version+'&locale='+locale;
    LPS.IO.loadAsync(url, cb);
    return;
  }

  cb({
    '/locales/{{locale}}/music.l20n': '<title "Hello world">',
    '/locales/{{locale}}/foo.l20n': '<foo "Foo">',
    '/locales/{{locale}}/notifications.l20n': '<up "Up!">',
  });
}
