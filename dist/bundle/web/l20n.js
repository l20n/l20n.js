{

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

const FTLRuntimeParser = {
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

const builtins = {
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

function prioritizeLocales(def, availableLangs, requested) {
  const supportedLocales = new Set();
  for (let lang of requested) {
    if (availableLangs.has(lang)) {
      supportedLocales.add(lang);
    }
  }

  supportedLocales.add(def);
  return supportedLocales;
}

function getDirection(code) {
  const tag = code.split('-')[0];
  return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(tag) >= 0 ?
    'rtl' : 'ltr';
}

const reHtml = /[&<>]/g;
const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

const observerConfig = {
  attributes: true,
  characterData: false,
  childList: true,
  subtree: true,
  attributeFilter: ['data-l10n-id', 'data-l10n-args', 'data-l10n-bundle']
};

class LocalizationObserver extends Map {
  constructor() {
    super();
    this.rootsByLocalization = new WeakMap();
    this.localizationsByRoot = new WeakMap();
    this.observer = new MutationObserver(
      mutations => this.translateMutations(mutations)
    );
  }

  handleEvent() {
    return this.requestLanguages();
  }

  requestLanguages(requestedLangs) {
    const localizations = Array.from(this.values());
    return Promise.all(
      localizations.map(l10n => l10n.requestLanguages(requestedLangs))
    ).then(
      () => this.translateAllRoots()
    )
  }

  setAttributes(element, id, args) {
    element.setAttribute('data-l10n-id', id);
    if (args) {
      element.setAttribute('data-l10n-args', JSON.stringify(args));
    }
    return element;
  }

  getAttributes(element) {
    return {
      id: element.getAttribute('data-l10n-id'),
      args: JSON.parse(element.getAttribute('data-l10n-args'))
    };
  }

  observeRoot(root, l10n = this.get('main')) {
    this.localizationsByRoot.set(root, l10n);
    if (!this.rootsByLocalization.has(l10n)) {
      this.rootsByLocalization.set(l10n, new Set());
    }
    this.rootsByLocalization.get(l10n).add(root);
    this.observer.observe(root, observerConfig);
  }

  disconnectRoot(root) {
    this.pause();
    this.localizationsByRoot.delete(root);
    for (let [name, l10n] of this) {
      const roots = this.rootsByLocalization.get(l10n);
      if (roots && roots.has(root)) {
        roots.delete(root);
        if (roots.size === 0) {
          this.delete(name);
          this.rootsByLocalization.delete(l10n);
        }
      }
    }
    this.resume();
  }

  pause() {
    this.observer.disconnect();
  }

  resume() {
    for (let l10n of this.values()) {
      if (this.rootsByLocalization.has(l10n)) {
        for (let root of this.rootsByLocalization.get(l10n)) {
          this.observer.observe(root, observerConfig)
        }
      }
    }
  }

  translateAllRoots() {
    const localizations = Array.from(this.values());
    return Promise.all(
      localizations.map(
        l10n => this.translateRoots(l10n)
      )
    );
  }

  translateRoots(l10n) {
    if (!this.rootsByLocalization.has(l10n)) {
      return Promise.resolve();
    }

    const roots = Array.from(this.rootsByLocalization.get(l10n));
    return Promise.all(
      roots.map(root => this.translateRoot(root, l10n))
    );
  }

  translateRoot(root, l10n = this.localizationsByRoot.get(root)) {
    return l10n.interactive.then(bundles => {
      const langs = bundles.map(bundle => bundle.lang);

      function setLangs() {
        const wasLocalizedBefore = root.hasAttribute('langs');

        root.setAttribute('langs', langs.join(' '));
        root.setAttribute('lang', langs[0]);
        root.setAttribute('dir', getDirection(langs[0]));

        if (wasLocalizedBefore) {
          root.dispatchEvent(new CustomEvent('DOMRetranslated', {
            bubbles: false,
            cancelable: false,
          }));
        }
      }

      return this.translateRootContent(root).then(setLangs);
    });
  }

  translateMutations(mutations) {
    const targets = new Set();

    for (let mutation of mutations) {
      switch (mutation.type) {
        case 'attributes':
          targets.add(mutation.target);
          break;
        case 'childList':
          for (let addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                this.getTranslatables(addedNode).forEach(
                  targets.add.bind(targets)
                );
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

    this.translateElements(Array.from(targets));
  }

  translateFragment(frag) {
    return this.translateElements(this.getTranslatables(frag));
  }

  translateElements(elements) {
    const elemsByL10n = this.groupElementsByLocalization(elements);
    return this.getElementsTranslation(elemsByL10n).then(
      translations => this.applyTranslations(elemsByL10n, translations)
    );
  }

  applyTranslations(elemsByL10n, translationsByL10n) {
    this.pause();
    for (let [l10n, elems] of elemsByL10n) {
      const translations = translationsByL10n.get(l10n);
      for (let i = 0; i < elems.length; i++) {
        l10n.overlayElement(elems[i], translations[i]);
      }
    }
    this.resume();
  }

  groupElementsByLocalization(elements) {
    return Array.from(elements).reduce(
      (seq, elem) => {
        const l10n = this.getLocalizationForElement(elem);
        const group = (seq.get(l10n) || []).concat(elem);
        return seq.set(l10n, group);
      }, new Map()
    );
  }

  getTranslatables(element) {
    const nodes = Array.from(element.querySelectorAll('[data-l10n-id]'));

    if (typeof element.hasAttribute === 'function' &&
        element.hasAttribute('data-l10n-id')) {
      nodes.push(element);
    }

    return nodes;
  }

  getLocalizationForElement(elem) {
    return this.get(elem.getAttribute('data-l10n-bundle') || 'main');
  }

  getKeysForElements(elems) {
    return elems.map(elem => {
      const id = elem.getAttribute('data-l10n-id');
      const args = elem.getAttribute('data-l10n-args');

      return args ?
        [id, JSON.parse(args.replace(reHtml, match => htmlEntities[match]))] :
        id;
    });
  }

  getElementsTranslation(elemsByL10n) {
    return Promise.all(
      Array.from(elemsByL10n).map(
        ([l10n, elems]) => l10n.formatEntities(this.getKeysForElements(elems))
      )
    ).then(
      translationsList => Array.from(elemsByL10n.keys()).reduce(
        (seq, cur, idx) => seq.set(cur, translationsList[idx]),
        new Map()
      )
    );
  }

}

class ContentLocalizationObserver extends LocalizationObserver {
  translateRootContent(root) {
    return this.translateFragment(root);
  }
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

const properties = new WeakMap();
const contexts = new WeakMap();

class Localization {
  constructor(requestBundles, createContext) {
    this.interactive = requestBundles().then(
      bundles => fetchFirstBundle(bundles, createContext)
    );

    properties.set(this, {
      requestBundles, createContext
    });
  }

  requestLanguages(requestedLangs) {
    return this.interactive.then(
      bundles => changeLanguages(this, bundles, requestedLangs)
    );
  }

  formatWithFallback(bundles, keys, method, prev) {
    const ctx = contexts.get(bundles[0]);

    if (!ctx) {
      return prev.map(tuple => tuple[0]);
    }

    const [translations, errors] = keysFromContext(ctx, keys, method, prev);

    if (errors.length === 0) {
      return translations.map(tuple => tuple[0]);
    }

    // XXX report/emit errors?
    // errors.forEach(e => console.warn(e));

    const { createContext } = properties.get(this);
    return fetchFirstBundle(bundles.slice(1), createContext).then(
      bundles => this.formatWithFallback(bundles, keys, method, translations)
    );
  }

  formatEntities(keys) {
    return this.interactive.then(
      bundles => this.formatWithFallback(bundles, keys, entityFromContext)
    );
  }

  formatValues(...keys) {
    return this.interactive.then(
      bundles => this.formatWithFallback(bundles, keys, valueFromContext)
    );
  }

  formatValue(id, args) {
    return this.formatValues([id, args]).then(
      ([val]) => val
    );
  }

}

function createContextFromBundle(bundle, createContext) {
  return bundle.fetch().then(resources => {
    const ctx = createContext(bundle.lang);
    resources
      .filter(res => !(res instanceof Error))
      .forEach(res => ctx.addMessages(res));
    contexts.set(bundle, ctx);
    return ctx;
  });
}

function fetchFirstBundle(bundles, createContext) {
  const [bundle] = bundles;

  if (!bundle) {
    return Promise.resolve(bundles);
  }

  return createContextFromBundle(bundle, createContext).then(
    () => bundles
  );
}

function changeLanguages(l10n, oldBundles, requestedLangs) {
  const { requestBundles, createContext } = properties.get(l10n);

  return l10n.interactive = requestBundles(requestedLangs).then(
    newBundles => equal(oldBundles, newBundles) ?
      oldBundles : fetchFirstBundle(newBundles, createContext)
  );
}

function equal(bundles1, bundles2) {
  return bundles1.length === bundles2.length &&
    bundles1.every(({lang}, i) => lang === bundles2[i].lang);
}

// match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reOverlay = /<|&#?\w+;/;

function overlayElement(l10n, element, translation) {
  const value = translation.value;

  if (typeof value === 'string') {
    if (!reOverlay.test(value)) {
      element.textContent = value;
    } else {
      // start with an inert template element and move its children into
      // `element` but such that `element`'s own children are not replaced
      const tmpl = element.ownerDocument.createElementNS(
        'http://www.w3.org/1999/xhtml', 'template');
      tmpl.innerHTML = value;
      // overlay the node with the DocumentFragment
      overlay(l10n, element, tmpl.content);
    }
  }

  for (let key in translation.attrs) {
    if (l10n.isAttrAllowed({ name: key }, element)) {
      element.setAttribute(key, translation.attrs[key]);
    }
  }
}

// The goal of overlay is to move the children of `translationElement`
// into `sourceElement` such that `sourceElement`'s own children are not
// replaced, but only have their text nodes and their attributes modified.
//
// We want to make it possible for localizers to apply text-level semantics to
// the translations and make use of HTML entities. At the same time, we
// don't trust translations so we need to filter unsafe elements and
// attributes out and we don't want to break the Web by replacing elements to
// which third-party code might have created references (e.g. two-way
// bindings in MVC frameworks).
function overlay(l10n, sourceElement, translationElement) {
  const result = translationElement.ownerDocument.createDocumentFragment();
  let k, attr;

  // take one node from translationElement at a time and check it against
  // the allowed list or try to match it with a corresponding element
  // in the source
  let childElement;
  while ((childElement = translationElement.childNodes[0])) {
    translationElement.removeChild(childElement);

    if (childElement.nodeType === childElement.TEXT_NODE) {
      result.appendChild(childElement);
      continue;
    }

    const index = getIndexOfType(childElement);
    const sourceChild = getNthElementOfType(sourceElement, childElement, index);
    if (sourceChild) {
      // there is a corresponding element in the source, let's use it
      overlay(l10n, sourceChild, childElement);
      result.appendChild(sourceChild);
      continue;
    }

    if (l10n.isElementAllowed(childElement)) {
      const sanitizedChild = childElement.ownerDocument.createElement(
        childElement.nodeName);
      overlay(l10n, sanitizedChild, childElement);
      result.appendChild(sanitizedChild);
      continue;
    }

    // otherwise just take this child's textContent
    result.appendChild(
      translationElement.ownerDocument.createTextNode(
        childElement.textContent));
  }

  // clear `sourceElement` and append `result` which by this time contains
  // `sourceElement`'s original children, overlayed with translation
  sourceElement.textContent = '';
  sourceElement.appendChild(result);

  // if we're overlaying a nested element, translate the allowed
  // attributes; top-level attributes are handled in `translateElement`
  // XXX attributes previously set here for another language should be
  // cleared if a new language doesn't use them; https://bugzil.la/922577
  if (translationElement.attributes) {
    for (k = 0, attr; (attr = translationElement.attributes[k]); k++) {
      if (l10n.isAttrAllowed(attr, sourceElement)) {
        sourceElement.setAttribute(attr.name, attr.value);
      }
    }
  }
}

// Get n-th immediate child of context that is of the same type as element.
// XXX Use querySelector(':scope > ELEMENT:nth-of-type(index)'), when:
// 1) :scope is widely supported in more browsers and 2) it works with
// DocumentFragments.
function getNthElementOfType(context, element, index) {
  /* jshint boss:true */
  let nthOfType = 0;
  for (let i = 0, child; child = context.children[i]; i++) {
    if (child.nodeType === child.ELEMENT_NODE &&
        child.tagName.toLowerCase() === element.tagName.toLowerCase()) {
      if (nthOfType === index) {
        return child;
      }
      nthOfType++;
    }
  }
  return null;
}

// Get the index of the element among siblings of the same type.
function getIndexOfType(element) {
  let index = 0;
  let child;
  while ((child = element.previousElementSibling)) {
    if (child.tagName === element.tagName) {
      index++;
    }
  }
  return index;
}

const allowed = {
  elements: [
    'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data',
    'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u',
    'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr'
  ],
  attributes: {
    global: ['title', 'aria-label', 'aria-valuetext', 'aria-moz-hint'],
    a: ['download'],
    area: ['download', 'alt'],
    // value is special-cased in isAttrAllowed
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

class HTMLLocalization extends Localization {
  overlayElement(element, translation) {
    return overlayElement(this, element, translation);
  }

  // XXX the allowed list should be amendable; https://bugzil.la/922573
  isElementAllowed(element) {
    return allowed.elements.indexOf(element.tagName.toLowerCase()) !== -1;
  }

  isAttrAllowed(attr, element) {
    const attrName = attr.name.toLowerCase();
    const tagName = element.tagName.toLowerCase();
    // is it a globally safe attribute?
    if (allowed.attributes.global.indexOf(attrName) !== -1) {
      return true;
    }
    // are there no allowed attributes for this element?
    if (!allowed.attributes[tagName]) {
      return false;
    }
    // is it allowed on this element?
    // XXX the allowed list should be amendable; https://bugzil.la/922573
    if (allowed.attributes[tagName].indexOf(attrName) !== -1) {
      return true;
    }
    // special case for value on inputs with type button, reset, submit
    if (tagName === 'input' && attrName === 'value') {
      const type = element.type.toLowerCase();
      if (type === 'submit' || type === 'button' || type === 'reset') {
        return true;
      }
    }
    return false;
  }

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

class ResourceBundle {
  constructor(lang, resIds) {
    this.lang = lang;
    this.loaded = false;
    this.resIds = resIds;
  }

  fetch() {
    if (!this.loaded) {
      this.loaded = Promise.all(
        this.resIds.map(id => fetchResource(id, this.lang))
      );
    }

    return this.loaded;
  }
}

// A document.ready shim
// https://github.com/whatwg/html/issues/127
function documentReady() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    document.addEventListener('readystatechange', function onrsc() {
      document.removeEventListener('readystatechange', onrsc);
      resolve();
    });
  });
}

function getResourceLinks(head) {
  return Array.prototype.map.call(
    head.querySelectorAll('link[rel="localization"]'),
    el => [el.getAttribute('href'), el.getAttribute('name') || 'main']
  ).reduce(
    (seq, [href, name]) => seq.set(name, (seq.get(name) || []).concat(href)),
    new Map()
  );
}

function getMeta(head) {
  let availableLangs = new Set();
  let defaultLang = null;
  let appVersion = null;

  // XXX take last found instead of first?
  const metas = Array.from(head.querySelectorAll(
    'meta[name="availableLanguages"],' +
    'meta[name="defaultLanguage"],' +
    'meta[name="appVersion"]')
  );
  for (let meta of metas) {
    const name = meta.getAttribute('name');
    const content = meta.getAttribute('content').trim();
    switch (name) {
      case 'availableLanguages':
        availableLangs = new Set(content.split(',').map(lang => {
          return lang.trim();
        }));
        break;
      case 'defaultLanguage':
        defaultLang = content;
        break;
      case 'appVersion':
        appVersion = content;
    }
  }

  return {
    defaultLang,
    availableLangs,
    appVersion
  };
}

function createContext(lang) {
  return new Intl.MessageContext(lang);
}

document.l10n = new ContentLocalizationObserver();
window.addEventListener('languagechange', document.l10n);

documentReady().then(() => {
  const { defaultLang, availableLangs } = getMeta(document.head);
  for (let [name, resIds] of getResourceLinks(document.head)) {
    if (!document.l10n.has(name)) {
      createLocalization(name, resIds, defaultLang, availableLangs);
    }
  }
});

function createLocalization(name, resIds, defaultLang, availableLangs) {
  function requestBundles(requestedLangs = new Set(navigator.languages)) {
    const newLangs = prioritizeLocales(
      defaultLang, availableLangs, requestedLangs
    );

    const bundles = [];
    newLangs.forEach(lang => {
      bundles.push(new ResourceBundle(lang, resIds));
    });
    return Promise.resolve(bundles);
  }

  document.l10n.set(
    name, new HTMLLocalization(requestBundles, createContext)
  );

  if (name === 'main') {
    const rootElem = document.documentElement;
    document.l10n.observeRoot(rootElem, document.l10n.get(name));
    document.l10n.translateRoot(rootElem);
  }
}

}