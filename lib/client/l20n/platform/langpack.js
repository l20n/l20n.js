if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  function LangPackClient() {

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
      if (!_negotiator) {
        var Intl = require('../intl').Intl;
        _negotiator = Intl.prioritizeLocales;
      }
      var fallbackChain = _negotiator(_registered, requested, _default,
                                      callback);
      // sync if _negotiator is sync too
      if (fallbackChain) {
        callback(fallbackChain);
      }
    }

  }

  exports.LangPackClient = LangPackClient;

});
