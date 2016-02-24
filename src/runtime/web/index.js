'use strict';

/* global Promise, Context, onReady, whenInteractive, init */

var DEBUG = false;

navigator.mozL10n.ctx = new Context(window.document ? document.URL : null);
navigator.mozL10n.ctx.ready(onReady.bind(navigator.mozL10n));

navigator.mozL10n.ctx.addEventListener('notfounderror',
  function reportMissingEntity(e) {
    if (DEBUG || e.loc === 'en-US') {
      console.warn(e.toString());
    }
});

if (DEBUG) {
  navigator.mozL10n.ctx.addEventListener('fetcherror',
    console.error.bind(console));
  navigator.mozL10n.ctx.addEventListener('parseerror',
    console.error.bind(console));
  navigator.mozL10n.ctx.addEventListener('resolveerror',
    console.error.bind(console));
}

if (window.document) {
  navigator.mozL10n._config.isPretranslated =
    document.documentElement.lang === navigator.language;

  var forcePretranslate = !navigator.mozL10n._config.isPretranslated;
  whenInteractive(init.bind(navigator.mozL10n, forcePretranslate));
}

document.l10n = {
  setAttributes: navigator.mozL10n.setAttributes,
  getAttributes: navigator.mozL10n.getAttributes,
  formatValue: function(id, args) {
    return navigator.mozL10n.formatValue(id, args);
  },
  translateFragment: function (frag) {
    return Promise.resolve(navigator.mozL10n.translateFragment(frag));
  },
  ready: new Promise(function(resolve) {
    navigator.mozL10n.once(resolve);
  }),
  formatValues: function() {
    var keys = arguments;
    var resp = keys.map(function(key) {
      if (Array.isArray(key)) {
        return navigator.mozL10n.formatValue(key[0], key[1]);
      }
      return navigator.mozL10n.formatValue(key);
    });

    return Promise.all(resp);
  },
  requestLanguages: function(langs) {
    // XXX real l20n returns a promise
    navigator.mozL10n.ctx.requestLocales.apply(
      navigator.mozL10n.ctx, langs);
  },
  get pseudo() {
    var result = {};
    /*jshint -W083 */
    for (var code in navigator.mozL10n.qps) {
      result[code] = {
        getName: function() {
          return Promise.resolve(navigator.mozL10n.qps[code].name);
        },
        processString: function(s) {
         return Promise.resolve(
          navigator.mozL10n.qps[code].translate(s));
        }
      };
    }
    return result;
  }
};

navigator.mozL10n.ready(function() {
  document.documentElement.setAttribute(
    'langs', navigator.mozL10n.ctx.supportedLocales.join(' '));
});

navigator.mozL10n.once(function() {
  window.addEventListener('localized', function() {
    document.dispatchEvent(new CustomEvent('DOMRetranslated', {
      bubbles: false,
      cancelable: false
    }));
  });
});
