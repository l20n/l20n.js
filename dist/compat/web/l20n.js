'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  'use strict';

  function emit(listeners) {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var type = args.shift();

    if (listeners['*']) {
      listeners['*'].slice().forEach(function (listener) {
        return listener.apply(_this, args);
      });
    }

    if (listeners[type]) {
      listeners[type].slice().forEach(function (listener) {
        return listener.apply(_this, args);
      });
    }
  }

  function addEventListener(listeners, type, listener) {
    if (!(type in listeners)) {
      listeners[type] = [];
    }
    listeners[type].push(listener);
  }

  function removeEventListener(listeners, type, listener) {
    var typeListeners = listeners[type];
    var pos = typeListeners.indexOf(listener);
    if (pos === -1) {
      return;
    }

    typeListeners.splice(pos, 1);
  }

  var Client = (function () {
    function Client(remote) {
      _classCallCheck(this, Client);

      this.id = this;
      this.remote = remote;

      var listeners = {};
      this.on = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return addEventListener.apply(undefined, [listeners].concat(args));
      };
      this.emit = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return emit.apply(undefined, [listeners].concat(args));
      };
    }

    Client.prototype.method = function method(name) {
      var _remote;

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return (_remote = this.remote)[name].apply(_remote, args);
    };

    return Client;
  })();

  function broadcast(type, data) {
    Array.from(this.ctxs.keys()).forEach(function (client) {
      return client.emit(type, data);
    });
  }

  function L10nError(message, id, lang) {
    this.name = 'L10nError';
    this.message = message;
    this.id = id;
    this.lang = lang;
  }
  L10nError.prototype = Object.create(Error.prototype);
  L10nError.prototype.constructor = L10nError;

  var HTTP_STATUS_CODE_OK = 200;

  function load(type, url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      if (xhr.overrideMimeType) {
        xhr.overrideMimeType(type);
      }

      xhr.open('GET', url, true);

      if (type === 'application/json') {
        xhr.responseType = 'json';
      }

      xhr.addEventListener('load', function (e) {
        if (e.target.status === HTTP_STATUS_CODE_OK || e.target.status === 0) {
          resolve(e.target.response);
        } else {
          reject(new L10nError('Not found: ' + url));
        }
      });
      xhr.addEventListener('error', reject);
      xhr.addEventListener('timeout', reject);

      try {
        xhr.send(null);
      } catch (e) {
        if (e.name === 'NS_ERROR_FILE_NOT_FOUND') {
          reject(new L10nError('Not found: ' + url));
        } else {
          throw e;
        }
      }
    });
  }

  var io = {
    extra: function (code, ver, path, type) {
      return navigator.mozApps.getLocalizationResource(code, ver, path, type);
    },
    app: function (code, ver, path, type) {
      switch (type) {
        case 'text':
          return load('text/plain', path);
        case 'json':
          return load('application/json', path);
        default:
          throw new L10nError('Unknown file type: ' + type);
      }
    }
  };

  function fetchResource(res, _ref4) {
    var code = _ref4.code;
    var src = _ref4.src;
    var ver = _ref4.ver;

    var url = res.replace('{locale}', code);
    var type = res.endsWith('.json') ? 'json' : 'text';
    return io[src](code, ver, url, type);
  }

  var KNOWN_MACROS = ['plural'];
  var MAX_PLACEABLE_LENGTH = 2500;

  var FSI = '⁨';
  var PDI = '⁩';

  var resolutionChain = new WeakSet();

  function format(ctx, lang, args, entity) {
    if (typeof entity === 'string') {
      return [{}, entity];
    }

    if (resolutionChain.has(entity)) {
      throw new L10nError('Cyclic reference detected');
    }

    resolutionChain.add(entity);

    var rv = undefined;

    try {
      rv = resolveValue({}, ctx, lang, args, entity.value, entity.index);
    } finally {
      resolutionChain.delete(entity);
    }
    return rv;
  }

  function resolveIdentifier(ctx, lang, args, id) {
    if (KNOWN_MACROS.indexOf(id) > -1) {
      return [{}, ctx._getMacro(lang, id)];
    }

    if (args && args.hasOwnProperty(id)) {
      if (typeof args[id] === 'string' || typeof args[id] === 'number' && !isNaN(args[id])) {
        return [{}, args[id]];
      } else {
        throw new L10nError('Arg must be a string or a number: ' + id);
      }
    }

    if (id === '__proto__') {
      throw new L10nError('Illegal id: ' + id);
    }

    var entity = ctx._getEntity(lang, id);

    if (entity) {
      return format(ctx, lang, args, entity);
    }

    throw new L10nError('Unknown reference: ' + id);
  }

  function subPlaceable(locals, ctx, lang, args, id) {
    var newLocals = undefined,
        value = undefined;

    try {
      var _resolveIdentifier = resolveIdentifier(ctx, lang, args, id);

      newLocals = _resolveIdentifier[0];
      value = _resolveIdentifier[1];
    } catch (err) {
      return [{ error: err }, FSI + '{{ ' + id + ' }}' + PDI];
    }

    if (typeof value === 'number') {
      var formatter = ctx._getNumberFormatter(lang);
      return [newLocals, formatter.format(value)];
    }

    if (typeof value === 'string') {
      if (value.length >= MAX_PLACEABLE_LENGTH) {
        throw new L10nError('Too many characters in placeable (' + value.length + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')');
      }
      return [newLocals, FSI + value + PDI];
    }

    return [{}, FSI + '{{ ' + id + ' }}' + PDI];
  }

  function interpolate(locals, ctx, lang, args, arr) {
    return arr.reduce(function (_ref5, cur) {
      var localsSeq = _ref5[0];
      var valueSeq = _ref5[1];

      if (typeof cur === 'string') {
        return [localsSeq, valueSeq + cur];
      } else {
        var _subPlaceable = subPlaceable(locals, ctx, lang, args, cur.name);

        var value = _subPlaceable[1];

        return [localsSeq, valueSeq + value];
      }
    }, [locals, '']);
  }

  function resolveSelector(ctx, lang, args, expr, index) {
    var selectorName = undefined;
    if (index[0].type === 'call' && index[0].expr.type === 'prop' && index[0].expr.expr.name === 'cldr') {
      selectorName = 'plural';
    } else {
      selectorName = index[0].name;
    }
    var selector = resolveIdentifier(ctx, lang, args, selectorName)[1];

    if (typeof selector !== 'function') {
      return selector;
    }

    var argValue = index[0].args ? resolveIdentifier(ctx, lang, args, index[0].args[0].name)[1] : undefined;

    if (selectorName === 'plural') {
      if (argValue === 0 && 'zero' in expr) {
        return 'zero';
      }
      if (argValue === 1 && 'one' in expr) {
        return 'one';
      }
      if (argValue === 2 && 'two' in expr) {
        return 'two';
      }
    }

    return selector(argValue);
  }

  function resolveValue(locals, ctx, lang, args, expr, index) {
    if (!expr) {
      return [locals, expr];
    }

    if (typeof expr === 'string' || typeof expr === 'boolean' || typeof expr === 'number') {
      return [locals, expr];
    }

    if (Array.isArray(expr)) {
      return interpolate(locals, ctx, lang, args, expr);
    }

    if (index) {
      var selector = resolveSelector(ctx, lang, args, expr, index);
      if (selector in expr) {
        return resolveValue(locals, ctx, lang, args, expr[selector]);
      }
    }

    var defaultKey = expr.__default || 'other';
    if (defaultKey in expr) {
      return resolveValue(locals, ctx, lang, args, expr[defaultKey]);
    }

    throw new L10nError('Unresolvable value');
  }

  var locales2rules = {
    'af': 3,
    'ak': 4,
    'am': 4,
    'ar': 1,
    'asa': 3,
    'az': 0,
    'be': 11,
    'bem': 3,
    'bez': 3,
    'bg': 3,
    'bh': 4,
    'bm': 0,
    'bn': 3,
    'bo': 0,
    'br': 20,
    'brx': 3,
    'bs': 11,
    'ca': 3,
    'cgg': 3,
    'chr': 3,
    'cs': 12,
    'cy': 17,
    'da': 3,
    'de': 3,
    'dv': 3,
    'dz': 0,
    'ee': 3,
    'el': 3,
    'en': 3,
    'eo': 3,
    'es': 3,
    'et': 3,
    'eu': 3,
    'fa': 0,
    'ff': 5,
    'fi': 3,
    'fil': 4,
    'fo': 3,
    'fr': 5,
    'fur': 3,
    'fy': 3,
    'ga': 8,
    'gd': 24,
    'gl': 3,
    'gsw': 3,
    'gu': 3,
    'guw': 4,
    'gv': 23,
    'ha': 3,
    'haw': 3,
    'he': 2,
    'hi': 4,
    'hr': 11,
    'hu': 0,
    'id': 0,
    'ig': 0,
    'ii': 0,
    'is': 3,
    'it': 3,
    'iu': 7,
    'ja': 0,
    'jmc': 3,
    'jv': 0,
    'ka': 0,
    'kab': 5,
    'kaj': 3,
    'kcg': 3,
    'kde': 0,
    'kea': 0,
    'kk': 3,
    'kl': 3,
    'km': 0,
    'kn': 0,
    'ko': 0,
    'ksb': 3,
    'ksh': 21,
    'ku': 3,
    'kw': 7,
    'lag': 18,
    'lb': 3,
    'lg': 3,
    'ln': 4,
    'lo': 0,
    'lt': 10,
    'lv': 6,
    'mas': 3,
    'mg': 4,
    'mk': 16,
    'ml': 3,
    'mn': 3,
    'mo': 9,
    'mr': 3,
    'ms': 0,
    'mt': 15,
    'my': 0,
    'nah': 3,
    'naq': 7,
    'nb': 3,
    'nd': 3,
    'ne': 3,
    'nl': 3,
    'nn': 3,
    'no': 3,
    'nr': 3,
    'nso': 4,
    'ny': 3,
    'nyn': 3,
    'om': 3,
    'or': 3,
    'pa': 3,
    'pap': 3,
    'pl': 13,
    'ps': 3,
    'pt': 3,
    'rm': 3,
    'ro': 9,
    'rof': 3,
    'ru': 11,
    'rwk': 3,
    'sah': 0,
    'saq': 3,
    'se': 7,
    'seh': 3,
    'ses': 0,
    'sg': 0,
    'sh': 11,
    'shi': 19,
    'sk': 12,
    'sl': 14,
    'sma': 7,
    'smi': 7,
    'smj': 7,
    'smn': 7,
    'sms': 7,
    'sn': 3,
    'so': 3,
    'sq': 3,
    'sr': 11,
    'ss': 3,
    'ssy': 3,
    'st': 3,
    'sv': 3,
    'sw': 3,
    'syr': 3,
    'ta': 3,
    'te': 3,
    'teo': 3,
    'th': 0,
    'ti': 4,
    'tig': 3,
    'tk': 3,
    'tl': 4,
    'tn': 3,
    'to': 0,
    'tr': 0,
    'ts': 3,
    'tzm': 22,
    'uk': 11,
    'ur': 3,
    've': 3,
    'vi': 0,
    'vun': 3,
    'wa': 4,
    'wae': 3,
    'wo': 0,
    'xh': 3,
    'xog': 3,
    'yo': 0,
    'zh': 0,
    'zu': 3
  };

  function isIn(n, list) {
    return list.indexOf(n) !== -1;
  }
  function isBetween(n, start, end) {
    return typeof n === typeof start && start <= n && n <= end;
  }

  var pluralRules = {
    '0': function () {
      return 'other';
    },
    '1': function (n) {
      if (isBetween(n % 100, 3, 10)) {
        return 'few';
      }
      if (n === 0) {
        return 'zero';
      }
      if (isBetween(n % 100, 11, 99)) {
        return 'many';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '2': function (n) {
      if (n !== 0 && n % 10 === 0) {
        return 'many';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '3': function (n) {
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '4': function (n) {
      if (isBetween(n, 0, 1)) {
        return 'one';
      }
      return 'other';
    },
    '5': function (n) {
      if (isBetween(n, 0, 2) && n !== 2) {
        return 'one';
      }
      return 'other';
    },
    '6': function (n) {
      if (n === 0) {
        return 'zero';
      }
      if (n % 10 === 1 && n % 100 !== 11) {
        return 'one';
      }
      return 'other';
    },
    '7': function (n) {
      if (n === 2) {
        return 'two';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '8': function (n) {
      if (isBetween(n, 3, 6)) {
        return 'few';
      }
      if (isBetween(n, 7, 10)) {
        return 'many';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '9': function (n) {
      if (n === 0 || n !== 1 && isBetween(n % 100, 1, 19)) {
        return 'few';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '10': function (n) {
      if (isBetween(n % 10, 2, 9) && !isBetween(n % 100, 11, 19)) {
        return 'few';
      }
      if (n % 10 === 1 && !isBetween(n % 100, 11, 19)) {
        return 'one';
      }
      return 'other';
    },
    '11': function (n) {
      if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) {
        return 'few';
      }
      if (n % 10 === 0 || isBetween(n % 10, 5, 9) || isBetween(n % 100, 11, 14)) {
        return 'many';
      }
      if (n % 10 === 1 && n % 100 !== 11) {
        return 'one';
      }
      return 'other';
    },
    '12': function (n) {
      if (isBetween(n, 2, 4)) {
        return 'few';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '13': function (n) {
      if (isBetween(n % 10, 2, 4) && !isBetween(n % 100, 12, 14)) {
        return 'few';
      }
      if (n !== 1 && isBetween(n % 10, 0, 1) || isBetween(n % 10, 5, 9) || isBetween(n % 100, 12, 14)) {
        return 'many';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '14': function (n) {
      if (isBetween(n % 100, 3, 4)) {
        return 'few';
      }
      if (n % 100 === 2) {
        return 'two';
      }
      if (n % 100 === 1) {
        return 'one';
      }
      return 'other';
    },
    '15': function (n) {
      if (n === 0 || isBetween(n % 100, 2, 10)) {
        return 'few';
      }
      if (isBetween(n % 100, 11, 19)) {
        return 'many';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '16': function (n) {
      if (n % 10 === 1 && n !== 11) {
        return 'one';
      }
      return 'other';
    },
    '17': function (n) {
      if (n === 3) {
        return 'few';
      }
      if (n === 0) {
        return 'zero';
      }
      if (n === 6) {
        return 'many';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '18': function (n) {
      if (n === 0) {
        return 'zero';
      }
      if (isBetween(n, 0, 2) && n !== 0 && n !== 2) {
        return 'one';
      }
      return 'other';
    },
    '19': function (n) {
      if (isBetween(n, 2, 10)) {
        return 'few';
      }
      if (isBetween(n, 0, 1)) {
        return 'one';
      }
      return 'other';
    },
    '20': function (n) {
      if ((isBetween(n % 10, 3, 4) || n % 10 === 9) && !(isBetween(n % 100, 10, 19) || isBetween(n % 100, 70, 79) || isBetween(n % 100, 90, 99))) {
        return 'few';
      }
      if (n % 1000000 === 0 && n !== 0) {
        return 'many';
      }
      if (n % 10 === 2 && !isIn(n % 100, [12, 72, 92])) {
        return 'two';
      }
      if (n % 10 === 1 && !isIn(n % 100, [11, 71, 91])) {
        return 'one';
      }
      return 'other';
    },
    '21': function (n) {
      if (n === 0) {
        return 'zero';
      }
      if (n === 1) {
        return 'one';
      }
      return 'other';
    },
    '22': function (n) {
      if (isBetween(n, 0, 1) || isBetween(n, 11, 99)) {
        return 'one';
      }
      return 'other';
    },
    '23': function (n) {
      if (isBetween(n % 10, 1, 2) || n % 20 === 0) {
        return 'one';
      }
      return 'other';
    },
    '24': function (n) {
      if (isBetween(n, 3, 10) || isBetween(n, 13, 19)) {
        return 'few';
      }
      if (isIn(n, [2, 12])) {
        return 'two';
      }
      if (isIn(n, [1, 11])) {
        return 'one';
      }
      return 'other';
    }
  };

  function getPluralRule(code) {
    var index = locales2rules[code.replace(/-.*$/, '')];
    if (!(index in pluralRules)) {
      return function () {
        return 'other';
      };
    }
    return pluralRules[index];
  }

  var L20nIntl = typeof Intl !== 'undefined' ? Intl : {
    NumberFormat: function () {
      return {
        format: function (v) {
          return v;
        }
      };
    }
  };

  var Context = (function () {
    function Context(env, langs, resIds) {
      var _this2 = this;

      _classCallCheck(this, Context);

      this.langs = langs;
      this.resIds = resIds;
      this.env = env;
      this.emit = function (type, evt) {
        return env.emit(type, evt, _this2);
      };
    }

    Context.prototype._formatTuple = function _formatTuple(lang, args, entity, id, key) {
      try {
        return format(this, lang, args, entity);
      } catch (err) {
        err.id = key ? id + '::' + key : id;
        err.lang = lang;
        this.emit('resolveerror', err);
        return [{ error: err }, err.id];
      }
    };

    Context.prototype._formatEntity = function _formatEntity(lang, args, entity, id) {
      var _formatTuple2 = this._formatTuple(lang, args, entity, id);

      var value = _formatTuple2[1];

      var formatted = {
        value: value,
        attrs: null
      };

      if (entity.attrs) {
        formatted.attrs = Object.create(null);
        for (var key in entity.attrs) {
          var _formatTuple3 = this._formatTuple(lang, args, entity.attrs[key], id, key);

          var attrValue = _formatTuple3[1];

          formatted.attrs[key] = attrValue;
        }
      }

      return formatted;
    };

    Context.prototype._formatValue = function _formatValue(lang, args, entity, id) {
      return this._formatTuple(lang, args, entity, id)[1];
    };

    Context.prototype.fetch = function fetch() {
      var _this3 = this;

      var langs = arguments.length <= 0 || arguments[0] === undefined ? this.langs : arguments[0];

      if (langs.length === 0) {
        return Promise.resolve(langs);
      }

      return Promise.all(this.resIds.map(function (resId) {
        return _this3.env._getResource(langs[0], resId);
      })).then(function () {
        return langs;
      });
    };

    Context.prototype._resolve = function _resolve(langs, keys, formatter, prevResolved) {
      var _this4 = this;

      var lang = langs[0];

      if (!lang) {
        return reportMissing.call(this, keys, formatter, prevResolved);
      }

      var hasUnresolved = false;

      var resolved = keys.map(function (key, i) {
        if (prevResolved && prevResolved[i] !== undefined) {
          return prevResolved[i];
        }

        var _ref6 = Array.isArray(key) ? key : [key, undefined];

        var id = _ref6[0];
        var args = _ref6[1];

        var entity = _this4._getEntity(lang, id);

        if (entity) {
          return formatter.call(_this4, lang, args, entity, id);
        }

        _this4.emit('notfounderror', new L10nError('"' + id + '" not found in ' + lang.code, id, lang));
        hasUnresolved = true;
      });

      if (!hasUnresolved) {
        return resolved;
      }

      return this.fetch(langs.slice(1)).then(function (nextLangs) {
        return _this4._resolve(nextLangs, keys, formatter, resolved);
      });
    };

    Context.prototype.formatEntities = function formatEntities() {
      var _this5 = this;

      for (var _len5 = arguments.length, keys = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        keys[_key5] = arguments[_key5];
      }

      return this.fetch().then(function (langs) {
        return _this5._resolve(langs, keys, _this5._formatEntity);
      });
    };

    Context.prototype.formatValues = function formatValues() {
      var _this6 = this;

      for (var _len6 = arguments.length, keys = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        keys[_key6] = arguments[_key6];
      }

      return this.fetch().then(function (langs) {
        return _this6._resolve(langs, keys, _this6._formatValue);
      });
    };

    Context.prototype._getEntity = function _getEntity(lang, id) {
      var cache = this.env.resCache;

      for (var i = 0, resId = undefined; resId = this.resIds[i]; i++) {
        var resource = cache.get(resId + lang.code + lang.src);
        if (resource instanceof L10nError) {
          continue;
        }
        if (id in resource) {
          return resource[id];
        }
      }
      return undefined;
    };

    Context.prototype._getNumberFormatter = function _getNumberFormatter(lang) {
      if (!this.env.numberFormatters) {
        this.env.numberFormatters = new Map();
      }
      if (!this.env.numberFormatters.has(lang)) {
        var formatter = L20nIntl.NumberFormat(lang);
        this.env.numberFormatters.set(lang, formatter);
        return formatter;
      }
      return this.env.numberFormatters.get(lang);
    };

    Context.prototype._getMacro = function _getMacro(lang, id) {
      switch (id) {
        case 'plural':
          return getPluralRule(lang.code);
        default:
          return undefined;
      }
    };

    return Context;
  })();

  function reportMissing(keys, formatter, resolved) {
    var _this7 = this;

    var missingIds = new Set();

    keys.forEach(function (key, i) {
      if (resolved && resolved[i] !== undefined) {
        return;
      }
      var id = Array.isArray(key) ? key[0] : key;
      missingIds.add(id);
      resolved[i] = formatter === _this7._formatValue ? id : { value: id, attrs: null };
    });

    this.emit('notfounderror', new L10nError('"' + Array.from(missingIds).join(', ') + '"' + ' not found in any language', missingIds));

    return resolved;
  }

  var MAX_PLACEABLES = 100;

  var PropertiesParser = {
    patterns: null,
    entryIds: null,
    emit: null,

    init: function () {
      this.patterns = {
        comment: /^\s*#|^\s*$/,
        entity: /^([^=\s]+)\s*=\s*(.*)$/,
        multiline: /[^\\]\\$/,
        index: /\{\[\s*(\w+)(?:\(([^\)]*)\))?\s*\]\}/i,
        unicode: /\\u([0-9a-fA-F]{1,4})/g,
        entries: /[^\r\n]+/g,
        controlChars: /\\([\\\n\r\t\b\f\{\}\"\'])/g,
        placeables: /\{\{\s*([^\s]*?)\s*\}\}/
      };
    },

    parse: function (emit, source) {
      if (!this.patterns) {
        this.init();
      }
      this.emit = emit;

      var entries = {};

      var lines = source.match(this.patterns.entries);
      if (!lines) {
        return entries;
      }
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        if (this.patterns.comment.test(line)) {
          continue;
        }

        while (this.patterns.multiline.test(line) && i < lines.length) {
          line = line.slice(0, -1) + lines[++i].trim();
        }

        var entityMatch = line.match(this.patterns.entity);
        if (entityMatch) {
          try {
            this.parseEntity(entityMatch[1], entityMatch[2], entries);
          } catch (e) {
            if (!this.emit) {
              throw e;
            }
          }
        }
      }
      return entries;
    },

    parseEntity: function (id, value, entries) {
      var name = undefined,
          key = undefined;

      var pos = id.indexOf('[');
      if (pos !== -1) {
        name = id.substr(0, pos);
        key = id.substring(pos + 1, id.length - 1);
      } else {
        name = id;
        key = null;
      }

      var nameElements = name.split('.');

      if (nameElements.length > 2) {
        throw this.error('Error in ID: "' + name + '".' + ' Nested attributes are not supported.');
      }

      var attr = undefined;
      if (nameElements.length > 1) {
        name = nameElements[0];
        attr = nameElements[1];

        if (attr[0] === '$') {
          throw this.error('Attribute can\'t start with "$"');
        }
      } else {
        attr = null;
      }

      this.setEntityValue(name, attr, key, this.unescapeString(value), entries);
    },

    setEntityValue: function (id, attr, key, rawValue, entries) {
      var value = rawValue.indexOf('{{') > -1 ? this.parseString(rawValue) : rawValue;

      var isSimpleValue = typeof value === 'string';
      var root = entries;

      var isSimpleNode = typeof entries[id] === 'string';

      if (!entries[id] && (attr || key || !isSimpleValue)) {
        entries[id] = Object.create(null);
        isSimpleNode = false;
      }

      if (attr) {
        if (isSimpleNode) {
          var val = entries[id];
          entries[id] = Object.create(null);
          entries[id].value = val;
        }
        if (!entries[id].attrs) {
          entries[id].attrs = Object.create(null);
        }
        if (!entries[id].attrs && !isSimpleValue) {
          entries[id].attrs[attr] = Object.create(null);
        }
        root = entries[id].attrs;
        id = attr;
      }

      if (key) {
        isSimpleNode = false;
        if (typeof root[id] === 'string') {
          var val = root[id];
          root[id] = Object.create(null);
          root[id].index = this.parseIndex(val);
          root[id].value = Object.create(null);
        }
        root = root[id].value;
        id = key;
        isSimpleValue = true;
      }

      if (isSimpleValue) {
        if (id in root) {
          throw this.error('Duplicated id: ' + id);
        }
        root[id] = value;
      } else {
        if (!root[id]) {
          root[id] = Object.create(null);
        }
        root[id].value = value;
      }
    },

    parseString: function (str) {
      var chunks = str.split(this.patterns.placeables);
      var complexStr = [];

      var len = chunks.length;
      var placeablesCount = (len - 1) / 2;

      if (placeablesCount >= MAX_PLACEABLES) {
        throw this.error('Too many placeables (' + placeablesCount + ', max allowed is ' + MAX_PLACEABLES + ')');
      }

      for (var i = 0; i < chunks.length; i++) {
        if (chunks[i].length === 0) {
          continue;
        }
        if (i % 2 === 1) {
          complexStr.push({ type: 'idOrVar', name: chunks[i] });
        } else {
          complexStr.push(chunks[i]);
        }
      }
      return complexStr;
    },

    unescapeString: function (str) {
      if (str.lastIndexOf('\\') !== -1) {
        str = str.replace(this.patterns.controlChars, '$1');
      }
      return str.replace(this.patterns.unicode, function (match, token) {
        return String.fromCodePoint(parseInt(token, 16));
      });
    },

    parseIndex: function (str) {
      var match = str.match(this.patterns.index);
      if (!match) {
        throw new L10nError('Malformed index');
      }
      if (match[2]) {
        return [{
          type: 'call',
          expr: {
            type: 'prop',
            expr: {
              type: 'glob',
              name: 'cldr'
            },
            prop: 'plural',
            cmpt: false
          }, args: [{
            type: 'idOrVar',
            name: match[2]
          }]
        }];
      } else {
        return [{ type: 'idOrVar', name: match[1] }];
      }
    },

    error: function (msg) {
      var type = arguments.length <= 1 || arguments[1] === undefined ? 'parsererror' : arguments[1];

      var err = new L10nError(msg);
      if (this.emit) {
        this.emit(type, err);
      }
      return err;
    }
  };

  var MAX_PLACEABLES$1 = 100;

  var L20nParser = {
    parse: function (emit, string) {
      this._source = string;
      this._index = 0;
      this._length = string.length;
      this.entries = Object.create(null);
      this.emit = emit;

      return this.getResource();
    },

    getResource: function () {
      this.getWS();
      while (this._index < this._length) {
        try {
          this.getEntry();
        } catch (e) {
          if (e instanceof L10nError) {
            this.getJunkEntry();
            if (!this.emit) {
              throw e;
            }
          } else {
            throw e;
          }
        }

        if (this._index < this._length) {
          this.getWS();
        }
      }

      return this.entries;
    },

    getEntry: function () {
      if (this._source[this._index] === '<') {
        ++this._index;
        var id = this.getIdentifier();
        if (this._source[this._index] === '[') {
          ++this._index;
          return this.getEntity(id, this.getItemList(this.getExpression, ']'));
        }
        return this.getEntity(id);
      }

      if (this._source.startsWith('/*', this._index)) {
        return this.getComment();
      }

      throw this.error('Invalid entry');
    },

    getEntity: function (id, index) {
      if (!this.getRequiredWS()) {
        throw this.error('Expected white space');
      }

      var ch = this._source[this._index];
      var hasIndex = index !== undefined;
      var value = this.getValue(ch, hasIndex, hasIndex);
      var attrs = undefined;

      if (value === undefined) {
        if (ch === '>') {
          throw this.error('Expected ">"');
        }
        attrs = this.getAttributes();
      } else {
        var ws1 = this.getRequiredWS();
        if (this._source[this._index] !== '>') {
          if (!ws1) {
            throw this.error('Expected ">"');
          }
          attrs = this.getAttributes();
        }
      }

      ++this._index;

      if (id in this.entries) {
        throw this.error('Duplicate entry ID "' + id, 'duplicateerror');
      }
      if (!attrs && !index && typeof value === 'string') {
        this.entries[id] = value;
      } else {
        this.entries[id] = {
          value: value,
          attrs: attrs,
          index: index
        };
      }
    },

    getValue: function () {
      var ch = arguments.length <= 0 || arguments[0] === undefined ? this._source[this._index] : arguments[0];
      var index = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var required = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      switch (ch) {
        case '\'':
        case '"':
          return this.getString(ch, 1);
        case '{':
          return this.getHash(index);
      }

      if (required) {
        throw this.error('Unknown value type');
      }

      return undefined;
    },

    getWS: function () {
      var cc = this._source.charCodeAt(this._index);

      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
    },

    getRequiredWS: function () {
      var pos = this._index;
      var cc = this._source.charCodeAt(pos);

      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
      return this._index !== pos;
    },

    getIdentifier: function () {
      var start = this._index;
      var cc = this._source.charCodeAt(this._index);

      if (cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc === 95) {
        cc = this._source.charCodeAt(++this._index);
      } else {
        throw this.error('Identifier has to start with [a-zA-Z_]');
      }

      while (cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc >= 48 && cc <= 57 || cc === 95) {
        cc = this._source.charCodeAt(++this._index);
      }

      return this._source.slice(start, this._index);
    },

    getUnicodeChar: function () {
      for (var i = 0; i < 4; i++) {
        var cc = this._source.charCodeAt(++this._index);
        if (cc > 96 && cc < 103 || cc > 64 && cc < 71 || cc > 47 && cc < 58) {
          continue;
        }
        throw this.error('Illegal unicode escape sequence');
      }
      this._index++;
      return String.fromCharCode(parseInt(this._source.slice(this._index - 4, this._index), 16));
    },

    stringRe: /"|'|{{|\\/g,
    getString: function (opchar, opcharLen) {
      var body = [];
      var placeables = 0;

      this._index += opcharLen;
      var start = this._index;

      var bufStart = start;
      var buf = '';

      while (true) {
        this.stringRe.lastIndex = this._index;
        var match = this.stringRe.exec(this._source);

        if (!match) {
          throw this.error('Unclosed string literal');
        }

        if (match[0] === '"' || match[0] === '\'') {
          if (match[0] !== opchar) {
            this._index += opcharLen;
            continue;
          }
          this._index = match.index + opcharLen;
          break;
        }

        if (match[0] === '{{') {
          if (placeables > MAX_PLACEABLES$1 - 1) {
            throw this.error('Too many placeables, maximum allowed is ' + MAX_PLACEABLES$1);
          }
          placeables++;
          if (match.index > bufStart || buf.length > 0) {
            body.push(buf + this._source.slice(bufStart, match.index));
            buf = '';
          }
          this._index = match.index + 2;
          this.getWS();
          body.push(this.getExpression());
          this.getWS();
          this._index += 2;
          bufStart = this._index;
          continue;
        }

        if (match[0] === '\\') {
          this._index = match.index + 1;
          var ch2 = this._source[this._index];
          if (ch2 === 'u') {
            buf += this._source.slice(bufStart, match.index) + this.getUnicodeChar();
          } else if (ch2 === opchar || ch2 === '\\') {
            buf += this._source.slice(bufStart, match.index) + ch2;
            this._index++;
          } else if (this._source.startsWith('{{', this._index)) {
            buf += this._source.slice(bufStart, match.index) + '{{';
            this._index += 2;
          } else {
            throw this.error('Illegal escape sequence');
          }
          bufStart = this._index;
        }
      }

      if (body.length === 0) {
        return buf + this._source.slice(bufStart, this._index - opcharLen);
      }

      if (this._index - opcharLen > bufStart || buf.length > 0) {
        body.push(buf + this._source.slice(bufStart, this._index - opcharLen));
      }

      return body;
    },

    getAttributes: function () {
      var attrs = Object.create(null);

      while (true) {
        this.getAttribute(attrs);
        var ws1 = this.getRequiredWS();
        var ch = this._source.charAt(this._index);
        if (ch === '>') {
          break;
        } else if (!ws1) {
          throw this.error('Expected ">"');
        }
      }
      return attrs;
    },

    getAttribute: function (attrs) {
      var key = this.getIdentifier();
      var index = undefined;

      if (this._source[this._index] === '[') {
        ++this._index;
        this.getWS();
        index = this.getItemList(this.getExpression, ']');
      }
      this.getWS();
      if (this._source[this._index] !== ':') {
        throw this.error('Expected ":"');
      }
      ++this._index;
      this.getWS();
      var hasIndex = index !== undefined;
      var value = this.getValue(undefined, hasIndex);

      if (key in attrs) {
        throw this.error('Duplicate attribute "' + key, 'duplicateerror');
      }

      if (!index && typeof value === 'string') {
        attrs[key] = value;
      } else {
        attrs[key] = {
          value: value,
          index: index
        };
      }
    },

    getHash: function (index) {
      var items = Object.create(null);

      ++this._index;
      this.getWS();

      var defKey = undefined;

      while (true) {
        var _getHashItem = this.getHashItem();

        var key = _getHashItem[0];
        var value = _getHashItem[1];
        var def = _getHashItem[2];

        items[key] = value;

        if (def) {
          if (defKey) {
            throw this.error('Default item redefinition forbidden');
          }
          defKey = key;
        }
        this.getWS();

        var comma = this._source[this._index] === ',';
        if (comma) {
          ++this._index;
          this.getWS();
        }
        if (this._source[this._index] === '}') {
          ++this._index;
          break;
        }
        if (!comma) {
          throw this.error('Expected "}"');
        }
      }

      if (defKey) {
        items.__default = defKey;
      } else if (!index) {
        throw this.error('Unresolvable Hash Value');
      }

      return items;
    },

    getHashItem: function () {
      var defItem = false;
      if (this._source[this._index] === '*') {
        ++this._index;
        defItem = true;
      }

      var key = this.getIdentifier();
      this.getWS();
      if (this._source[this._index] !== ':') {
        throw this.error('Expected ":"');
      }
      ++this._index;
      this.getWS();

      return [key, this.getValue(), defItem];
    },

    getComment: function () {
      this._index += 2;
      var start = this._index;
      var end = this._source.indexOf('*/', start);

      if (end === -1) {
        throw this.error('Comment without a closing tag');
      }

      this._index = end + 2;
    },

    getExpression: function () {
      var exp = this.getPrimaryExpression();

      while (true) {
        var ch = this._source[this._index];
        if (ch === '.' || ch === '[') {
          ++this._index;
          exp = this.getPropertyExpression(exp, ch === '[');
        } else if (ch === '(') {
          ++this._index;
          exp = this.getCallExpression(exp);
        } else {
          break;
        }
      }

      return exp;
    },

    getPropertyExpression: function (idref, computed) {
      var exp = undefined;

      if (computed) {
        this.getWS();
        exp = this.getExpression();
        this.getWS();
        if (this._source[this._index] !== ']') {
          throw this.error('Expected "]"');
        }
        ++this._index;
      } else {
        exp = this.getIdentifier();
      }

      return {
        type: 'prop',
        expr: idref,
        prop: exp,
        cmpt: computed
      };
    },

    getCallExpression: function (callee) {
      this.getWS();

      return {
        type: 'call',
        expr: callee,
        args: this.getItemList(this.getExpression, ')')
      };
    },

    getPrimaryExpression: function () {
      var ch = this._source[this._index];

      switch (ch) {
        case '$':
          ++this._index;
          return {
            type: 'var',
            name: this.getIdentifier()
          };
        case '@':
          ++this._index;
          return {
            type: 'glob',
            name: this.getIdentifier()
          };
        default:
          return {
            type: 'id',
            name: this.getIdentifier()
          };
      }
    },

    getItemList: function (callback, closeChar) {
      var items = [];
      var closed = false;

      this.getWS();

      if (this._source[this._index] === closeChar) {
        ++this._index;
        closed = true;
      }

      while (!closed) {
        items.push(callback.call(this));
        this.getWS();
        var ch = this._source.charAt(this._index);
        switch (ch) {
          case ',':
            ++this._index;
            this.getWS();
            break;
          case closeChar:
            ++this._index;
            closed = true;
            break;
          default:
            throw this.error('Expected "," or "' + closeChar + '"');
        }
      }

      return items;
    },

    getJunkEntry: function () {
      var pos = this._index;
      var nextEntity = this._source.indexOf('<', pos);
      var nextComment = this._source.indexOf('/*', pos);

      if (nextEntity === -1) {
        nextEntity = this._length;
      }
      if (nextComment === -1) {
        nextComment = this._length;
      }

      var nextEntry = Math.min(nextEntity, nextComment);

      this._index = nextEntry;
    },

    error: function (message) {
      var type = arguments.length <= 1 || arguments[1] === undefined ? 'parsererror' : arguments[1];

      var pos = this._index;

      var start = this._source.lastIndexOf('<', pos - 1);
      var lastClose = this._source.lastIndexOf('>', pos - 1);
      start = lastClose > start ? lastClose + 1 : start;
      var context = this._source.slice(start, pos + 10);

      var msg = message + ' at pos ' + pos + ': `' + context + '`';
      var err = new L10nError(msg);
      if (this.emit) {
        this.emit(type, err);
      }
      return err;
    }
  };

  function walkEntry(entry, fn) {
    if (typeof entry === 'string') {
      return fn(entry);
    }

    var newEntry = Object.create(null);

    if (entry.value) {
      newEntry.value = walkValue(entry.value, fn);
    }

    if (entry.index) {
      newEntry.index = entry.index;
    }

    if (entry.attrs) {
      newEntry.attrs = Object.create(null);
      for (var key in entry.attrs) {
        newEntry.attrs[key] = walkEntry(entry.attrs[key], fn);
      }
    }

    return newEntry;
  }

  function walkValue(value, fn) {
    if (typeof value === 'string') {
      return fn(value);
    }

    if (value.type) {
      return value;
    }

    var newValue = Array.isArray(value) ? [] : Object.create(null);
    var keys = Object.keys(value);

    for (var i = 0, key = undefined; key = keys[i]; i++) {
      newValue[key] = walkValue(value[key], fn);
    }

    return newValue;
  }

  function createGetter(id, name) {
    var _pseudo = null;

    return function getPseudo() {
      if (_pseudo) {
        return _pseudo;
      }

      var reAlphas = /[a-zA-Z]/g;
      var reVowels = /[aeiouAEIOU]/g;
      var reWords = /[^\W0-9_]+/g;

      var reExcluded = /(%[EO]?\w|\{\s*.+?\s*\}|&[#\w]+;|<\s*.+?\s*>)/;

      var charMaps = {
        'fr-x-psaccent': 'ȦƁƇḒḖƑƓĦĪĴĶĿḾȠǾƤɊŘŞŦŬṼẆẊẎẐ[\\]^_`ȧƀƈḓḗƒɠħīĵķŀḿƞǿƥɋřşŧŭṽẇẋẏẑ',
        'ar-x-psbidi': '∀ԐↃpƎɟפHIſӼ˥WNOԀÒᴚS⊥∩ɅＭXʎZ[\\]ᵥ_,ɐqɔpǝɟƃɥıɾʞʅɯuodbɹsʇnʌʍxʎz'
      };

      var mods = {
        'fr-x-psaccent': function (val) {
          return val.replace(reVowels, function (match) {
            return match + match.toLowerCase();
          });
        },

        'ar-x-psbidi': function (val) {
          return val.replace(reWords, function (match) {
            return '‮' + match + '‬';
          });
        }
      };

      var ASCII_LETTER_A = 65;
      var replaceChars = function (map, val) {
        return val.replace(reAlphas, function (match) {
          return map.charAt(match.charCodeAt(0) - ASCII_LETTER_A);
        });
      };

      var transform = function (val) {
        return replaceChars(charMaps[id], mods[id](val));
      };

      var apply = function (fn, val) {
        if (!val) {
          return val;
        }

        var parts = val.split(reExcluded);
        var modified = parts.map(function (part) {
          if (reExcluded.test(part)) {
            return part;
          }
          return fn(part);
        });
        return modified.join('');
      };

      return _pseudo = {
        name: transform(name),
        process: function (str) {
          return apply(transform, str);
        }
      };
    };
  }

  var pseudo = Object.defineProperties(Object.create(null), {
    'fr-x-psaccent': {
      enumerable: true,
      get: createGetter('fr-x-psaccent', 'Runtime Accented')
    },
    'ar-x-psbidi': {
      enumerable: true,
      get: createGetter('ar-x-psbidi', 'Runtime Bidi')
    }
  });

  var Env = (function () {
    function Env(fetchResource) {
      _classCallCheck(this, Env);

      this.fetchResource = fetchResource;

      this.resCache = new Map();
      this.resRefs = new Map();
      this.numberFormatters = null;
      this.parsers = {
        properties: PropertiesParser,
        l20n: L20nParser
      };

      var listeners = {};
      this.emit = emit.bind(this, listeners);
      this.addEventListener = addEventListener.bind(this, listeners);
      this.removeEventListener = removeEventListener.bind(this, listeners);
    }

    Env.prototype.createContext = function createContext(langs, resIds) {
      var _this8 = this;

      var ctx = new Context(this, langs, resIds);
      resIds.forEach(function (resId) {
        var usedBy = _this8.resRefs.get(resId) || 0;
        _this8.resRefs.set(resId, usedBy + 1);
      });

      return ctx;
    };

    Env.prototype.destroyContext = function destroyContext(ctx) {
      var _this9 = this;

      ctx.resIds.forEach(function (resId) {
        var usedBy = _this9.resRefs.get(resId) || 0;

        if (usedBy > 1) {
          return _this9.resRefs.set(resId, usedBy - 1);
        }

        _this9.resRefs.delete(resId);
        _this9.resCache.forEach(function (val, key) {
          return key.startsWith(resId) ? _this9.resCache.delete(key) : null;
        });
      });
    };

    Env.prototype._parse = function _parse(syntax, lang, data) {
      var _this10 = this;

      var parser = this.parsers[syntax];
      if (!parser) {
        return data;
      }

      var emitAndAmend = function (type, err) {
        return _this10.emit(type, amendError(lang, err));
      };
      return parser.parse(emitAndAmend, data);
    };

    Env.prototype._create = function _create(lang, entries) {
      if (lang.src !== 'pseudo') {
        return entries;
      }

      var pseudoentries = Object.create(null);
      for (var key in entries) {
        pseudoentries[key] = walkEntry(entries[key], pseudo[lang.code].process);
      }
      return pseudoentries;
    };

    Env.prototype._getResource = function _getResource(lang, res) {
      var _this11 = this;

      var cache = this.resCache;
      var id = res + lang.code + lang.src;

      if (cache.has(id)) {
        return cache.get(id);
      }

      var syntax = res.substr(res.lastIndexOf('.') + 1);

      var saveEntries = function (data) {
        var entries = _this11._parse(syntax, lang, data);
        cache.set(id, _this11._create(lang, entries));
      };

      var recover = function (err) {
        err.lang = lang;
        _this11.emit('fetcherror', err);
        cache.set(id, err);
      };

      var langToFetch = lang.src === 'pseudo' ? { code: 'en-US', src: 'app', ver: lang.ver } : lang;

      var resource = this.fetchResource(res, langToFetch).then(saveEntries, recover);

      cache.set(id, resource);

      return resource;
    };

    return Env;
  })();

  function amendError(lang, err) {
    err.lang = lang;
    return err;
  }

  function prioritizeLocales(def, availableLangs, requested) {
    var supportedLocale = undefined;

    for (var i = 0; i < requested.length; i++) {
      var locale = requested[i];
      if (availableLangs.indexOf(locale) !== -1) {
        supportedLocale = locale;
        break;
      }
    }
    if (!supportedLocale || supportedLocale === def) {
      return [def];
    }

    return [supportedLocale, def];
  }

  function negotiateLanguages(_ref7, additionalLangs, prevLangs, requestedLangs) {
    var appVersion = _ref7.appVersion;
    var defaultLang = _ref7.defaultLang;
    var availableLangs = _ref7.availableLangs;

    var allAvailableLangs = Object.keys(availableLangs).concat(Object.keys(additionalLangs)).concat(Object.keys(pseudo));
    var newLangs = prioritizeLocales(defaultLang, allAvailableLangs, requestedLangs);

    var langs = newLangs.map(function (code) {
      return {
        code: code,
        src: getLangSource(appVersion, availableLangs, additionalLangs, code),
        ver: appVersion
      };
    });

    return { langs: langs, haveChanged: !arrEqual(prevLangs, newLangs) };
  }

  function arrEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every(function (elem, i) {
      return elem === arr2[i];
    });
  }

  function getMatchingLangpack(appVersion, langpacks) {
    for (var i = 0, langpack = undefined; langpack = langpacks[i]; i++) {
      if (langpack.target === appVersion) {
        return langpack;
      }
    }
    return null;
  }

  function getLangSource(appVersion, availableLangs, additionalLangs, code) {
    if (additionalLangs && additionalLangs[code]) {
      var lp = getMatchingLangpack(appVersion, additionalLangs[code]);
      if (lp && (!(code in availableLangs) || parseInt(lp.revision) > availableLangs[code])) {
        return 'extra';
      }
    }

    if (code in pseudo && !(code in availableLangs)) {
      return 'pseudo';
    }

    return 'app';
  }

  var Remote = (function () {
    function Remote(fetchResource, broadcast) {
      _classCallCheck(this, Remote);

      this.broadcast = broadcast;
      this.env = new Env(fetchResource);
      this.ctxs = new Map();
    }

    Remote.prototype.registerView = function registerView(view, resources, meta, additionalLangs, requestedLangs) {
      var _negotiateLanguages = negotiateLanguages(meta, additionalLangs, [], requestedLangs);

      var langs = _negotiateLanguages.langs;

      this.ctxs.set(view, this.env.createContext(langs, resources));
      return langs;
    };

    Remote.prototype.unregisterView = function unregisterView(view) {
      this.ctxs.delete(view);
      return true;
    };

    Remote.prototype.formatEntities = function formatEntities(view, keys) {
      var _ctxs$get;

      return (_ctxs$get = this.ctxs.get(view)).formatEntities.apply(_ctxs$get, keys);
    };

    Remote.prototype.formatValues = function formatValues(view, keys) {
      var _ctxs$get2;

      return (_ctxs$get2 = this.ctxs.get(view)).formatValues.apply(_ctxs$get2, keys);
    };

    Remote.prototype.changeLanguages = function changeLanguages(view, meta, additionalLangs, requestedLangs) {
      var oldCtx = this.ctxs.get(view);
      var prevLangs = oldCtx.langs;
      var newLangs = negotiateLanguages(meta, additionalLangs, prevLangs, requestedLangs);
      this.ctxs.set(view, this.env.createContext(newLangs.langs, oldCtx.resIds));
      return newLangs;
    };

    Remote.prototype.requestLanguages = function requestLanguages(requestedLangs) {
      this.broadcast('languageschangerequest', requestedLangs);
    };

    Remote.prototype.getName = function getName(code) {
      return pseudo[code].name;
    };

    Remote.prototype.processString = function processString(code, str) {
      return pseudo[code].process(str);
    };

    return Remote;
  })();

  var observerConfig = {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true,
    attributeFilter: ['data-l10n-id', 'data-l10n-args']
  };

  var observers = new WeakMap();

  function initMutationObserver(view) {
    observers.set(view, {
      roots: new Set(),
      observer: new MutationObserver(function (mutations) {
        return translateMutations(view, mutations);
      })
    });
  }

  function translateRoots(view) {
    var roots = Array.from(observers.get(view).roots);
    return Promise.all(roots.map(function (root) {
      return _translateFragment(view, root);
    }));
  }

  function observe(view, root) {
    var obs = observers.get(view);
    if (obs) {
      obs.roots.add(root);
      obs.observer.observe(root, observerConfig);
    }
  }

  function disconnect(view, root, allRoots) {
    var obs = observers.get(view);
    if (obs) {
      obs.observer.disconnect();
      if (allRoots) {
        return;
      }
      obs.roots.delete(root);
      obs.roots.forEach(function (other) {
        return obs.observer.observe(other, observerConfig);
      });
    }
  }

  function reconnect(view) {
    var obs = observers.get(view);
    if (obs) {
      obs.roots.forEach(function (root) {
        return obs.observer.observe(root, observerConfig);
      });
    }
  }

  var reOverlay = /<|&#?\w+;/;

  var allowed = {
    elements: ['a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr'],
    attributes: {
      global: ['title', 'aria-label', 'aria-valuetext', 'aria-moz-hint'],
      a: ['download'],
      area: ['download', 'alt'],

      input: ['alt', 'placeholder'],
      menuitem: ['label'],
      menu: ['label'],
      optgroup: ['label'],
      option: ['label'],
      track: ['label'],
      img: ['alt'],
      textarea: ['placeholder'],
      th: ['abbr']
    }
  };

  function overlayElement(element, translation) {
    var value = translation.value;

    if (typeof value === 'string') {
      if (!reOverlay.test(value)) {
        element.textContent = value;
      } else {
        var tmpl = element.ownerDocument.createElement('template');
        tmpl.innerHTML = value;

        overlay(element, tmpl.content);
      }
    }

    for (var key in translation.attrs) {
      var attrName = camelCaseToDashed(key);
      if (isAttrAllowed({ name: attrName }, element)) {
        element.setAttribute(attrName, translation.attrs[key]);
      }
    }
  }

  function overlay(sourceElement, translationElement) {
    var result = translationElement.ownerDocument.createDocumentFragment();
    var k = undefined,
        attr = undefined;

    var childElement = undefined;
    while (childElement = translationElement.childNodes[0]) {
      translationElement.removeChild(childElement);

      if (childElement.nodeType === childElement.TEXT_NODE) {
        result.appendChild(childElement);
        continue;
      }

      var index = getIndexOfType(childElement);
      var sourceChild = getNthElementOfType(sourceElement, childElement, index);
      if (sourceChild) {
        overlay(sourceChild, childElement);
        result.appendChild(sourceChild);
        continue;
      }

      if (isElementAllowed(childElement)) {
        var sanitizedChild = childElement.ownerDocument.createElement(childElement.nodeName);
        overlay(sanitizedChild, childElement);
        result.appendChild(sanitizedChild);
        continue;
      }

      result.appendChild(translationElement.ownerDocument.createTextNode(childElement.textContent));
    }

    sourceElement.textContent = '';
    sourceElement.appendChild(result);

    if (translationElement.attributes) {
      for (k = 0, attr; attr = translationElement.attributes[k]; k++) {
        if (isAttrAllowed(attr, sourceElement)) {
          sourceElement.setAttribute(attr.name, attr.value);
        }
      }
    }
  }

  function isElementAllowed(element) {
    return allowed.elements.indexOf(element.tagName.toLowerCase()) !== -1;
  }

  function isAttrAllowed(attr, element) {
    var attrName = attr.name.toLowerCase();
    var tagName = element.tagName.toLowerCase();

    if (allowed.attributes.global.indexOf(attrName) !== -1) {
      return true;
    }

    if (!allowed.attributes[tagName]) {
      return false;
    }

    if (allowed.attributes[tagName].indexOf(attrName) !== -1) {
      return true;
    }

    if (tagName === 'input' && attrName === 'value') {
      var type = element.type.toLowerCase();
      if (type === 'submit' || type === 'button' || type === 'reset') {
        return true;
      }
    }
    return false;
  }

  function getNthElementOfType(context, element, index) {
    var nthOfType = 0;
    for (var i = 0, child = undefined; child = context.children[i]; i++) {
      if (child.nodeType === child.ELEMENT_NODE && child.tagName === element.tagName) {
        if (nthOfType === index) {
          return child;
        }
        nthOfType++;
      }
    }
    return null;
  }

  function getIndexOfType(element) {
    var index = 0;
    var child = undefined;
    while (child = element.previousElementSibling) {
      if (child.tagName === element.tagName) {
        index++;
      }
    }
    return index;
  }

  function camelCaseToDashed(string) {
    if (string === 'ariaValueText') {
      return 'aria-valuetext';
    }

    return string.replace(/[A-Z]/g, function (match) {
      return '-' + match.toLowerCase();
    }).replace(/^-/, '');
  }

  var reHtml = /[&<>]/g;
  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  function setAttributes(element, id, args) {
    element.setAttribute('data-l10n-id', id);
    if (args) {
      element.setAttribute('data-l10n-args', JSON.stringify(args));
    }
  }

  function getAttributes(element) {
    return {
      id: element.getAttribute('data-l10n-id'),
      args: JSON.parse(element.getAttribute('data-l10n-args'))
    };
  }

  function getTranslatables(element) {
    var nodes = Array.from(element.querySelectorAll('[data-l10n-id]'));

    if (typeof element.hasAttribute === 'function' && element.hasAttribute('data-l10n-id')) {
      nodes.push(element);
    }

    return nodes;
  }

  function translateMutations(view, mutations) {
    var targets = new Set();

    for (var _iterator = mutations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var mutation = _ref;

      switch (mutation.type) {
        case 'attributes':
          targets.add(mutation.target);
          break;
        case 'childList':
          for (var _iterator2 = mutation.addedNodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var addedNode = _ref2;

            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                getTranslatables(addedNode).forEach(targets.add.bind(targets));
              } else {
                if (addedNode.hasAttribute('data-l10n-id')) {
                  targets.add(addedNode);
                }
              }
            }
          }
          break;
      }
    }

    if (targets.size === 0) {
      return;
    }

    translateElements(view, Array.from(targets));
  }

  function _translateFragment(view, frag) {
    return translateElements(view, getTranslatables(frag));
  }

  function getElementsTranslation(view, elems) {
    var keys = elems.map(function (elem) {
      var id = elem.getAttribute('data-l10n-id');
      var args = elem.getAttribute('data-l10n-args');
      return args ? [id, JSON.parse(args.replace(reHtml, function (match) {
        return htmlEntities[match];
      }))] : id;
    });

    return view.formatEntities.apply(view, keys);
  }

  function translateElements(view, elements) {
    return getElementsTranslation(view, elements).then(function (translations) {
      return applyTranslations(view, elements, translations);
    });
  }

  function applyTranslations(view, elems, translations) {
    disconnect(view, null, true);
    for (var i = 0; i < elems.length; i++) {
      overlayElement(elems[i], translations[i]);
    }
    reconnect(view);
  }

  if (typeof NodeList === 'function' && !NodeList.prototype[Symbol.iterator]) {
    NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

  function documentReady() {
    if (document.readyState !== 'loading') {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      document.addEventListener('readystatechange', function onrsc() {
        document.removeEventListener('readystatechange', onrsc);
        resolve();
      });
    });
  }

  function getDirection(code) {
    var tag = code.split('-')[0];
    return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(tag) >= 0 ? 'rtl' : 'ltr';
  }

  if (navigator.languages === undefined) {
    navigator.languages = [navigator.language];
  }

  function getResourceLinks(head) {
    return Array.prototype.map.call(head.querySelectorAll('link[rel="localization"]'), function (el) {
      return el.getAttribute('href');
    });
  }

  function getMeta(head) {
    var availableLangs = Object.create(null);
    var defaultLang = null;
    var appVersion = null;

    var metas = Array.from(head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]'));
    for (var _iterator3 = metas, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var meta = _ref3;

      var _name = meta.getAttribute('name');
      var content = meta.getAttribute('content').trim();
      switch (_name) {
        case 'availableLanguages':
          availableLangs = getLangRevisionMap(availableLangs, content);
          break;
        case 'defaultLanguage':
          var _getLangRevisionTuple = getLangRevisionTuple(content),
              lang = _getLangRevisionTuple[0],
              rev = _getLangRevisionTuple[1];

          defaultLang = lang;
          if (!(lang in availableLangs)) {
            availableLangs[lang] = rev;
          }
          break;
        case 'appVersion':
          appVersion = content;
      }
    }

    return {
      defaultLang: defaultLang,
      availableLangs: availableLangs,
      appVersion: appVersion
    };
  }

  function getLangRevisionMap(seq, str) {
    return str.split(',').reduce(function (prevSeq, cur) {
      var _getLangRevisionTuple2 = getLangRevisionTuple(cur);

      var lang = _getLangRevisionTuple2[0];
      var rev = _getLangRevisionTuple2[1];

      prevSeq[lang] = rev;
      return prevSeq;
    }, seq);
  }

  function getLangRevisionTuple(str) {
    var _str$trim$split = str.trim().split(':');

    var lang = _str$trim$split[0];
    var rev = _str$trim$split[1];

    return [lang, parseInt(rev)];
  }

  var viewProps = new WeakMap();

  var View = (function () {
    function View(client, doc) {
      var _this12 = this;

      _classCallCheck(this, View);

      this.pseudo = {
        'fr-x-psaccent': createPseudo(this, 'fr-x-psaccent'),
        'ar-x-psbidi': createPseudo(this, 'ar-x-psbidi')
      };

      var initialized = documentReady().then(function () {
        return init(_this12, client);
      });
      this._interactive = initialized.then(function () {
        return client;
      });
      this.ready = initialized.then(function (langs) {
        return translateView(_this12, langs);
      });
      initMutationObserver(this);

      viewProps.set(this, {
        doc: doc,
        ready: false
      });

      client.on('languageschangerequest', function (requestedLangs) {
        return _this12.requestLanguages(requestedLangs);
      });
    }

    View.prototype.requestLanguages = function requestLanguages(requestedLangs, isGlobal) {
      var _this13 = this;

      var method = isGlobal ? function (client) {
        return client.method('requestLanguages', requestedLangs);
      } : function (client) {
        return changeLanguages(_this13, client, requestedLangs);
      };
      return this._interactive.then(method);
    };

    View.prototype.handleEvent = function handleEvent() {
      return this.requestLanguages(navigator.languages);
    };

    View.prototype.formatEntities = function formatEntities() {
      for (var _len7 = arguments.length, keys = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        keys[_key7] = arguments[_key7];
      }

      return this._interactive.then(function (client) {
        return client.method('formatEntities', client.id, keys);
      });
    };

    View.prototype.formatValue = function formatValue(id, args) {
      return this._interactive.then(function (client) {
        return client.method('formatValues', client.id, [[id, args]]);
      }).then(function (values) {
        return values[0];
      });
    };

    View.prototype.formatValues = function formatValues() {
      for (var _len8 = arguments.length, keys = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        keys[_key8] = arguments[_key8];
      }

      return this._interactive.then(function (client) {
        return client.method('formatValues', client.id, keys);
      });
    };

    View.prototype.translateFragment = function translateFragment(frag) {
      return _translateFragment(this, frag);
    };

    View.prototype.observeRoot = function observeRoot(root) {
      observe(this, root);
    };

    View.prototype.disconnectRoot = function disconnectRoot(root) {
      disconnect(this, root);
    };

    return View;
  })();

  View.prototype.setAttributes = setAttributes;
  View.prototype.getAttributes = getAttributes;

  function createPseudo(view, code) {
    return {
      getName: function () {
        return view._interactive.then(function (client) {
          return client.method('getName', code);
        });
      },
      processString: function (str) {
        return view._interactive.then(function (client) {
          return client.method('processString', code, str);
        });
      }
    };
  }

  function init(view, client) {
    var doc = viewProps.get(view).doc;
    var resources = getResourceLinks(doc.head);
    var meta = getMeta(doc.head);
    view.observeRoot(doc.documentElement);
    return getAdditionalLanguages().then(function (additionalLangs) {
      return client.method('registerView', client.id, resources, meta, additionalLangs, navigator.languages);
    });
  }

  function changeLanguages(view, client, requestedLangs) {
    var doc = viewProps.get(view).doc;
    var meta = getMeta(doc.head);
    return getAdditionalLanguages().then(function (additionalLangs) {
      return client.method('changeLanguages', client.id, meta, additionalLangs, requestedLangs);
    }).then(function (_ref8) {
      var langs = _ref8.langs;
      var haveChanged = _ref8.haveChanged;
      return haveChanged ? translateView(view, langs) : undefined;
    });
  }

  function getAdditionalLanguages() {
    if (navigator.mozApps && navigator.mozApps.getAdditionalLanguages) {
      return navigator.mozApps.getAdditionalLanguages().catch(function () {
        return Object.create(null);
      });
    }

    return Promise.resolve(Object.create(null));
  }

  function translateView(view, langs) {
    var props = viewProps.get(view);
    var html = props.doc.documentElement;

    if (props.ready) {
      return translateRoots(view).then(function () {
        return setAllAndEmit(html, langs);
      });
    }

    var translated = langs[0].code === html.getAttribute('lang') ? Promise.resolve() : translateRoots(view).then(function () {
      return setLangDir(html, langs);
    });

    return translated.then(function () {
      setLangs(html, langs);
      props.ready = true;
    });
  }

  function setLangs(html, langs) {
    var codes = langs.map(function (lang) {
      return lang.code;
    });
    html.setAttribute('langs', codes.join(' '));
  }

  function setLangDir(html, langs) {
    var code = langs[0].code;
    html.setAttribute('lang', code);
    html.setAttribute('dir', getDirection(code));
  }

  function setAllAndEmit(html, langs) {
    setLangDir(html, langs);
    setLangs(html, langs);
    html.parentNode.dispatchEvent(new CustomEvent('DOMRetranslated', {
      bubbles: false,
      cancelable: false
    }));
  }

  var remote = new Remote(fetchResource, broadcast);
  var client = new Client(remote);
  document.l10n = new View(client, document);

  window.addEventListener('languagechange', document.l10n);
  document.addEventListener('additionallanguageschange', document.l10n);
})();