if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(function (require, exports) {
  'use strict';

  var io = require('./io');

  function LangPackClient(ctx) {

    this.registerLocales = registerLocales;
    this.registerLocaleNegotiator = registerLocaleNegotiator;
    this.negotiateLocales = negotiateLocales;
    this.getResource = getResource;

    // registered and available languages
    var _default = 'i-default';
    var _registered = [_default];

    // language negotiator function
    var _negotiator;

    var _localesFromService = [];

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
            _localesFromService.push(fallbackChain[i].code);
          }
          locales.push(fallbackChain[i]['code']);
        }
        callback(locales);
      }
      lps.negotiateLocales(ctx.id, requested, cb);
    }

    function getResource(res, callback, sync) {
      if (_localesFromService.indexOf(res.locale.id) === -1) {
        var re = /{{\s*locale\s*}}/;
        var uri = res.id.replace(re, res.locale.id);
        io.load(uri, callback, sync);
      } else {
        lps.getResources(ctx.id, [res.id], [res.locale.id], getSource);
      }

      function getSource(resources) {
        // parse(err, text)
        callback(null, resources[res.locale.id][res.id]);
      }
    }

  }

  exports.LangPackClient = LangPackClient;

});
