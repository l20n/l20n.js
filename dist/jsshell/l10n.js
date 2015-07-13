(function(window, undefined) {
  'use strict';

  /* jshint validthis:true */
  function L10nError(message, id, loc) {
    this.name = 'L10nError';
    this.message = message;
    this.id = id;
    this.loc = loc;
  }
  L10nError.prototype = Object.create(Error.prototype);
  L10nError.prototype.constructor = L10nError;


  function EventEmitter() {}

  EventEmitter.prototype.emit = function ee_emit() {
    if (!this._listeners) {
      return;
    }

    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    if (!this._listeners[type]) {
      return;
    }

    var typeListeners = this._listeners[type].slice();
    for (var i = 0; i < typeListeners.length; i++) {
      typeListeners[i].apply(this, args);
    }
  };

  EventEmitter.prototype.addEventListener = function ee_add(type, listener) {
    if (!this._listeners) {
      this._listeners = {};
    }
    if (!(type in this._listeners)) {
      this._listeners[type] = [];
    }
    this._listeners[type].push(listener);
  };

  EventEmitter.prototype.removeEventListener = function ee_rm(type, listener) {
    if (!this._listeners) {
      return;
    }

    var typeListeners = this._listeners[type];
    var pos = typeListeners.indexOf(listener);
    if (pos === -1) {
      return;
    }

    typeListeners.splice(pos, 1);
  };


  function getPluralRule(lang) {
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

    // utility functions for plural rules methods
    function isIn(n, list) {
      return list.indexOf(n) !== -1;
    }
    function isBetween(n, start, end) {
      return typeof n === typeof start && start <= n && n <= end;
    }

    // list of all plural rules methods:
    // map an integer to the plural form name to use
    var pluralRules = {
      '0': function() {
        return 'other';
      },
      '1': function(n) {
        if ((isBetween((n % 100), 3, 10))) {
          return 'few';
        }
        if (n === 0) {
          return 'zero';
        }
        if ((isBetween((n % 100), 11, 99))) {
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
      '2': function(n) {
        if (n !== 0 && (n % 10) === 0) {
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
      '3': function(n) {
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '4': function(n) {
        if ((isBetween(n, 0, 1))) {
          return 'one';
        }
        return 'other';
      },
      '5': function(n) {
        if ((isBetween(n, 0, 2)) && n !== 2) {
          return 'one';
        }
        return 'other';
      },
      '6': function(n) {
        if (n === 0) {
          return 'zero';
        }
        if ((n % 10) === 1 && (n % 100) !== 11) {
          return 'one';
        }
        return 'other';
      },
      '7': function(n) {
        if (n === 2) {
          return 'two';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '8': function(n) {
        if ((isBetween(n, 3, 6))) {
          return 'few';
        }
        if ((isBetween(n, 7, 10))) {
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
      '9': function(n) {
        if (n === 0 || n !== 1 && (isBetween((n % 100), 1, 19))) {
          return 'few';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '10': function(n) {
        if ((isBetween((n % 10), 2, 9)) && !(isBetween((n % 100), 11, 19))) {
          return 'few';
        }
        if ((n % 10) === 1 && !(isBetween((n % 100), 11, 19))) {
          return 'one';
        }
        return 'other';
      },
      '11': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14))) {
          return 'few';
        }
        if ((n % 10) === 0 ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 11, 14))) {
          return 'many';
        }
        if ((n % 10) === 1 && (n % 100) !== 11) {
          return 'one';
        }
        return 'other';
      },
      '12': function(n) {
        if ((isBetween(n, 2, 4))) {
          return 'few';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '13': function(n) {
        if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14))) {
          return 'few';
        }
        if (n !== 1 && (isBetween((n % 10), 0, 1)) ||
            (isBetween((n % 10), 5, 9)) ||
            (isBetween((n % 100), 12, 14))) {
          return 'many';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '14': function(n) {
        if ((isBetween((n % 100), 3, 4))) {
          return 'few';
        }
        if ((n % 100) === 2) {
          return 'two';
        }
        if ((n % 100) === 1) {
          return 'one';
        }
        return 'other';
      },
      '15': function(n) {
        if (n === 0 || (isBetween((n % 100), 2, 10))) {
          return 'few';
        }
        if ((isBetween((n % 100), 11, 19))) {
          return 'many';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '16': function(n) {
        if ((n % 10) === 1 && n !== 11) {
          return 'one';
        }
        return 'other';
      },
      '17': function(n) {
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
      '18': function(n) {
        if (n === 0) {
          return 'zero';
        }
        if ((isBetween(n, 0, 2)) && n !== 0 && n !== 2) {
          return 'one';
        }
        return 'other';
      },
      '19': function(n) {
        if ((isBetween(n, 2, 10))) {
          return 'few';
        }
        if ((isBetween(n, 0, 1))) {
          return 'one';
        }
        return 'other';
      },
      '20': function(n) {
        if ((isBetween((n % 10), 3, 4) || ((n % 10) === 9)) && !(
            isBetween((n % 100), 10, 19) ||
            isBetween((n % 100), 70, 79) ||
            isBetween((n % 100), 90, 99)
            )) {
          return 'few';
        }
        if ((n % 1000000) === 0 && n !== 0) {
          return 'many';
        }
        if ((n % 10) === 2 && !isIn((n % 100), [12, 72, 92])) {
          return 'two';
        }
        if ((n % 10) === 1 && !isIn((n % 100), [11, 71, 91])) {
          return 'one';
        }
        return 'other';
      },
      '21': function(n) {
        if (n === 0) {
          return 'zero';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '22': function(n) {
        if ((isBetween(n, 0, 1)) || (isBetween(n, 11, 99))) {
          return 'one';
        }
        return 'other';
      },
      '23': function(n) {
        if ((isBetween((n % 10), 1, 2)) || (n % 20) === 0) {
          return 'one';
        }
        return 'other';
      },
      '24': function(n) {
        if ((isBetween(n, 3, 10) || isBetween(n, 13, 19))) {
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

    // return a function that gives the plural form name for a given integer
    var index = locales2rules[lang.replace(/-.*$/, '')];
    if (!(index in pluralRules)) {
      return function() { return 'other'; };
    }
    return pluralRules[index];
  }




  var MAX_PLACEABLES = 100;

  var PropertiesParser = {
    patterns: null,
    entryIds: null,

    init: function() {
      this.patterns = {
        comment: /^\s*#|^\s*$/,
        entity: /^([^=\s]+)\s*=\s*(.*)$/,
        multiline: /[^\\]\\$/,
        index: /\{\[\s*(\w+)(?:\(([^\)]*)\))?\s*\]\}/i,
        unicode: /\\u([0-9a-fA-F]{1,4})/g,
        entries: /[^\r\n]+/g,
        controlChars: /\\([\\\n\r\t\b\f\{\}\"\'])/g,
        placeables: /\{\{\s*([^\s]*?)\s*\}\}/,
      };
    },

    parse: function(ctx, source) {
      if (!this.patterns) {
        this.init();
      }

      var ast = [];
      this.entryIds = Object.create(null);

      var entries = source.match(this.patterns.entries);
      if (!entries) {
        return ast;
      }
      for (var i = 0; i < entries.length; i++) {
        var line = entries[i];

        if (this.patterns.comment.test(line)) {
          continue;
        }

        while (this.patterns.multiline.test(line) && i < entries.length) {
          line = line.slice(0, -1) + entries[++i].trim();
        }

        var entityMatch = line.match(this.patterns.entity);
        if (entityMatch) {
          try {
            this.parseEntity(entityMatch[1], entityMatch[2], ast);
          } catch (e) {
            if (ctx) {
              ctx._emitter.emit('parseerror', e);
            } else {
              throw e;
            }
          }
        }
      }
      return ast;
    },

    parseEntity: function(id, value, ast) {
      var name, key;

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
        throw new L10nError('Error in ID: "' + name + '".' +
            ' Nested attributes are not supported.');
      }

      var attr;
      if (nameElements.length > 1) {
        name = nameElements[0];
        attr = nameElements[1];

        if (attr[0] === '$') {
          throw new L10nError('Attribute can\'t start with "$"', id);
        }
      } else {
        attr = null;
      }

      this.setEntityValue(name, attr, key, this.unescapeString(value), ast);
    },

    setEntityValue: function(id, attr, key, rawValue, ast) {
      var pos, v;

      var value = rawValue.indexOf('{{') > -1 ?
        this.parseString(rawValue) : rawValue;

      if (attr) {
        pos = this.entryIds[id];
        if (pos === undefined) {
          v = {$i: id};
          if (key) {
            v[attr] = {};
            v[attr][key] = value;
          } else {
            v[attr] = value;
          }
          ast.push(v);
          this.entryIds[id] = ast.length - 1;
          return;
        }
        if (key) {
          if (typeof(ast[pos][attr]) === 'string') {
            ast[pos][attr] = {
              $x: this.parseIndex(ast[pos][attr]),
              $v: {}
            };
          }
          ast[pos][attr].$v[key] = value;
          return;
        }
        ast[pos][attr] = value;
        return;
      }

      // Hash value
      if (key) {
        pos = this.entryIds[id];
        if (pos === undefined) {
          v = {};
          v[key] = value;
          ast.push({$i: id, $v: v});
          this.entryIds[id] = ast.length - 1;
          return;
        }
        if (typeof(ast[pos].$v) === 'string') {
          ast[pos].$x = this.parseIndex(ast[pos].$v);
          ast[pos].$v = {};
        }
        ast[pos].$v[key] = value;
        return;
      }

      // simple value
      ast.push({$i: id, $v: value});
      this.entryIds[id] = ast.length - 1;
    },

    parseString: function(str) {
      var chunks = str.split(this.patterns.placeables);
      var complexStr = [];

      var len = chunks.length;
      var placeablesCount = (len - 1) / 2;

      if (placeablesCount >= MAX_PLACEABLES) {
        throw new L10nError('Too many placeables (' + placeablesCount +
                            ', max allowed is ' + MAX_PLACEABLES + ')');
      }

      for (var i = 0; i < chunks.length; i++) {
        if (chunks[i].length === 0) {
          continue;
        }
        if (i % 2 === 1) {
          complexStr.push({t: 'idOrVar', v: chunks[i]});
        } else {
          complexStr.push(chunks[i]);
        }
      }
      return complexStr;
    },

    unescapeString: function(str) {
      if (str.lastIndexOf('\\') !== -1) {
        str = str.replace(this.patterns.controlChars, '$1');
      }
      return str.replace(this.patterns.unicode, function(match, token) {
        return unescape('%u' + '0000'.slice(token.length) + token);
      });
    },

    parseIndex: function(str) {
      var match = str.match(this.patterns.index);
      if (!match) {
        throw new L10nError('Malformed index');
      }
      if (match[2]) {
        return [{t: 'idOrVar', v: match[1]}, match[2]];
      } else {
        return [{t: 'idOrVar', v: match[1]}];
      }
    }
  };



  var MAX_PLACEABLES_L20N = 100;

  var L20nParser = {
    _patterns: {
      identifier: /[A-Za-z_]\w*/g,
      unicode: /\\u([0-9a-fA-F]{1,4})/g,
      index: /@cldr\.plural\(\$?(\w+)\)/g,
      placeables: /\{\{\s*\$?([^\s]*?)\s*\}\}/,
      unesc: /\\({{|u[0-9a-fA-F]{4}|.)/g,
    },

    parse: function (ctx, string, simple) {
      this._source = string;
      this._index = 0;
      this._length = this._source.length;
      this.simpleMode = simple;
      this.ctx = ctx;

      return this.getL20n();
    },

    getAttributes: function() {
      var attrs = Object.create(null);
      var attr, ws1, ch;

      while (true) {
        attr = this.getKVPWithIndex();
        attrs[attr[0]] = attr[1];
        ws1 = this.getRequiredWS();
        ch = this._source.charAt(this._index);
        if (ch === '>') {
          break;
        } else if (!ws1) {
          throw this.error('Expected ">"');
        }
      }
      return attrs;
    },

    getKVP: function() {
      var key = this.getIdentifier();
      this.getWS();
      if (this._source.charAt(this._index) !== ':') {
        throw this.error('Expected ":"');
      }
      ++this._index;
      this.getWS();
      return [key, this.getValue()];
    },

    getKVPWithIndex: function() {
      var key = this.getIdentifier();
      var index = null;

      if (this._source.charAt(this._index) === '[') {
        ++this._index;
        this.getWS();
        index = this.getIndex();
      }
      this.getWS();
      if (this._source.charAt(this._index) !== ':') {
        throw this.error('Expected ":"');
      }
      ++this._index;
      this.getWS();
      return [
        key,
        this.getValue(false, undefined, index)
      ];
    },

    getHash: function() {
      ++this._index;
      this.getWS();
      var hi, comma, hash = {};
      while (true) {
        hi = this.getKVP();
        hash[hi[0]] = hi[1];
        this.getWS();

        comma = this._source.charAt(this._index) === ',';
        if (comma) {
          ++this._index;
          this.getWS();
        }
        if (this._source.charAt(this._index) === '}') {
          ++this._index;
          break;
        }
        if (!comma) {
          throw this.error('Expected "}"');
        }
      }
      return hash;
    },

    unescapeString: function(str, opchar) {
      function replace(match, p1) {
        switch (p1) {
          case '\\':
            return '\\';
          case '{{':
            return '{{';
          case opchar:
            return opchar;
          default:
            if (p1.length === 5 && p1.charAt(0) === 'u') {
              return String.fromCharCode(parseInt(p1.substr(1), 16));
            }
            throw this.error('Illegal unescape sequence');
        }
      }
      return str.replace(this._patterns.unesc, replace.bind(this));
    },

    getString: function(opchar) {
      var opcharPos = this._source.indexOf(opchar, this._index + 1);

      outer:
      while (opcharPos !== -1) {
        var backtrack = opcharPos - 1;
        // 92 === '\'
        while (this._source.charCodeAt(backtrack) === 92) {
          if (this._source.charCodeAt(backtrack - 1) === 92) {
            backtrack -= 2;
          } else {
            opcharPos = this._source.indexOf(opchar, opcharPos + 1);
            continue outer;
          }
        }
        break;
      }

      if (opcharPos === -1) {
        throw this.error('Unclosed string literal');
      }

      var buf = this._source.slice(this._index + 1, opcharPos);

      this._index = opcharPos + 1;

      if (!this.simpleMode && buf.indexOf('\\') !== -1) {
        buf = this.unescapeString(buf, opchar);
      }

      if (!this.simpleMode && buf.indexOf('{{') !== -1) {
        return this.parseString(buf);
      }

      return buf;
    },

    getValue: function(optional, ch, index) {
      var val;

      if (ch === undefined) {
        ch = this._source.charAt(this._index);
      }
      if (ch === '\'' || ch === '"') {
        val = this.getString(ch);
      } else if (ch === '{') {
        val = this.getHash();
      }

      if (val === undefined) {
        if (!optional) {
          throw this.error('Unknown value type');
        }
        return null;
      }

      if (index) {
        return {'$v': val, '$x': index};
      }

      return val;
    },

    getRequiredWS: function() {
      var pos = this._index;
      var cc = this._source.charCodeAt(pos);
      // space, \n, \t, \r
      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
      return this._index !== pos;
    },

    getWS: function() {
      var cc = this._source.charCodeAt(this._index);
      // space, \n, \t, \r
      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
    },


    getIdentifier: function() {
      var reId = this._patterns.identifier;
      reId.lastIndex = this._index;
      var match = reId.exec(this._source);
      if (reId.lastIndex !== this._index + match[0].length) {
        throw this.error('Identifier has to start with [a-zA-Z_]');
      }
      this._index = reId.lastIndex;

      return match[0];
    },

    getComment: function() {
      this._index += 2;
      var start = this._index;
      var end = this._source.indexOf('*/', start);

      if (end === -1) {
        throw this.error('Comment without closing tag');
      }
      this._index = end + 2;
      return;
    },

    getEntity: function(id, index) {
      var entity = {'$i': id};

      if (index) {
        entity.$x = index;
      }

      if (!this.getRequiredWS()) {
        throw this.error('Expected white space');
      }

      var ch = this._source.charAt(this._index);
      var value = this.getValue(index === null, ch);
      var attrs = null;
      if (value === null) {
        if (ch === '>') {
          throw this.error('Expected ">"');
        }
        attrs = this.getAttributes();
      } else {
        entity.$v = value;
        var ws1 = this.getRequiredWS();
        if (this._source.charAt(this._index) !== '>') {
          if (!ws1) {
            throw this.error('Expected ">"');
          }
          attrs = this.getAttributes();
        }
      }

      // skip '>'
      ++this._index;

      if (attrs) {
        /* jshint -W089 */
        for (var key in attrs) {
          entity[key] = attrs[key];
        }
      }

      return entity;
    },

    getEntry: function() {
      // 60 === '<'
      if (this._source.charCodeAt(this._index) === 60) {
        ++this._index;
        var id = this.getIdentifier();
        // 91 == '['
        if (this._source.charCodeAt(this._index) === 91) {
          ++this._index;
          return this.getEntity(id,
                           this.getIndex());
        }
        return this.getEntity(id, null);
      }
      if (this._source.charCodeAt(this._index) === 47 &&
          this._source.charCodeAt(this._index + 1) === 42) {
        return this.getComment();
      }
      throw this.error('Invalid entry');
    },

    getL20n: function() {
      var ast = [];

      this.getWS();
      while (this._index < this._length) {
        try {
          var entry = this.getEntry();
          if (entry) {
            ast.push(entry);
          }
        } catch (e) {
          if (this.ctx) {
            this.ctx._emitter.emit('parsererror', e);
          } else {
            throw e;
          }
        }

        if (this._index < this._length) {
          this.getWS();
        }
      }

      return ast;
    },

    getIndex: function() {
      this.getWS();
      this._patterns.index.lastIndex = this._index;
      var match = this._patterns.index.exec(this._source);
      this._index = this._patterns.index.lastIndex;
      this.getWS();
      this._index++;

      return [{t: 'idOrVar', v: 'plural'}, match[1]];
    },

    parseString: function(str) {
      var chunks = str.split(this._patterns.placeables);
      var complexStr = [];

      var len = chunks.length;
      var placeablesCount = (len - 1) / 2;

      if (placeablesCount >= MAX_PLACEABLES_L20N) {
        throw new L10nError('Too many placeables (' + placeablesCount +
                            ', max allowed is ' + MAX_PLACEABLES_L20N + ')');
      }

      for (var i = 0; i < chunks.length; i++) {
        if (chunks[i].length === 0) {
          continue;
        }
        if (i % 2 === 1) {
          complexStr.push({t: 'idOrVar', v: chunks[i]});
        } else {
          complexStr.push(chunks[i]);
        }
      }
      return complexStr;
    },

    error: function(message, pos) {
      if (pos === undefined) {
        pos = this._index;
      }
      var start = this._source.lastIndexOf('<', pos - 1);
      var lastClose = this._source.lastIndexOf('>', pos - 1);
      start = lastClose > start ? lastClose + 1 : start;
      var context = this._source.slice(start, pos + 10);

      var msg = message + ' at pos ' + pos + ': "' + context + '"';
      return new L10nError(msg, pos, context);
    }
  };



  var KNOWN_MACROS = ['plural'];

  var MAX_PLACEABLE_LENGTH = 2500;
  var rePlaceables = /\{\{\s*(.+?)\s*\}\}/g;

  // Matches characters outside of the Latin-1 character set
  var nonLatin1 = /[^\x01-\xFF]/;

  // Unicode bidi isolation characters
  var FSI = '\u2068';
  var PDI = '\u2069';

  function createEntry(node, env) {
    var keys = Object.keys(node);

    // the most common scenario: a simple string with no arguments
    if (typeof node.$v === 'string' && keys.length === 2) {
      return node.$v;
    }

    var attrs;

    /* jshint -W084 */
    for (var i = 0, key; key = keys[i]; i++) {
      // skip $i (id), $v (value), $x (index)
      if (key[0] === '$') {
        continue;
      }

      if (!attrs) {
        attrs = Object.create(null);
      }
      attrs[key] = createAttribute(node[key], env, node.$i + '.' + key);
    }

    return {
      id: node.$i,
      value: node.$v !== undefined ? node.$v : null,
      index: node.$x || null,
      attrs: attrs || null,
      env: env,
      // the dirty guard prevents cyclic or recursive references
      dirty: false
    };
  }

  function createAttribute(node, env, id) {
    if (typeof node === 'string') {
      return node;
    }

    return {
      id: id,
      value: node.$v || (node !== undefined ? node : null),
      index: node.$x || null,
      env: env,
      dirty: false
    };
  }


  function format(args, entity) {
    if (typeof entity === 'string') {
      return [{}, entity];
    }

    if (entity.dirty) {
      throw new L10nError('Cyclic reference detected: ' + entity.id);
    }

    entity.dirty = true;

    var rv;

    // if format fails, we want the exception to bubble up and stop the whole
    // resolving process;  however, we still need to clean up the dirty flag
    try {
      rv = resolveValue({}, args, entity.env, entity.value, entity.index);
    } finally {
      entity.dirty = false;
    }
    return rv;
  }

  function resolveIdentifier(args, env, id) {
    if (KNOWN_MACROS.indexOf(id) > -1) {
      return [{}, env['__' + id]];
    }

    if (args && args.hasOwnProperty(id)) {
      if (typeof args[id] === 'string' || (typeof args[id] === 'number' &&
          !isNaN(args[id]))) {
        return [{}, args[id]];
      } else {
        throw new L10nError('Arg must be a string or a number: ' + id);
      }
    }

    // XXX: special case for Node.js where still:
    // '__proto__' in Object.create(null) => true
    if (id in env && id !== '__proto__') {
      return format(args, env[id]);
    }

    throw new L10nError('Unknown reference: ' + id);
  }

  function subPlaceable(locals, args, env, id) {
    var res;

    try {
      res = resolveIdentifier(args, env, id);
    } catch (err) {
      return [{ error: err }, '{{ ' + id + ' }}'];
    }

    var value = res[1];

    if (typeof value === 'number') {
      return res;
    }

    if (typeof value === 'string') {
      // prevent Billion Laughs attacks
      if (value.length >= MAX_PLACEABLE_LENGTH) {
        throw new L10nError('Too many characters in placeable (' +
                            value.length + ', max allowed is ' +
                            MAX_PLACEABLE_LENGTH + ')');
      }

      if (locals.contextIsNonLatin1 || value.match(nonLatin1)) {
        // When dealing with non-Latin-1 text
        // we wrap substitutions in bidi isolate characters
        // to avoid bidi issues.
        res[1] = FSI + value + PDI;
      }

      return res;
    }

    return [{}, '{{ ' + id + ' }}'];
  }

  function interpolate(locals, args, env, arr) {
    return arr.reduce(function(prev, cur) {
      if (typeof cur === 'string') {
        return [prev[0], prev[1] + cur];
      } else if (cur.t === 'idOrVar'){
        var placeable = subPlaceable(locals, args, env, cur.v);
        return [prev[0], prev[1] + placeable[1]];
      }
    }, [locals, '']);
  }

  function resolveSelector(args, env, expr, index) {
      var selectorName = index[0].v;
      var selector = resolveIdentifier(args, env, selectorName)[1];

      if (typeof selector !== 'function') {
        // selector is a simple reference to an entity or args
        return selector;
      }

      var argValue = index[1] ?
        resolveIdentifier(args, env, index[1])[1] : undefined;

      if (selector === env.__plural) {
        // special cases for zero, one, two if they are defined on the hash
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

  function resolveValue(locals, args, env, expr, index) {
    if (!expr) {
      return [locals, expr];
    }

    if (typeof expr === 'string' ||
        typeof expr === 'boolean' ||
        typeof expr === 'number') {
      return [locals, expr];
    }

    if (Array.isArray(expr)) {
      locals.contextIsNonLatin1 = expr.some(function($_) {
        return typeof($_) === 'string' && $_.match(nonLatin1);
      });
      return interpolate(locals, args, env, expr);
    }

    // otherwise, it's a dict
    if (index) {
      // try to use the index in order to select the right dict member
      var selector = resolveSelector(args, env, expr, index);
      if (expr.hasOwnProperty(selector)) {
        return resolveValue(locals, args, env, expr[selector]);
      }
    }

    // if there was no index or no selector was found, try 'other'
    if ('other' in expr) {
      return resolveValue(locals, args, env, expr.other);
    }

    // XXX Specify entity id
    throw new L10nError('Unresolvable value');
  }

  var Resolver = {
    createEntry: createEntry,
    format: format,
    rePlaceables: rePlaceables
  };



  /* Utility functions */

  // Recursively walk an AST node searching for content leaves
  function walkContent(node, fn) {
    if (typeof node === 'string') {
      return fn(node);
    }

    if (node.t === 'idOrVar') {
      return node;
    }

    var rv = Array.isArray(node) ? [] : {};
    var keys = Object.keys(node);

    for (var i = 0, key; (key = keys[i]); i++) {
      // don't change identifier ($i) nor indices ($x)
      if (key === '$i' || key === '$x') {
        rv[key] = node[key];
      } else {
        rv[key] = walkContent(node[key], fn);
      }
    }
    return rv;
  }


  /* Pseudolocalizations
   *
   * PSEUDO is a dict of strategies to be used to modify the English
   * context in order to create pseudolocalizations.  These can be used by
   * developers to test the localizability of their code without having to
   * actually speak a foreign language.
   *
   * Currently, the following pseudolocales are supported:
   *
   *   qps-ploc - Ȧȧƈƈḗḗƞŧḗḗḓ Ḗḗƞɠŀīīşħ
   *
   *     In Accented English all English letters are replaced by accented
   *     Unicode counterparts which don't impair the readability of the content.
   *     This allows developers to quickly test if any given string is being
   *     correctly displayed in its 'translated' form.  Additionally, simple
   *     heuristics are used to make certain words longer to better simulate the
   *     experience of international users.
   *
   *   qps-plocm - ɥsıʅƃuƎ pǝɹoɹɹıW
   *
   *     Mirrored English is a fake RTL locale.  All words are surrounded by
   *     Unicode formatting marks forcing the RTL directionality of characters.
   *     In addition, to make the reversed text easier to read, individual
   *     letters are flipped.
   *
   *     Note: The name above is hardcoded to be RTL in case code editors have
   *     trouble with the RLO and PDF Unicode marks.  In reality, it should be
   *     surrounded by those marks as well.
   *
   * See https://bugzil.la/900182 for more information.
   *
   */

  var reAlphas = /[a-zA-Z]/g;
  var reVowels = /[aeiouAEIOU]/g;

  // ȦƁƇḒḖƑƓĦĪĴĶĿḾȠǾƤɊŘŞŦŬṼẆẊẎẐ + [\\]^_` + ȧƀƈḓḗƒɠħīĵķŀḿƞǿƥɋřşŧŭṽẇẋẏẑ
  var ACCENTED_MAP = '\u0226\u0181\u0187\u1E12\u1E16\u0191\u0193\u0126\u012A' +
                     '\u0134\u0136\u013F\u1E3E\u0220\u01FE\u01A4\u024A\u0158' +
                     '\u015E\u0166\u016C\u1E7C\u1E86\u1E8A\u1E8E\u1E90' +
                     '[\\]^_`' +
                     '\u0227\u0180\u0188\u1E13\u1E17\u0192\u0260\u0127\u012B' +
                     '\u0135\u0137\u0140\u1E3F\u019E\u01FF\u01A5\u024B\u0159' +
                     '\u015F\u0167\u016D\u1E7D\u1E87\u1E8B\u1E8F\u1E91';

  // XXX Until https://bugzil.la/1007340 is fixed, ᗡℲ⅁⅂⅄ don't render correctly
  // on the devices.  For now, use the following replacements: pɟפ˥ʎ
  // ∀ԐↃpƎɟפHIſӼ˥WNOԀÒᴚS⊥∩ɅＭXʎZ + [\\]ᵥ_, + ɐqɔpǝɟƃɥıɾʞʅɯuodbɹsʇnʌʍxʎz
  var FLIPPED_MAP = '\u2200\u0510\u2183p\u018E\u025F\u05E4HI\u017F' +
                    '\u04FC\u02E5WNO\u0500\xD2\u1D1AS\u22A5\u2229\u0245' +
                    '\uFF2DX\u028EZ' +
                    '[\\]\u1D65_,' +
                    '\u0250q\u0254p\u01DD\u025F\u0183\u0265\u0131\u027E' +
                    '\u029E\u0285\u026Fuodb\u0279s\u0287n\u028C\u028Dx\u028Ez';

  function makeLonger(val) {
    return val.replace(reVowels, function(match) {
      return match + match.toLowerCase();
    });
  }

  function replaceChars(map, val) {
    // Replace each Latin letter with a Unicode character from map
    return val.replace(reAlphas, function(match) {
      return map.charAt(match.charCodeAt(0) - 65);
    });
  }

  var reWords = /[^\W0-9_]+/g;

  function makeRTL(val) {
    // Surround each word with Unicode formatting codes, RLO and PDF:
    //   U+202E:   RIGHT-TO-LEFT OVERRIDE (RLO)
    //   U+202C:   POP DIRECTIONAL FORMATTING (PDF)
    // See http://www.w3.org/International/questions/qa-bidi-controls
    return val.replace(reWords, function(match) {
      return '\u202e' + match + '\u202c';
    });
  }

  // strftime tokens (%a, %Eb), template {vars}, HTML entities (&#x202a;)
  // and HTML tags.
  var reExcluded = /(%[EO]?\w|\{\s*.+?\s*\}|&[#\w]+;|<\s*.+?\s*>)/;

  function mapContent(fn, val) {
    if (!val) {
      return val;
    }
    var parts = val.split(reExcluded);
    var modified = parts.map(function(part) {
      if (reExcluded.test(part)) {
        return part;
      }
      return fn(part);
    });
    return modified.join('');
  }

  function Pseudo(id, name, charMap, modFn) {
    this.id = id;
    this.translate = mapContent.bind(null, function(val) {
      return replaceChars(charMap, modFn(val));
    });
    this.name = this.translate(name);
  }

  var PSEUDO = {
    'qps-ploc': new Pseudo('qps-ploc', 'Runtime Accented',
                           ACCENTED_MAP, makeLonger),
    'qps-plocm': new Pseudo('qps-plocm', 'Runtime Mirrored',
                            FLIPPED_MAP, makeRTL)
  };



  function Locale(id, ctx) {
    this.id = id;
    this.ctx = ctx;
    this.isReady = false;
    this.entries = Object.create(null);
    this.entries.__plural = getPluralRule(this.isPseudo() ?
                                          this.ctx.defaultLocale : id);
  }

  Locale.prototype.isPseudo = function() {
    return this.ctx.qps.indexOf(this.id) !== -1;
  };

  var bindingsIO = {
    extra: function(id, ver, path, type, callback, errback) {
      if (type === 'properties') {
        type = 'text';
      }
      navigator.mozApps.getLocalizationResource(id, ver, path, type).
        then(callback.bind(null, null), errback);
    },
    app: function(id, ver, path, type, callback, errback, sync) {
      switch (type) {
        case 'properties':
          io.load(path, callback, sync);
          break;
        case 'json':
          io.loadJSON(path, callback, sync);
          break;
      }
    },
  };

  Locale.prototype.build = function L_build(callback) {
    var sync = !callback;
    var ctx = this.ctx;
    var self = this;

    var l10nLoads = ctx.resLinks.length;

    function onL10nLoaded(err) {
      if (err) {
        ctx._emitter.emit('fetcherror', err);
      }
      if (--l10nLoads <= 0) {
        self.isReady = true;
        if (callback) {
          callback();
        }
      }
    }

    if (l10nLoads === 0) {
      onL10nLoaded();
      return;
    }

    function onJSONLoaded(err, json) {
      if (!err && json) {
        self.addAST(json);
      }
      onL10nLoaded(err);
    }

    function onPropLoaded(err, source) {
      if (!err && source) {
        var ast = PropertiesParser.parse(ctx, source);
        self.addAST(ast);
      }
      onL10nLoaded(err);
    }

    function onL20nLoaded(err, source) {
      if (!err && source) {
        var ast = L20nParser.parse(ctx, source);
        self.addAST(ast);
      }
      onL10nLoaded(err);
    }

    var idToFetch = this.isPseudo() ? ctx.defaultLocale : this.id;
    var appVersion = null;
    var source = 'app';
    if (typeof(navigator) !== 'undefined') {
      source = navigator.mozL10n._config.localeSources[this.id] || 'app';
      appVersion = navigator.mozL10n._config.appVersion;
    }

    for (var i = 0; i < ctx.resLinks.length; i++) {
      var resLink = decodeURI(ctx.resLinks[i]);
      var path = resLink.replace('{locale}', idToFetch);
      var type = path.substr(path.lastIndexOf('.') + 1);

      var cb;
      switch (type) {
        case 'json':
          cb = onJSONLoaded;
          break;
        case 'properties':
          cb = onPropLoaded;
          break;
        case 'l20n':
          io.load(path, onL20nLoaded, sync);
          break;
      }
      bindingsIO[source](this.id,
        appVersion, path, type, cb, onL10nLoaded, sync);
    }
  };

  function createPseudoEntry(node, entries) {
    return Resolver.createEntry(
      walkContent(node, PSEUDO[this.id].translate),
      entries);
  }

  Locale.prototype.addAST = function(ast) {
    /* jshint -W084 */

    var createEntry = this.isPseudo() ?
      createPseudoEntry.bind(this) : Resolver.createEntry;

    for (var i = 0; i < ast.length; i++) {
      this.entries[ast[i].$i] = createEntry(ast[i], this.entries);
    }
  };




  function Context(id) {
    this.id = id;
    this.isReady = false;
    this.isLoading = false;

    this.defaultLocale = 'en-US';
    this.availableLocales = [];
    this.supportedLocales = [];
    this.qps = [];

    this.resLinks = [];
    this.locales = {};

    this._emitter = new EventEmitter();
    this._ready = new Promise(this.once.bind(this));
  }


  // Getting translations

  function reportMissing(id, err) {
    this._emitter.emit('notfounderror', err);
    return id;
  }

  function getWithFallback(id) {
    /* jshint -W084 */
    var cur = 0;
    var loc;
    var locale;
    while (loc = this.supportedLocales[cur]) {
      locale = this.getLocale(loc);
      if (!locale.isReady) {
        // build without callback, synchronously
        locale.build(null);
      }
      var entry = locale.entries[id];
      if (entry === undefined) {
        cur++;
        reportMissing.call(this, id, new L10nError(
          '"' + id + '"' + ' not found in ' + loc + ' in ' + this.id,
          id, loc));
        continue;
      }
      return entry;
    }

    throw new L10nError(
      '"' + id + '"' + ' missing from all supported locales in ' + this.id, id);
  }

  function formatTuple(args, entity) {
    try {
      return Resolver.format(args, entity);
    } catch (err) {
      this._emitter.emit('resolveerror', err);
      var locals = {
        error: err
      };
      return [locals, entity.id];
    }
  }

  function formatValue(args, entity) {
    if (typeof entity === 'string') {
      return entity;
    }

    // take the string value only
    return formatTuple.call(this, args, entity)[1];
  }

  function formatEntity(args, entity) {
    var entityTuple = formatTuple.call(this, args, entity);
    var value = entityTuple[1];

    var formatted = {
      value: value,
      attrs: null,
    };

    if (entity.attrs) {
      formatted.attrs = Object.create(null);
    }

    for (var key in entity.attrs) {
      /* jshint -W089 */
      var attrTuple = formatTuple.call(this, args, entity.attrs[key]);
      formatted.attrs[key] = attrTuple[1];
    }

    return formatted;
  }

  function formatAsync(fn, id, args) {
    return this._ready.then(
      getWithFallback.bind(this, id)).then(
        fn.bind(this, args),
        reportMissing.bind(this, id));
  }

  Context.prototype.formatValue = function(id, args) {
    return formatAsync.call(this, formatValue, id, args);
  };

  Context.prototype.formatEntity = function(id, args) {
    return formatAsync.call(this, formatEntity, id, args);
  };

  function legacyGet(fn, id, args) {
    if (!this.isReady) {
      throw new L10nError('Context not ready');
    }

    var entry;
    try {
      entry = getWithFallback.call(this, id);
    } catch (err) {
      // Don't handle notfounderrors in individual locales in any special way
      if (err.loc) {
        throw err;
      }
      // For general notfounderrors, report them and return legacy fallback
      reportMissing.call(this, id, err);
      // XXX legacy compat;  some Gaia code checks if returned value is falsy or
      // an empty string to know if a translation is available;  this is bad and
      // will be fixed eventually in https://bugzil.la/1020138
      return '';
    }

    // If translation is broken use regular fallback-on-id approach
    return fn.call(this, args, entry);
  }

  Context.prototype.get = function(id, args) {
    return legacyGet.call(this, formatValue, id, args);
  };

  Context.prototype.getEntity = function(id, args) {
    return legacyGet.call(this, formatEntity, id, args);
  };

  Context.prototype.getLocale = function getLocale(code) {
    /* jshint -W093 */

    var locales = this.locales;
    if (locales[code]) {
      return locales[code];
    }

    return locales[code] = new Locale(code, this);
  };


  // Getting ready

  function negotiate(available, requested, defaultLocale) {
    var supportedLocale;
    // Find the first locale in the requested list that is supported.
    for (var i = 0; i < requested.length; i++) {
      var locale = requested[i];
      if (available.indexOf(locale) !== -1) {
        supportedLocale = locale;
        break;
      }
    }
    if (!supportedLocale ||
        supportedLocale === defaultLocale) {
      return [defaultLocale];
    }

    return [supportedLocale, defaultLocale];
  }

  function freeze(supported) {
    var locale = this.getLocale(supported[0]);
    if (locale.isReady) {
      setReady.call(this, supported);
    } else {
      locale.build(setReady.bind(this, supported));
    }
  }

  function setReady(supported) {
    this.supportedLocales = supported;
    this.isReady = true;
    this._emitter.emit('ready');
  }

  Context.prototype.registerLocales = function(defLocale, available) {

    if (defLocale) {
      this.defaultLocale = defLocale;
    }
    /* jshint boss:true */
    this.availableLocales = [this.defaultLocale];
    this.qps = Object.keys(PSEUDO);

    if (available) {
      for (var i = 0, loc; loc = available[i]; i++) {
        if (this.availableLocales.indexOf(loc) === -1) {
          this.availableLocales.push(loc);
          var pos = this.qps.indexOf(loc);
          if (pos !== -1) {
            // remove from this context's runtime pseudolocales
            this.qps.splice(pos, 1);
          }
        }
      }
    }
  };

  Context.prototype.requestLocales = function requestLocales() {
    if (this.isLoading && !this.isReady) {
      throw new L10nError('Context not ready');
    }

    this.isLoading = true;
    var requested = Array.prototype.slice.call(arguments);
    if (requested.length === 0) {
      throw new L10nError('No locales requested');
    }

    var supported = negotiate(
      this.availableLocales.concat(this.qps),
      requested,
      this.defaultLocale);

    // freeze only if the first language in the fallback chain is new
    if (this.supportedLocales[0] !== supported[0]) {
      freeze.call(this, supported);
    }
  };


  // Events

  Context.prototype.addEventListener = function(type, listener) {
    this._emitter.addEventListener(type, listener);
  };

  Context.prototype.removeEventListener = function(type, listener) {
    this._emitter.removeEventListener(type, listener);
  };

  Context.prototype.ready = function(callback) {
    if (this.isReady) {
      setTimeout(callback);
    }
    this.addEventListener('ready', callback);
  };

  Context.prototype.once = function(callback) {
    /* jshint -W068 */
    if (this.isReady) {
      setTimeout(callback);
      return;
    }

    var callAndRemove = (function() {
      this.removeEventListener('ready', callAndRemove);
      callback();
    }).bind(this);
    this.addEventListener('ready', callAndRemove);
  };



  window.L20n = {
    Context: Context,
    PropertiesParser: PropertiesParser,
    L20nParser: L20nParser,
    getPluralRule: getPluralRule,
    getContext: function L20n_getContext(id) {
      return new Context(id);
    },
    extendEntries: function(entries, ast) {
      for (var i = 0, len = ast.length; i < len; i++) {
        entries[ast[i].$i] = Resolver.createEntry(ast[i], entries);
      }
    },
    Resolver: Resolver
  };

})(this);
