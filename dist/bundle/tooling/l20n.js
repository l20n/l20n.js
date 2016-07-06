var L20n = (function () {
  'use strict';

  /*eslint no-magic-numbers: [0]*/

  const locales2rules = {
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
  const pluralRules = {
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
      if (n % 1 !== 0) {
          return 'other';
      }
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

  function getPluralRule(code) {
    // return a function that gives the plural form name for a given integer
    const index = locales2rules[code.replace(/-.*$/, '')];
    if (!(index in pluralRules)) {
      return () => 'other';
    }
    return pluralRules[index];
  }

  class L10nError extends Error {
    constructor(message, id, lang) {
      super();
      this.name = 'L10nError';
      this.message = message;
      this.id = id;
      this.lang = lang;
    }
  }

  class ParseContext {
    constructor(string) {
      this._source = string;
      this._index = 0;
      this._length = string.length;

      this._lastGoodEntryEnd = 0;
    }

    getResource() {
      const entries = {};
      const errors = [];

      this.getWS();
      while (this._index < this._length) {
        try {
          const entry = this.getEntry();
          if (!entry) {
            this.getWS();
            continue;
          }

          const id = entry.id;
          entries[id] = {};

          if (entry.traits !== null &&
             entry.traits.length !== 0) {
            entries[id].traits = entry.traits;
            if (entry.value) {
              entries[id].val = entry.value;
            }
          } else {
            entries[id] = entry.value;
          }
          this._lastGoodEntryEnd = this._index;
        } catch (e) {
          if (e instanceof L10nError) {
            errors.push(e);
            this.getJunkEntry();
          } else {
            throw e;
          }
        }
        this.getWS();
      }

      return [entries, errors];
    }

    getEntry() {
      if (this._index !== 0 &&
          this._source[this._index - 1] !== '\n') {
        throw this.error('Expected new line and a new entry');
      }

      if (this._source[this._index] === '#') {
        this.getComment();
        return;
      }

      if (this._source[this._index] === '[') {
        this.getSection();
        return;
      }

      if (this._index < this._length &&
          this._source[this._index] !== '\n') {
        return this.getEntity();
      }
    }

    getSection() {
      this._index += 1;
      if (this._source[this._index] !== '[') {
        throw this.error('Expected "[[" to open a section');
      }

      this._index += 1;

      this.getLineWS();
      this.getKeyword();
      this.getLineWS();

      if (this._source[this._index] !== ']' ||
          this._source[this._index + 1] !== ']') {
        throw this.error('Expected "]]" to close a section');
      }

      this._index += 2;

      // sections are ignored in the runtime ast
      return undefined;
    }

    getEntity() {
      const id = this.getIdentifier();

      let traits = null;
      let value = null;

      this.getLineWS();

      let ch = this._source[this._index];

      if (ch !== '=') {
        throw this.error('Expected "=" after Entity ID');
      }
      ch = this._source[++this._index];

      this.getLineWS();

      value = this.getPattern();

      ch = this._source[this._index];

      if (ch === '\n') {
        this._index++;
        this.getLineWS();
        ch = this._source[this._index];
      }

      if ((ch === '[' && this._source[this._index + 1] !== '[') ||
          ch === '*') {
        traits = this.getMembers();
      } else if (value === null) {
        throw this.error(
          'Expected a value (like: " = value") or a trait (like: "[key] value")'
        );
      }

      return {
        id,
        value,
        traits
      };
    }

    getWS() {
      let cc = this._source.charCodeAt(this._index);
      // space, \n, \t, \r
      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
    }

    getLineWS() {
      let cc = this._source.charCodeAt(this._index);
      // space, \t
      while (cc === 32 || cc === 9) {
        cc = this._source.charCodeAt(++this._index);
      }
    }

    getIdentifier() {
      let name = '';

      const start = this._index;
      let cc = this._source.charCodeAt(this._index);

      if ((cc >= 97 && cc <= 122) || // a-z
          (cc >= 65 && cc <= 90) ||  // A-Z
          cc === 95) {               // _
        cc = this._source.charCodeAt(++this._index);
      } else if (name.length === 0) {
        throw this.error('Expected an identifier (starting with [a-zA-Z_])');
      }

      while ((cc >= 97 && cc <= 122) || // a-z
             (cc >= 65 && cc <= 90) ||  // A-Z
             (cc >= 48 && cc <= 57) ||  // 0-9
             cc === 95 || cc === 45) {  // _-
        cc = this._source.charCodeAt(++this._index);
      }

      name += this._source.slice(start, this._index);

      return name;
    }

    getKeyword() {
      let name = '';
      let namespace = this.getIdentifier();

      if (this._source[this._index] === '/') {
        this._index++;
      } else if (namespace) {
        name = namespace;
        namespace = null;
      }

      const start = this._index;
      let cc = this._source.charCodeAt(this._index);

      if ((cc >= 97 && cc <= 122) || // a-z
          (cc >= 65 && cc <= 90) ||  // A-Z
          cc === 95 || cc === 32) {  //  _
        cc = this._source.charCodeAt(++this._index);
      } else if (name.length === 0) {
        throw this.error('Expected an identifier (starting with [a-zA-Z_])');
      }

      while ((cc >= 97 && cc <= 122) || // a-z
             (cc >= 65 && cc <= 90) ||  // A-Z
             (cc >= 48 && cc <= 57) ||  // 0-9
             cc === 95 || cc === 45 || cc === 32) {  //  _-
        cc = this._source.charCodeAt(++this._index);
      }

      name += this._source.slice(start, this._index).trimRight();

      return namespace ?
        { type: 'kw', ns: namespace, name } :
        { type: 'kw', name };
    }

    getPattern() {
      const start = this._index;
      if (this._source[start] === '"') {
        return this.getComplexPattern();
      }
      let eol = this._source.indexOf('\n', this._index);

      if (eol === -1) {
        eol = this._length;
      }

      const line = this._source.slice(start, eol);

      if (line.indexOf('{') !== -1) {
        return this.getComplexPattern();
      }

      this._index = eol + 1;

      this.getWS();

      if (this._source[this._index] === '|') {
        this._index = start;
        return this.getComplexPattern();
      }

      return this._source.slice(start, eol);
    }

    getComplexPattern() {
      let buffer = '';
      const content = [];
      let quoteDelimited = null;
      let firstLine = true;

      let ch = this._source[this._index];


      if (ch === '\\' &&
        (this._source[this._index + 1] === '"' ||
         this._source[this._index + 1] === '{' ||
         this._source[this._index + 1] === '\\')) {
        buffer += this._source[this._index + 1];
        this._index += 2;
        ch = this._source[this._index];
      } else if (ch === '"') {
        quoteDelimited = true;
        this._index++;
        ch = this._source[this._index];
      }

      while (this._index < this._length) {
        if (ch === '\n') {
          if (quoteDelimited) {
            throw this.error('Unclosed string');
          }
          this._index++;
          this.getLineWS();
          if (this._source[this._index] !== '|') {
            break;
          }
          if (firstLine && buffer.length) {
            throw this.error('Multiline string should have the ID line empty');
          }
          firstLine = false;
          this._index++;
          if (this._source[this._index] === ' ') {
            this._index++;
          }
          if (buffer.length) {
            buffer += '\n';
          }
          ch = this._source[this._index];
          continue;
        } else if (ch === '\\') {
          const ch2 = this._source[this._index + 1];
          if ((quoteDelimited && ch2 === '"') ||
              ch2 === '{') {
            ch = ch2;
            this._index++;
          }
        } else if (quoteDelimited && ch === '"') {
          this._index++;
          quoteDelimited = false;
          break;
        } else if (ch === '{') {
          if (buffer.length) {
            content.push(buffer);
          }
          buffer = ''
          content.push(this.getPlaceable());
          ch = this._source[this._index];
          continue;
        }

        if (ch) {
          buffer += ch;
        }
        this._index++;
        ch = this._source[this._index];
      }

      if (quoteDelimited) {
        throw this.error('Unclosed string');
      }

      if (buffer.length) {
        content.push(buffer);
      }

      if (content.length === 0) {
        if (quoteDelimited !== null) {
          return '';
        } else {
          return null;
        }
      }

      if (content.length === 1 &&
          typeof content[0] === 'string') {
        return content[0];
      }

      return content;
    }

    getPlaceable() {
      this._index++;

      const expressions = [];

      this.getLineWS();

      while (this._index < this._length) {
        const start = this._index;
        try {
          expressions.push(this.getPlaceableExpression());
        } catch (e) {
          throw this.error(e.description, start);
        }
        this.getWS();
        if (this._source[this._index] === '}') {
          this._index++;
          break;
        } else if (this._source[this._index] === ',') {
          this._index++;
          this.getWS();
        } else {
          throw this.error('Expected "}" or ","');
        }
      }

      return expressions;
    }

    getPlaceableExpression() {
      const selector = this.getCallExpression();
      let members = null;

      this.getWS();

      if (this._source[this._index] !== '}' &&
          this._source[this._index] !== ',') {
        if (this._source[this._index] !== '-' ||
            this._source[this._index + 1] !== '>') {
          throw this.error('Expected "}", "," or "->"');
        }
        this._index += 2; // ->

        this.getLineWS();

        if (this._source[this._index] !== '\n') {
          throw this.error('Members should be listed in a new line');
        }

        this.getWS();

        members = this.getMembers();

        if (members.length === 0) {
          throw this.error('Expected members for the select expression');
        }
      }

      if (members === null) {
        return selector;
      }
      return {
        type: 'sel',
        exp: selector,
        vars: members
      };
    }

    getCallExpression() {
      const exp = this.getMemberExpression();

      if (this._source[this._index] !== '(') {
        return exp;
      }

      this._index++;

      const args = this.getCallArgs();

      this._index++;

      if (exp.type = 'ref') {
        exp.type = 'fun';
      }

      return {
        type: 'call',
        name: exp,
        args
      };
    }

    getCallArgs() {
      const args = [];

      if (this._source[this._index] === ')') {
        return args;
      }

      while (this._index < this._length) {
        this.getLineWS();

        const exp = this.getCallExpression();

        if (exp.type !== 'ref' ||
           exp.namespace !== undefined) {
          args.push(exp);
        } else {
          this.getLineWS();

          if (this._source[this._index] === ':') {
            this._index++;
            this.getLineWS();

            const val = this.getCallExpression();

            if (val.type === 'ref' ||
                val.type === 'member') {
              this._index = this._source.lastIndexOf('=', this._index) + 1;
              throw this.error('Expected string in quotes');
            }

            args.push({
              type: 'kv',
              name: exp.name,
              val
            });
          } else {
            args.push(exp);
          }
        }

        this.getLineWS();

        if (this._source[this._index] === ')') {
          break;
        } else if (this._source[this._index] === ',') {
          this._index++;
        } else {
          throw this.error('Expected "," or ")"');
        }
      }

      return args;
    }

    getNumber() {
      let num = '';
      let cc = this._source.charCodeAt(this._index);

      if (cc === 45) {
        num += '-';
        cc = this._source.charCodeAt(++this._index);
      }

      if (cc < 48 || cc > 57) {
        throw this.error(`Unknown literal "${num}"`);
      }

      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }

      if (cc === 46) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);

        if (cc < 48 || cc > 57) {
          throw this.error(`Unknown literal "${num}"`);
        }

        while (cc >= 48 && cc <= 57) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);
        }
      }

      return {
        type: 'num',
        val: num
      };
    }

    getMemberExpression() {
      let exp = this.getLiteral();

      while (this._source[this._index] === '[') {
        const keyword = this.getMemberKey();
        exp = {
          type: 'mem',
          key: keyword,
          obj: exp
        };
      }

      return exp;
    }

    getMembers() {
      const members = [];

      while (this._index < this._length) {
        if ((this._source[this._index] !== '[' ||
             this._source[this._index + 1] === '[') &&
            this._source[this._index] !== '*') {
          break;
        }
        let def = false;
        if (this._source[this._index] === '*') { 
          this._index++;
          def = true;
        }

        if (this._source[this._index] !== '[') {
          throw this.error('Expected "["');
        }

        const key = this.getMemberKey();

        this.getLineWS();

        const value = this.getPattern();

        const member = {
          key,
          val: value
        };
        if (def) {
          member.def = true;
        }
        members.push(member);

        this.getWS();
      }

      return members;
    }

    getMemberKey() {
      this._index++;

      const cc = this._source.charCodeAt(this._index);
      let literal;

      if ((cc >= 48 && cc <= 57) || cc === 45) {
        literal = this.getNumber();
      } else {
        literal = this.getKeyword();
      }

      if (this._source[this._index] !== ']') {
        throw this.error('Expected "]"');
      }

      this._index++;
      return literal;
    }

    getLiteral() {
      const cc = this._source.charCodeAt(this._index);
      if ((cc >= 48 && cc <= 57) || cc === 45) {
        return this.getNumber();
      } else if (cc === 34) { // "
        return this.getPattern();
      } else if (cc === 36) { // $
        this._index++;
        return {
          type: 'ext',
          name: this.getIdentifier()
        };
      }

      return {
        type: 'ref',
        name: this.getIdentifier()
      };
    }

    getComment() {
      let eol = this._source.indexOf('\n', this._index);

      while (eol !== -1 && this._source[eol + 1] === '#') {
        this._index = eol + 2;

        eol = this._source.indexOf('\n', this._index);

        if (eol === -1) {
          break;
        }
      }

      if (eol === -1) {
        this._index = this._length;
      } else {
        this._index = eol + 1;
      }
    }

    error(message, start=null) {
      const pos = this._index;

      if (start === null) {
        start = pos;
      }
      start = this._findEntityStart(start);

      const context = this._source.slice(start, pos + 10);

      const msg = '\n\n  ' + message +
        '\nat pos ' + pos + ':\n------\n…' + context + '\n------';
      const err = new L10nError(msg);

      const row = this._source.slice(0, pos).split('\n').length;
      const col = pos - this._source.lastIndexOf('\n', pos - 1);
      err._pos = {start: pos, end: undefined, col: col, row: row};
      err.offset = pos - start;
      err.description = message;
      err.context = context;
      return err;
    }

    getJunkEntry() {
      const pos = this._index;

      let nextEntity = this._findNextEntryStart(pos);

      if (nextEntity === -1) {
        nextEntity = this._length;
      }

      this._index = nextEntity;

      let entityStart = this._findEntityStart(pos);

      if (entityStart < this._lastGoodEntryEnd) {
        entityStart = this._lastGoodEntryEnd;
      }
    }

    _findEntityStart(pos) {
      let start = pos;

      while (true) {
        start = this._source.lastIndexOf('\n', start - 2);
        if (start === -1 || start === 0) {
          start = 0;
          break;
        }
        const cc = this._source.charCodeAt(start + 1);

        if ((cc >= 97 && cc <= 122) || // a-z
            (cc >= 65 && cc <= 90) ||  // A-Z
             cc === 95) {              // _
          start++;
          break;
        }
      }

      return start;
    }

    _findNextEntryStart(pos) {
      let start = pos;

      while (true) {
        if (start === 0 ||
            this._source[start - 1] === '\n') {
          const cc = this._source.charCodeAt(start);

          if ((cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90) ||  // A-Z
               cc === 95 || cc === 35 || cc === 91) {  // _#[
            break;
          }
        }

        start = this._source.indexOf('\n', start);

        if (start === -1) {
          break;
        }
        start++;
      }

      return start;
    }
  }

  var FTLRuntimeParser = {
    parseResource: function(string) {
      const parseContext = new ParseContext(string);
      return parseContext.getResource();
    },
  };

  class ReadWrite {
    constructor(fn) {
      this.fn = fn;
    }

    run(ctx) {
      return this.fn(ctx);
    }

    flatMap(fn) {
      return new ReadWrite(ctx => {
        const [cur, curErrs] = this.run(ctx);
        const [val, valErrs] = fn(cur).run(ctx);
        return [val, [...curErrs, ...valErrs]];
      });
    }
  }

  function ask() {
    return new ReadWrite(ctx => [ctx, []]);
  }

  function tell(log) {
    return new ReadWrite(() => [null, [log]]);
  }

  function unit(val) {
    return new ReadWrite(() => [val, []]);
  }

  function resolve(iter) {
    return function step(resume) {
      const {value, done} = iter.next(resume);
      const rw = (value instanceof ReadWrite) ?
        value : unit(value);
      return done ? rw : rw.flatMap(step);
    }();
  }

  class FTLBase {
    constructor(value, opts) {
      this.value = value;
      this.opts = opts;
    }
    valueOf() {
      return this.value;
    }
  }

  class FTLNone extends FTLBase {
    toString() {
      return this.value || '???';
    }
  }

  class FTLNumber extends FTLBase {
    constructor(value, opts) {
      super(parseFloat(value), opts);
    }
    toString(ctx) {
      const nf = ctx._memoizeIntlObject(
        Intl.NumberFormat, this.opts
      );
      return nf.format(this.value);
    }
  }

  class FTLDateTime extends FTLBase {
    constructor(value, opts) {
      super(new Date(value), opts);
    }
    toString(ctx) {
      const dtf = ctx._memoizeIntlObject(
        Intl.DateTimeFormat, this.opts
      );
      return dtf.format(this.value);
    }
  }

  class FTLKeyword extends FTLBase {
    toString() {
      const { name, namespace } = this.value;
      return namespace ? `${namespace}:${name}` : name;
    }
    match(ctx, other) {
      const { name, namespace } = this.value;
      if (other instanceof FTLKeyword) {
        return name === other.value.name && namespace === other.value.namespace;
      } else if (namespace) {
        return false;
      } else if (typeof other === 'string') {
        return name === other;
      } else if (other instanceof FTLNumber) {
        const pr = ctx._memoizeIntlObject(
          Intl.PluralRules, other.opts
        );
        return name === pr.select(other.valueOf());
      } else {
        return false;
      }
    }
  }

  class FTLList extends Array {
    toString(ctx) {
      const lf = ctx._memoizeIntlObject(
        Intl.ListFormat // XXX add this.opts
      );
      const elems = this.map(
        elem => elem.toString(ctx)
      );
      return lf.format(elems);
    }
  }

  // each builtin takes two arguments:
  //  - args = an array of positional args
  //  - opts  = an object of key-value args

  var builtins = {
    'NUMBER': ([arg], opts) =>
      new FTLNumber(arg.valueOf(), merge(arg.opts, opts)),
    'PLURAL': ([arg], opts) =>
      new FTLNumber(arg.valueOf(), merge(arg.opts, opts)),
    'DATETIME': ([arg], opts) =>
      new FTLDateTime(arg.valueOf(), merge(arg.opts, opts)),
    'LIST': (args) => FTLList.from(args),
    'LEN': ([arg]) => new FTLNumber(arg.valueOf().length),
    'TAKE': ([num, arg]) => FTLList.from(arg.valueOf().slice(0, num.value)),
    'DROP': ([num, arg]) => FTLList.from(arg.valueOf().slice(num.value)),
  };

  function merge(argopts, opts) {
    return Object.assign({}, argopts, valuesOf(opts));
  }

  function valuesOf(opts) {
    return Object.keys(opts).reduce(
      (seq, cur) => Object.assign({}, seq, {
        [cur]: opts[cur].valueOf()
      }), {});
  }

  // Unicode bidi isolation characters
  const FSI = '\u2068';
  const PDI = '\u2069';

  const MAX_PLACEABLE_LENGTH = 2500;

  function* mapValues(arr) {
    let values = new FTLList();
    for (let elem of arr) {
      values.push(yield* Value(elem));
    }
    return values;
  }

  // Helper for choosing entity value
  function* DefaultMember(members, allowNoDefault = false) {
    for (let member of members) {
      if (member.def) {
        return member;
      }
    }

    if (!allowNoDefault) {
      yield tell(new RangeError('No default'));
    }

    return { val: new FTLNone() };
  }


  // Half-resolved expressions evaluate to raw Runtime AST nodes

  function* EntityReference({name}) {
    const { ctx } = yield ask();
    const entity = ctx.messages.get(name);

    if (!entity) {
      yield tell(new ReferenceError(`Unknown entity: ${name}`));
      return new FTLNone(name);
    }

    return entity;
  }

  function* MemberExpression({obj, key}) {
    const entity = yield* EntityReference(obj);
    if (entity instanceof FTLNone) {
      return { val: entity };
    }

    const { ctx } = yield ask();
    const keyword = yield* Value(key);

    for (let member of entity.traits) {
      const memberKey = yield* Value(member.key);
      if (keyword.match(ctx, memberKey)) {
        return member;
      }
    }

    yield tell(new ReferenceError(`Unknown trait: ${keyword.toString(ctx)}`));
    return {
      val: yield* Entity(entity)
    };
  }

  function* SelectExpression({exp, vars}) {
    const selector = yield* Value(exp);
    if (selector instanceof FTLNone) {
      return yield* DefaultMember(vars);
    }

    for (let variant of vars) {
      const key = yield* Value(variant.key);

      if (key instanceof FTLNumber &&
          selector instanceof FTLNumber &&
          key.valueOf() === selector.valueOf()) {
        return variant;
      }

      const { ctx } = yield ask();

      if (key instanceof FTLKeyword &&
          key.match(ctx, selector)) {
        return variant;
      }
    }

    return yield* DefaultMember(vars);
  }


  // Fully-resolved expressions evaluate to FTL types

  function* Value(expr) {
    if (typeof expr === 'string' || expr instanceof FTLNone) {
      return expr;
    }

    if (Array.isArray(expr)) {
      return yield* Pattern(expr);
    }

    switch (expr.type) {
      case 'kw':
        return new FTLKeyword(expr);
      case 'num':
        return new FTLNumber(expr.val);
      case 'ext':
        return yield* ExternalArgument(expr);
      case 'fun':
        return yield* FunctionReference(expr);
      case 'call':
        return yield* CallExpression(expr);
      case 'ref':
        const ref = yield* EntityReference(expr);
        return yield* Entity(ref);
      case 'mem':
        const mem = yield* MemberExpression(expr);
        return yield* Value(mem.val);
      case 'sel':
        const sel = yield* SelectExpression(expr);
        return yield* Value(sel.val);
      default:
        return yield* Value(expr.val);
    }
  }

  function* ExternalArgument({name}) {
    const { args } = yield ask();

    if (!args || !args.hasOwnProperty(name)) {
      yield tell(new ReferenceError(`Unknown external: ${name}`));
      return new FTLNone(name);
    }

    const arg = args[name];

    if (arg instanceof FTLBase) {
      return arg;
    }

    switch (typeof arg) {
      case 'string':
        return arg;
      case 'number':
        return new FTLNumber(arg);
      case 'object':
        if (Array.isArray(arg)) {
          return yield* mapValues(arg);
        }
        if (arg instanceof Date) {
          return new FTLDateTime(arg);
        }
      default:
        yield tell(
          new TypeError(`Unsupported external type: ${name}, ${typeof arg}`)
        );
        return new FTLNone(name);
    }
  }

  function* FunctionReference({name}) {
    const { ctx: { functions } } = yield ask();
    const func = functions[name] || builtins[name];

    if (!func) {
      yield tell(new ReferenceError(`Unknown built-in: ${name}()`));
      return new FTLNone(`${name}()`);
    }

    if (!(func instanceof Function)) {
      yield tell(new TypeError(`Function ${name}() is not callable`));
      return new FTLNone(`${name}()`);
    }

    return func;
  }

  function* CallExpression({name, args}) {
    const callee = yield* FunctionReference(name);

    if (callee instanceof FTLNone) {
      return callee;
    }

    const posargs = [];
    const keyargs = [];

    for (let arg of args) {
      if (arg.type === 'kv') {
        keyargs[arg.name] = yield* Value(arg.val);
      } else {
        posargs.push(yield* Value(arg));
      }
    }

    // XXX builtins should also returns [val, errs] tuples
    return callee(posargs, keyargs);
  }

  function* Pattern(ptn) {
    const { ctx, dirty } = yield ask();

    if (dirty.has(ptn)) {
      yield tell(new RangeError('Cyclic reference'));
      return new FTLNone();
    }

    dirty.add(ptn);
    let result = '';

    for (let part of ptn) {
      if (typeof part === 'string') {
        result += part;
      } else {
        const value = part.length === 1 ?
          yield* Value(part[0]) : yield* mapValues(part);

        const str = value.toString(ctx);
        if (str.length > MAX_PLACEABLE_LENGTH) {
          yield tell(
            new RangeError(
              'Too many characters in placeable ' +
              `(${str.length}, max allowed is ${MAX_PLACEABLE_LENGTH})`
            )
          );
          result += FSI + str.substr(0, MAX_PLACEABLE_LENGTH) + PDI;
        } else {
          result += FSI + str + PDI;
        }
      }
    }

    dirty.delete(ptn);
    return result;
  }

  function* Entity(entity, allowNoDefault = false) {
    if (entity.val !== undefined) {
      return yield* Value(entity.val);
    }

    if (!entity.traits) {
      return yield* Value(entity);
    }

    const def = yield* DefaultMember(entity.traits, allowNoDefault);
    return yield* Value(def);
  }

  // evaluate `entity` to an FTL Value type: string or FTLNone
  function* toFTLType(entity, opts) {
    if (entity === undefined) {
      return new FTLNone();
    }

    return yield* Entity(entity, opts.allowNoDefault);
  }

  const _opts = {
    allowNoDefault: false
  };

  function format(ctx, args, entity, opts = _opts) {
    // optimization: many translations are simple strings and we can very easily 
    // avoid the cost of a proper resolution by having this shortcut here
    if (typeof entity === 'string') {
      return [entity, []];
    }

    return resolve(toFTLType(entity, opts)).run({
      ctx, args, dirty: new WeakSet()
    });
  }

  const optsPrimitive = { allowNoDefault: true };

  class MessageContext {
    constructor(lang, { functions } = {}) {
      this.lang = lang;
      this.functions = functions || {}
      this.messages = new Map();
      this.intls = new WeakMap();
    }

    addMessages(source) {
      const [entries, errors] = FTLRuntimeParser.parseResource(source);
      for (let id in entries) {
        this.messages.set(id, entries[id]);
      }

      return errors;
    }

    // format `entity` to a string or null
    formatToPrimitive(entity, args) {
      const result = format(this, args, entity, optsPrimitive);
      return (result[0] instanceof FTLNone) ?
        [null, result[1]] : result;
    }

    // format `entity` to a string
    format(entity, args) {
      const result = format(this, args, entity);
      return [result[0].toString(), result[1]];
    }

    _memoizeIntlObject(ctor, opts) {
      const cache = this.intls.get(ctor) || {};
      const id = JSON.stringify(opts);

      if (!cache[id]) {
        cache[id] = new ctor(this.lang, opts);
        this.intls.set(ctor, cache);
      }

      return cache[id];
    }

  }

  Intl.MessageContext = MessageContext;
  Intl.MessageNumberArgument = FTLNumber;
  Intl.MessageDateTimeArgument = FTLDateTime;

  if (!Intl.NumberFormat) {
    Intl.NumberFormat = function() {
      return {
        format(n) {
          return n;
        }
      };
    }
  }

  if (!Intl.PluralRules) {
    Intl.PluralRules = function(code) {
      const fn = getPluralRule(code);
      return {
        select(n) {
          return fn(n);
        }
      };
    }
  }

  if (!Intl.ListFormat) {
    Intl.ListFormat = function() {
      return {
        format(list) {
          return list.join(', ');
        }
      };
    }
  }

  class Node {
    constructor() {}
  }

  class Resource extends Node {
    constructor(body = [], comment = null) {
      super();
      this.type = 'Resource';
      this.body = body;
      this.comment = comment;
    }
  }

  class Entry extends Node {
    constructor() {
      super();
      this.type = 'Entry';
    }
  }

  class Identifier extends Node {
    constructor(name) {
      super();
      this.type = 'Identifier';
      this.name = name;
    }
  }

  class Section extends Node {
    constructor(key, body = [], comment = null) {
      super();
      this.type = 'Section';
      this.key = key;
      this.body = body;
      this.comment = comment;
    }
  }

  class Pattern$1 extends Node {
    constructor(source, elements) {
      super();
      this.type = 'Pattern';
      this.source = source;
      this.elements = elements;
    }
  }

  class Member extends Node {
    constructor(key, value, def = false) {
      super();
      this.type = 'Member';
      this.key = key;
      this.value = value;
      this.default = def;
    }
  }

  class Entity$1 extends Entry {
    constructor(id, value = null, traits = [], comment = null) {
      super();
      this.type = 'Entity';
      this.id = id;
      this.value = value;
      this.traits = traits;
      this.comment = comment;
    }
  }

  class Placeable extends Node {
    constructor(expressions) {
      super();
      this.type = 'Placeable';
      this.expressions = expressions;
    }
  }

  class SelectExpression$1 extends Node {
    constructor(expression, variants = null) {
      super();
      this.type = 'SelectExpression';
      this.expression = expression;
      this.variants = variants;
    }
  }

  class MemberExpression$1 extends Node {
    constructor(obj, keyword) {
      super();
      this.type = 'MemberExpression';
      this.object = obj;
      this.keyword = keyword;
    }
  }

  class CallExpression$1 extends Node {
    constructor(callee, args) {
      super();
      this.type = 'CallExpression';
      this.callee = callee;
      this.args = args;
    }
  }

  class ExternalArgument$1 extends Node {
    constructor(name) {
      super();
      this.type = 'ExternalArgument';
      this.name = name;
    }
  }

  class KeyValueArg extends Node {
    constructor(name, value) {
      super();
      this.type = 'KeyValueArg';
      this.name = name;
      this.value = value;
    }
  }

  class EntityReference$1 extends Identifier {
    constructor(name) {
      super(name);
      this.type = 'EntityReference';
    }
  }

  class FunctionReference$1 extends Identifier {
    constructor(name) {
      super(name);
      this.type = 'FunctionReference';
    }
  }

  class Keyword extends Identifier {
    constructor(name, namespace=null) {
      super(name);
      this.type = 'Keyword';
      this.namespace = namespace;
    }
  }

  class Number extends Node {
    constructor(value) {
      super();
      this.type = 'Number';
      this.value = value;
    }
  }

  class TextElement extends Node {
    constructor(value) {
      super();
      this.type = 'TextElement';
      this.value = value;
    }
  }

  class Comment extends Node {
    constructor(content) {
      super();
      this.type = 'Comment';
      this.content = content;
    }
  }

  class JunkEntry extends Entry {
    constructor(content) {
      super();
      this.type = 'JunkEntry';
      this.content = content;
    }
  }

  var AST = {
    Node,
    Pattern: Pattern$1,
    Member,
    Identifier,
    Entity: Entity$1,
    Section,
    Resource,
    Placeable,
    SelectExpression: SelectExpression$1,
    MemberExpression: MemberExpression$1,
    CallExpression: CallExpression$1,
    ExternalArgument: ExternalArgument$1,
    KeyValueArg,
    Number,
    EntityReference: EntityReference$1,
    FunctionReference: FunctionReference$1,
    Keyword,
    TextElement,
    Comment,
    JunkEntry
  };

  class ParseContext$1 {
    constructor(string) {
      this._source = string;
      this._index = 0;
      this._length = string.length;

      this._lastGoodEntryEnd = 0;
    }

    _isIdentifierStart(cc) {
      return ((cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90) ||  // A-Z
               cc === 95);               // _
    }

    getResource() {
      const resource = new AST.Resource();
      const errors = [];
      let comment = null;

      let section = resource.body;

      if (this._source[this._index] === '#') {
        comment = this.getComment();

        const cc = this._source.charCodeAt(this._index);
        if (!this._isIdentifierStart(cc)) {
          resource.comment = comment;
          comment = null;
        }
      }

      this.getWS();
      while (this._index < this._length) {
        try {
          const entry = this.getEntry(comment);
          if (entry.type === 'Section') {
            resource.body.push(entry);
            section = entry.body;
          } else {
            section.push(entry);
          }
          this._lastGoodEntryEnd = this._index;
          comment = null;
        } catch (e) {
          if (e instanceof L10nError) {
            errors.push(e);
            section.push(this.getJunkEntry());
          } else {
            throw e;
          }
        }
        this.getWS();
      }

      return [resource, errors];
    }

    getEntry(comment = null) {
      if (this._index !== 0 &&
          this._source[this._index - 1] !== '\n') {
        throw this.error('Expected new line and a new entry');
      }

      if (comment === null && this._source[this._index] === '#') {
        comment = this.getComment();
      }

      this.getLineWS();

      if (this._source[this._index] === '[') {
        return this.getSection(comment);
      }

      if (this._index < this._length &&
          this._source[this._index] !== '\n') {
        return this.getEntity(comment);
      }
      return comment;
    }

    getSection(comment = null) {
      this._index += 1;
      if (this._source[this._index] !== '[') {
        throw this.error('Expected "[[" to open a section');
      }

      this._index += 1;

      this.getLineWS();

      const key = this.getKeyword();

      this.getLineWS();

      if (this._source[this._index] !== ']' ||
          this._source[this._index + 1] !== ']') {
        throw this.error('Expected "]]" to close a section');
      }

      this._index += 2;

      return new AST.Section(key, [], comment);
    }

    getEntity(comment = null) {
      const id = this.getIdentifier();

      let members = [];
      let value = null;

      this.getLineWS();

      let ch = this._source[this._index];

      if (ch !== '=') {
        throw this.error('Expected "=" after Entity ID');
      }
      ch = this._source[++this._index];

      this.getLineWS();

      value = this.getPattern();

      ch = this._source[this._index];

      if (ch === '\n') {
        this._index++;
        this.getLineWS();
        ch = this._source[this._index];
      }

      if ((ch === '[' && this._source[this._index + 1] !== '[') ||
          ch === '*') {
        members = this.getMembers();
      } else if (value === null) {
        throw this.error(
          'Expected a value (like: " = value") or a trait (like: "[key] value")'
        );
      }

      return new AST.Entity(id, value, members, comment);
    }

    getWS() {
      let cc = this._source.charCodeAt(this._index);
      // space, \n, \t, \r
      while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
        cc = this._source.charCodeAt(++this._index);
      }
    }

    getLineWS() {
      let cc = this._source.charCodeAt(this._index);
      // space, \t
      while (cc === 32 || cc === 9) {
        cc = this._source.charCodeAt(++this._index);
      }
    }

    getIdentifier() {
      let name = '';

      const start = this._index;
      let cc = this._source.charCodeAt(this._index);

      if (this._isIdentifierStart(cc)) {
        cc = this._source.charCodeAt(++this._index);
      } else if (name.length === 0) {
        throw this.error('Expected an identifier (starting with [a-zA-Z_])');
      }

      while ((cc >= 97 && cc <= 122) || // a-z
             (cc >= 65 && cc <= 90) ||  // A-Z
             (cc >= 48 && cc <= 57) ||  // 0-9
             cc === 95 || cc === 45) {  // _-
        cc = this._source.charCodeAt(++this._index);
      }

      name += this._source.slice(start, this._index);

      return new AST.Identifier(name);
    }

    getKeyword() {
      let name = '';
      let namespace = this.getIdentifier().name;

      if (this._source[this._index] === '/') {
        this._index++;
      } else if (namespace) {
        name = namespace;
        namespace = null;
      }

      const start = this._index;
      let cc = this._source.charCodeAt(this._index);

      if (this._isIdentifierStart(cc)) {
        cc = this._source.charCodeAt(++this._index);
      } else if (name.length === 0) {
        throw this.error('Expected an identifier (starting with [a-zA-Z_])');
      }

      while ((cc >= 97 && cc <= 122) || // a-z
             (cc >= 65 && cc <= 90) ||  // A-Z
             (cc >= 48 && cc <= 57) ||  // 0-9
             cc === 95 || cc === 45 || cc === 32) {  //  _-
        cc = this._source.charCodeAt(++this._index);
      }

      name += this._source.slice(start, this._index).trimRight();

      return new AST.Keyword(name, namespace);
    }

    getPattern() {
      let buffer = '';
      let source = '';
      const content = [];
      let quoteDelimited = null;
      let firstLine = true;

      let ch = this._source[this._index];


      if (ch === '\\' &&
        (this._source[this._index + 1] === '"' ||
         this._source[this._index + 1] === '{' ||
         this._source[this._index + 1] === '\\')) {
        buffer += this._source[this._index + 1];
        this._index += 2;
        ch = this._source[this._index];
      } else if (ch === '"') {
        quoteDelimited = true;
        this._index++;
        ch = this._source[this._index];
      }

      while (this._index < this._length) {
        if (ch === '\n') {
          if (quoteDelimited) {
            throw this.error('Unclosed string');
          }
          this._index++;
          this.getLineWS();
          if (this._source[this._index] !== '|') {
            break;
          }
          if (firstLine && buffer.length) {
            throw this.error('Multiline string should have the ID line empty');
          }
          firstLine = false;
          this._index++;
          if (this._source[this._index] === ' ') {
            this._index++;
          }
          if (buffer.length) {
            buffer += '\n';
          }
          ch = this._source[this._index];
          continue;
        } else if (ch === '\\') {
          const ch2 = this._source[this._index + 1];
          if ((quoteDelimited && ch2 === '"') ||
              ch2 === '{') {
            ch = ch2;
            this._index++;
          }
        } else if (quoteDelimited && ch === '"') {
          this._index++;
          quoteDelimited = false;
          break;
        } else if (ch === '{') {
          if (buffer.length) {
            content.push(new AST.TextElement(buffer));
          }
          source += buffer;
          buffer = ''
          const start = this._index;
          content.push(this.getPlaceable());
          source += this._source.substring(start, this._index);
          ch = this._source[this._index];
          continue;
        }

        if (ch) {
          buffer += ch;
        }
        this._index++;
        ch = this._source[this._index];
      }

      if (quoteDelimited) {
        throw this.error('Unclosed string');
      }

      if (buffer.length) {
        source += buffer;
        content.push(new AST.TextElement(buffer));
      }

      if (content.length === 0) {
        if (quoteDelimited !== null) {
          content.push(new AST.TextElement(source));
        } else {
          return null;
        }
      }

      const pattern = new AST.Pattern(source, content);
      pattern._quoteDelim = quoteDelimited !== null;
      return pattern;
    }

    getPlaceable() {
      this._index++;

      const expressions = [];

      this.getLineWS();

      while (this._index < this._length) {
        const start = this._index;
        try {
          expressions.push(this.getPlaceableExpression());
        } catch (e) {
          throw this.error(e.description, start);
        }
        this.getWS();
        if (this._source[this._index] === '}') {
          this._index++;
          break;
        } else if (this._source[this._index] === ',') {
          this._index++;
          this.getWS();
        } else {
          throw this.error('Expected "}" or ","');
        }
      }

      return new AST.Placeable(expressions);
    }

    getPlaceableExpression() {
      const selector = this.getCallExpression();
      let members = null;

      this.getWS();

      if (this._source[this._index] !== '}' &&
          this._source[this._index] !== ',') {
        if (this._source[this._index] !== '-' ||
            this._source[this._index + 1] !== '>') {
          throw this.error('Expected "}", "," or "->"');
        }
        this._index += 2; // ->

        this.getLineWS();

        if (this._source[this._index] !== '\n') {
          throw this.error('Members should be listed in a new line');
        }

        this.getWS();

        members = this.getMembers();

        if (members.length === 0) {
          throw this.error('Expected members for the select expression');
        }
      }

      if (members === null) {
        return selector;
      }
      return new AST.SelectExpression(selector, members);
    }

    getCallExpression() {
      let exp = this.getMemberExpression();

      if (this._source[this._index] !== '(') {
        return exp;
      }

      this._index++;

      const args = this.getCallArgs();

      this._index++;

      if (exp instanceof AST.EntityReference) {
        exp = new AST.FunctionReference(exp.name);
      }

      return new AST.CallExpression(exp, args);
    }

    getCallArgs() {
      const args = [];

      if (this._source[this._index] === ')') {
        return args;
      }

      while (this._index < this._length) {
        this.getLineWS();

        const exp = this.getCallExpression();

        if (!(exp instanceof AST.EntityReference)) {
          args.push(exp);
        } else {
          this.getLineWS();

          if (this._source[this._index] === ':') {
            this._index++;
            this.getLineWS();

            const val = this.getCallExpression();

            if (val instanceof AST.EntityReference ||
                val instanceof AST.MemberExpression) {
              this._index = this._source.lastIndexOf('=', this._index) + 1;
              throw this.error('Expected string in quotes');
            }

            args.push(new AST.KeyValueArg(exp.name, val));
          } else {
            args.push(exp);
          }
        }

        this.getLineWS();

        if (this._source[this._index] === ')') {
          break;
        } else if (this._source[this._index] === ',') {
          this._index++;
        } else {
          throw this.error('Expected "," or ")"');
        }
      }

      return args;
    }

    getNumber() {
      let num = '';
      let cc = this._source.charCodeAt(this._index);

      if (cc === 45) {
        num += '-';
        cc = this._source.charCodeAt(++this._index);
      }

      if (cc < 48 || cc > 57) {
        throw this.error(`Unknown literal "${num}"`);
      }

      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }

      if (cc === 46) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);

        if (cc < 48 || cc > 57) {
          throw this.error(`Unknown literal "${num}"`);
        }

        while (cc >= 48 && cc <= 57) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);
        }
      }

      return new AST.Number(num);
    }

    getMemberExpression() {
      let exp = this.getLiteral();

      while (this._source[this._index] === '[') {
        const keyword = this.getMemberKey();
        exp = new AST.MemberExpression(exp, keyword);
      }

      return exp;
    }

    getMembers() {
      const members = [];

      while (this._index < this._length) {
        if ((this._source[this._index] !== '[' ||
             this._source[this._index + 1] === '[') &&
            this._source[this._index] !== '*') {
          break;
        }
        let def = false;
        if (this._source[this._index] === '*') { 
          this._index++;
          def = true;
        }

        if (this._source[this._index] !== '[') {
          throw this.error('Expected "["');
        }

        const key = this.getMemberKey();

        this.getLineWS();

        const value = this.getPattern();

        const member = new AST.Member(key, value, def);

        members.push(member);

        this.getWS();
      }

      return members;
    }

    getMemberKey() {
      this._index++;

      const cc = this._source.charCodeAt(this._index);
      let literal;

      if ((cc >= 48 && cc <= 57) || cc === 45) {
        literal = this.getNumber();
      } else {
        literal = this.getKeyword();
      }

      if (this._source[this._index] !== ']') {
        throw this.error('Expected "]"');
      }

      this._index++;
      return literal;
    }

    getLiteral() {
      const cc = this._source.charCodeAt(this._index);
      if ((cc >= 48 && cc <= 57) || cc === 45) {
        return this.getNumber();
      } else if (cc === 34) { // "
        return this.getPattern();
      } else if (cc === 36) { // $
        this._index++;
        const name = this.getIdentifier().name;
        return new AST.ExternalArgument(name);
      }

      const name = this.getIdentifier().name;
      return new AST.EntityReference(name);
    }

    getComment() {
      this._index++;
      if (this._source[this._index] === ' ') {
        this._index++;
      }

      let content = '';

      let eol = this._source.indexOf('\n', this._index);

      content += this._source.substring(this._index, eol);

      while (eol !== -1 && this._source[eol + 1] === '#') {
        this._index = eol + 2;

        if (this._source[this._index] === ' ') {
          this._index++;
        }

        eol = this._source.indexOf('\n', this._index);

        if (eol === -1) {
          break;
        }

        content += '\n' + this._source.substring(this._index, eol);
      }

      if (eol === -1) {
        this._index = this._length;
      } else {
        this._index = eol + 1;
      }

      return new AST.Comment(content);
    }

    error(message, start=null) {
      const pos = this._index;

      if (start === null) {
        start = pos;
      }
      start = this._findEntityStart(start);

      const context = this._source.slice(start, pos + 10);

      const msg = '\n\n  ' + message +
        '\nat pos ' + pos + ':\n------\n…' + context + '\n------';
      const err = new L10nError(msg);

      const row = this._source.slice(0, pos).split('\n').length;
      const col = pos - this._source.lastIndexOf('\n', pos - 1);
      err._pos = {start: pos, end: undefined, col: col, row: row};
      err.offset = pos - start;
      err.description = message;
      err.context = context;
      return err;
    }

    getJunkEntry() {
      const pos = this._index;

      let nextEntity = this._findNextEntryStart(pos);

      if (nextEntity === -1) {
        nextEntity = this._length;
      }

      this._index = nextEntity;

      let entityStart = this._findEntityStart(pos);

      if (entityStart < this._lastGoodEntryEnd) {
        entityStart = this._lastGoodEntryEnd;
      }

      const junk = new AST.JunkEntry(
        this._source.slice(entityStart, nextEntity));
      return junk;
    }

    _findEntityStart(pos) {
      let start = pos;

      while (true) {
        start = this._source.lastIndexOf('\n', start - 2);
        if (start === -1 || start === 0) {
          start = 0;
          break;
        }
        const cc = this._source.charCodeAt(start + 1);

        if (this._isIdentifierStart(cc)) {
          start++;
          break;
        }
      }

      return start;
    }

    _findNextEntryStart(pos) {
      let start = pos;

      while (true) {
        if (start === 0 ||
            this._source[start - 1] === '\n') {
          const cc = this._source.charCodeAt(start);

          if (this._isIdentifierStart(cc) || cc === 35 || cc === 91) {
            break;
          }
        }

        start = this._source.indexOf('\n', start);

        if (start === -1) {
          break;
        }
        start++;
      }

      return start;
    }
  }

  var FTLASTParser = {
    parseResource: function(string) {
      const parseContext = new ParseContext$1(string);
      return parseContext.getResource();
    },
  };

  function transformEntity(entity) {
    if (entity.traits.length === 0) {
      return transformPattern(entity.value);
    }

    const ret = {
      traits: entity.traits.map(transformMember),
    };

    return entity.value !== null ?
      Object.assign(ret, { val: transformPattern(entity.value) }) :
      ret;
  }

  function transformExpression(exp) {
    switch (exp.type) {
      case 'EntityReference':
        return {
          type: 'ref',
          name: exp.name
        };
      case 'FunctionReference':
        return {
          type: 'fun',
          name: exp.name
        };
      case 'ExternalArgument':
        return {
          type: 'ext',
          name: exp.name
        };
      case 'Pattern':
        return transformPattern(exp);
      case 'Number':
        return {
          type: 'num',
          val: exp.value
        };
      case 'Keyword':
        const kw = {
          type: 'kw',
          name: exp.name
        };

        return exp.namespace ?
          Object.assign(kw, { ns: exp.namespace }) :
          kw;
      case 'KeyValueArg':
        return {
          type: 'kv',
          name: exp.name,
          val: transformExpression(exp.value)
        };
      case 'SelectExpression':
        return {
          type: 'sel',
          exp: transformExpression(exp.expression),
          vars: exp.variants.map(transformMember)
        };
      case 'MemberExpression':
        return {
          type: 'mem',
          obj: transformExpression(exp.object),
          key: transformExpression(exp.keyword)
        };
      case 'CallExpression':
        return {
          type: 'call',
          name: transformExpression(exp.callee),
          args: exp.args.map(transformExpression)
        };
      default:
        return exp;
    }
  }

  function transformPattern(pattern) {
    if (pattern === null) {
      return null;
    }

    if (pattern.elements.length === 1 &&
        pattern.elements[0].type === 'TextElement') {
      return pattern.source;
    }

    return pattern.elements.map(chunk => {
      if (chunk.type === 'TextElement') {
        return chunk.value;
      }
      if (chunk.type === 'Placeable') {
        return chunk.expressions.map(transformExpression);
      }
      return chunk;
    });
  }

  function transformMember(member) {
    const ret = {
      key: transformExpression(member.key),
      val: transformPattern(member.value),
    };

    if (member.default) {
      ret.def = true;
    }

    return ret;
  }

  function getEntitiesFromBody(body) {
    const entities = {};
    body.forEach(entry => {
      if (entry.type === 'Entity') {
        entities[entry.id.name] = transformEntity(entry);
      } else if (entry.type === 'Section') {
        Object.assign(entities, getEntitiesFromBody(entry.body));
      }
    });
    return entities;
  }

  function createEntriesFromAST([resource, errors]) {
    const entities = getEntitiesFromBody(resource.body);
    return [entities, errors];
  }

  function keysFromContext(ctx, keys, method, prev) {
    const errors = [];
    const translations = keys.map((key, i) => {
      if (prev && prev[i] && prev[i][1].length === 0) {
        // Use a previously formatted good value if there were no errors
        return prev[i];
      }

      const [id, args] = Array.isArray(key) ?
        key : [key, undefined];

      const result = method.call(this, ctx, id, args);
      errors.push(...result[1]);
      // XXX Depending on the kind of errors it might be better to return prev[i] 
      // here;  for instance, when the current translation is completely missing
      return result;
    });

    return [translations, errors];
  }

  function valueFromContext(ctx, id, args) {
    const entity = ctx.messages.get(id);

    if (entity === undefined) {
      return [id, [new L10nError(`Unknown entity: ${id}`)]];
    }

    return ctx.format(entity, args);
  }

  function entityFromContext(ctx, id, args) {
    const entity = ctx.messages.get(id);

    if (entity === undefined) {
      return [
        { value: id, attrs: null },
        [new L10nError(`Unknown entity: ${id}`)]
      ];
    }

    const [value, errors] = ctx.formatToPrimitive(entity, args);

    const formatted = {
      value,
      attrs: null,
    };

    if (entity.traits) {
      formatted.attrs = Object.create(null);
      for (let trait of entity.traits) {
        const [attrValue, attrErrors] = ctx.format(trait, args);
        errors.push(...attrErrors);
        formatted.attrs[trait.key.name] = attrValue;
      }
    }

    return [formatted, errors];
  }

  const HTTP_STATUS_CODE_OK = 200;

  function load(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (xhr.overrideMimeType) {
        xhr.overrideMimeType('text/plain');
      }

      xhr.open('GET', url, true);

      xhr.addEventListener('load', e => {
        if (e.target.status === HTTP_STATUS_CODE_OK ||
            e.target.status === 0) {
          resolve(e.target.response);
        } else {
          reject(new L10nError('Not found: ' + url));
        }
      });
      xhr.addEventListener('error', reject);
      xhr.addEventListener('timeout', reject);

      xhr.send(null);
    });
  }

  function fetchResource(res, lang) {
    const url = res.replace('{locale}', lang);
    return load(url).catch(e => e);
  }

  var index = {
    FTLASTParser, FTLEntriesParser: FTLRuntimeParser, createEntriesFromAST, L10nError,
    keysFromContext, valueFromContext, entityFromContext, fetchResource
  };

  return index;

}());