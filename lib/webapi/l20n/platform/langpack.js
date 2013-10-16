if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function LangPackClient(ctx) {

    this.registerLocales = registerLocales;
    this.registerLocaleNegotiator = registerLocaleNegotiator;
    this.negotiateLocales = negotiateLocales;

    // registered and available languages
    var _default = 'i-default';
    var _registered = [_default];

    // language negotiator function
    var _negotiator;

    function registerLocales(defLocale, registered) {
      _default = defLocale;
      _registered = registered;
    }

    function registerLocaleNegotiator(negotiator) {
      _negotiator = negotiator;
    }

    function negotiateLocales(requested, callback) {
      function cb(fallbackChain) {
        var locales = [];
        for (var i in fallbackChain) {
          if (fallbackChain[i]['source'] == 'service') {
            locales.push(fallbackChain[i]['code']);
          }
        }
        callback(locales);
      }
      lps.negotiateLocales(ctx.id, requested, cb);
    }

  }

  exports.LangPackClient = LangPackClient;

});
