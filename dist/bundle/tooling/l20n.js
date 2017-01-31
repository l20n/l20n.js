var L20n = (function () {
'use strict';

/*  eslint no-magic-numbers: [0]  */

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

/**
 * An `L10nError` with information about language and entity ID in which
 * the error happened.
 */
class L10nError extends Error {
  constructor(message, id, lang) {
    super();
    this.name = 'L10nError';
    this.message = message;
    this.id = id;
    this.lang = lang;
  }
}

/*  eslint no-magic-numbers: [0]  */

const MAX_PLACEABLES = 100;

/**
 * The `Parser` class is responsible for parsing FTL resources.
 *
 * It's only public method is `getResource(source)` which takes an FTL
 * string and returns a two element Array with an Object of entries
 * generated from the source as the first element and an array of L10nError
 * objects as the second.
 *
 * This parser is optimized for runtime performance.
 *
 * There is an equivalent of this parser in ftl/ast/parser which is
 * generating full AST which is useful for FTL tools.
 */
class EntriesParser {
  /**
   * @param {string} string
   * @returns {{}, []]}
   */
  getResource(string) {
    this._source = string;
    this._index = 0;
    this._length = string.length;

    // This variable is used for error recovery and reporting.
    this._lastGoodEntryEnd = 0;

    const entries = {};
    const errors = [];

    this.getWS();
    while (this._index < this._length) {
      try {
        this.getEntry(entries);
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

  getEntry(entries) {
    // The pointer here should either be at the beginning of the file
    // or right after new line.
    if (this._index !== 0 &&
        this._source[this._index - 1] !== '\n') {
      throw this.error('Expected new line and a new entry');
    }

    const ch = this._source[this._index];

    // We don't care about comments or sections at runtime
    if (ch === '#') {
      this.getComment();
      return;
    }

    if (ch === '[') {
      this.getSection();
      return;
    }

    if (ch !== '\n') {
      this.getEntity(entries);
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

  getEntity(entries) {
    const id = this.getIdentifier();

    this.getLineWS();

    let ch = this._source[this._index];

    if (ch !== '=') {
      throw this.error('Expected "=" after Entity ID');
    }

    this._index++;

    this.getLineWS();

    const val = this.getPattern();

    ch = this._source[this._index];

    // In the scenario when the pattern is quote-delimited
    // the pattern ends with the closing quote.
    if (ch === '\n') {
      this._index++;
      this.getLineWS();
      ch = this._source[this._index];
    }

    if ((ch === '[' && this._source[this._index + 1] !== '[') ||
        ch === '*') {

      const members = this.getMembers();
      entries[id] = {
        traits: members[0],
        def: members[1],
        val
      };

    } else if (typeof val === 'string') {
      entries[id] = val;
    } else if (val === undefined) {
      throw this.error(
        'Expected a value (like: " = value") or a trait (like: "[key] value")'
      );
    } else {
      entries[id] = {
        val
      };
    }
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
    const start = this._index;
    let cc = this._source.charCodeAt(this._index);

    if ((cc >= 97 && cc <= 122) || // a-z
        (cc >= 65 && cc <= 90) ||  // A-Z
        cc === 95) {               // _
      cc = this._source.charCodeAt(++this._index);
    } else {
      throw this.error('Expected an identifier (starting with [a-zA-Z_])');
    }

    while ((cc >= 97 && cc <= 122) || // a-z
           (cc >= 65 && cc <= 90) ||  // A-Z
           (cc >= 48 && cc <= 57) ||  // 0-9
           cc === 95 || cc === 45) {  // _-
      cc = this._source.charCodeAt(++this._index);
    }

    return this._source.slice(start, this._index);
  }

  getKeyword() {
    let name = '';
    let namespace = this.getIdentifier();

    // If the first character after identifier string is '/', it means
    // that what we collected so far is actually a namespace.
    //
    // But if it is not '/', that means that what we collected so far
    // is just the beginning of the keyword and we should continue collecting
    // it.
    // In that scenario, we're going to move charcters collected so far
    // from namespace variable to name variable and set namespace to null.
    //
    // For example, if the keyword is "Foo bar", at this point we only
    // collected "Foo", the index character is not "/", so we're going
    // to move on and see if the next character is allowed in the name.
    //
    // Because it's a space, it is and we'll continue collecting the name.
    //
    // In case the keyword is "Foo/bar", we're going to keep what we collected
    // so far as `namespace`, bump the index and start collecting the name.
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

    // If we encountered the end of name, we want to test is the last
    // collected character is a space.
    // If it is, we will backtrack to the last non-space character because
    // the keyword cannot end with a space character.
    while (this._source.charCodeAt(this._index - 1) === 32) {
      this._index--;
    }

    name += this._source.slice(start, this._index);

    return namespace ?
      { type: 'kw', ns: namespace, name } :
      { type: 'kw', name };
  }

  // We're going to first try to see if the pattern is simple.
  // If it is a simple, not quote-delimited string,
  // we can just look for the end of the line and read the string.
  //
  // Then, if either the line contains a placeable opening `{` or the
  // next line starts with a pipe `|`, we switch to complex pattern.
  getPattern() {
    const start = this._index;
    if (this._source[start] === '"') {
      return this.getComplexPattern();
    }
    let eol = this._source.indexOf('\n', this._index);

    if (eol === -1) {
      eol = this._length;
    }

    const line = start !== eol ?
      this._source.slice(start, eol) : undefined;

    if (line !== undefined && line.includes('{')) {
      return this.getComplexPattern();
    }

    this._index = eol + 1;

    this.getLineWS();

    if (this._source[this._index] === '|') {
      this._index = start;
      return this.getComplexPattern();
    }

    return line;
  }

  /* eslint-disable complexity */
  getComplexPattern() {
    let buffer = '';
    const content = [];
    let placeables = 0;

    // We actually use all three possible states of this variable:
    // true and false indicate if we're within a quote-delimited string
    // null indicates that the string is not quote-delimited
    let quoteDelimited = null;
    let firstLine = true;

    let ch = this._source[this._index];

    // If the string starts with \", \{ or \\ skip the first `\` and add the
    // following character to the buffer without interpreting it.
    if (ch === '\\' &&
      (this._source[this._index + 1] === '"' ||
       this._source[this._index + 1] === '{' ||
       this._source[this._index + 1] === '\\')) {
      buffer += this._source[this._index + 1];
      this._index += 2;
      ch = this._source[this._index];
    } else if (ch === '"') {
      // If the first character of the string is `"`, mark the string
      // as quote delimited.
      quoteDelimited = true;
      this._index++;
      ch = this._source[this._index];
    }

    while (this._index < this._length) {
      // This block handles multi-line strings combining strings seaprated
      // by new line and `|` character at the beginning of the next one.
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
        // We only handle `{` as a character that can be escaped in a string
        // and `"` if the string is quote delimited.
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
        // Push the buffer to content array right before placeable
        if (buffer.length) {
          content.push(buffer);
        }
        if (placeables > MAX_PLACEABLES - 1) {
          throw this.error(
            `Too many placeables, maximum allowed is ${MAX_PLACEABLES}`);
        }
        buffer = '';
        content.push(this.getPlaceable());
        ch = this._source[this._index];
        placeables++;
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

    if (content.length === 0) {
      if (quoteDelimited !== null) {
        return buffer.length ? buffer : '';
      }
      return buffer.length ? buffer : undefined;
    }

    if (buffer.length) {
      content.push(buffer);
    }

    return content;
  }
  /* eslint-enable complexity */

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
      const ch = this._source[this._index];
      if (ch === '}') {
        this._index++;
        break;
      } else if (ch === ',') {
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
    let members;

    this.getWS();

    const ch = this._source[this._index];

    // If the expression is followed by `->` we're going to collect
    // its members and return it as a select expression.
    if (ch !== '}' && ch !== ',') {
      if (ch !== '-' || this._source[this._index + 1] !== '>') {
        throw this.error('Expected "}", "," or "->"');
      }
      this._index += 2; // ->

      this.getLineWS();

      if (this._source[this._index] !== '\n') {
        throw this.error('Members should be listed in a new line');
      }

      this.getWS();

      members = this.getMembers();

      if (members[0].length === 0) {
        throw this.error('Expected members for the select expression');
      }
    }

    if (members === undefined) {
      return selector;
    }
    return {
      type: 'sel',
      exp: selector,
      vars: members[0],
      def: members[1]
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

    if (exp.type === 'ref') {
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

      // EntityReference in this place may be an entity reference, like:
      // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
      if (exp.type !== 'ref' ||
         exp.namespace !== undefined) {
        args.push(exp);
      } else {
        this.getLineWS();

        if (this._source[this._index] === ':') {
          this._index++;
          this.getLineWS();

          const val = this.getCallExpression();

          // If the expression returned as a value of the argument
          // is not a quote delimited string, number or
          // external argument, throw an error.
          //
          // We don't have to check here if the pattern is quote delimited
          // because that's the only type of string allowed in expressions.
          if (typeof val === 'string' ||
              Array.isArray(val) ||
              val.type === 'num' ||
              val.type === 'ext') {
            args.push({
              type: 'kv',
              name: exp.name,
              val
            });
          } else {
            this._index = this._source.lastIndexOf(':', this._index) + 1;
            throw this.error(
              'Expected string in quotes, number or external argument');
          }

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

    // The number literal may start with negative sign `-`.
    if (cc === 45) {
      num += '-';
      cc = this._source.charCodeAt(++this._index);
    }

    // next, we expect at least one digit
    if (cc < 48 || cc > 57) {
      throw this.error(`Unknown literal "${num}"`);
    }

    // followed by potentially more digits
    while (cc >= 48 && cc <= 57) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);
    }

    // followed by an optional decimal separator `.`
    if (cc === 46) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);

      // followed by at least one digit
      if (cc < 48 || cc > 57) {
        throw this.error(`Unknown literal "${num}"`);
      }

      // and optionally more digits
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

    // the obj element of the member expression
    // must be either an entity reference or another member expression.
    while (['ref', 'mem'].includes(exp.type) &&
      this._source[this._index] === '[') {
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
    let index = 0;
    let defaultIndex;

    while (this._index < this._length) {
      const ch = this._source[this._index];

      if ((ch !== '[' || this._source[this._index + 1] === '[') &&
          ch !== '*') {
        break;
      }
      if (ch === '*') {
        this._index++;
        defaultIndex = index;
      }

      if (this._source[this._index] !== '[') {
        throw this.error('Expected "["');
      }

      const key = this.getMemberKey();

      this.getLineWS();

      const member = {
        key,
        val: this.getPattern()
      };
      members[index++] = member;

      this.getWS();
    }

    return [members, defaultIndex];
  }

  // MemberKey may be a Keyword or Number
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

  // At runtime, we don't care about comments so we just have
  // to parse them properly and skip their content.
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

  error(message, start = null) {
    const pos = this._index;

    if (start === null) {
      start = pos;
    }
    start = this._findEntityStart(start);

    const context = this._source.slice(start, pos + 10);

    const msg =
      `\n\n  ${message}\nat pos ${pos}:\n------\n…${context}\n------`;
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
    const parser = new EntriesParser();
    return parser.getResource(string);
  },
};

/**
 * The `FTLType` class is the base of FTL's type system.
 *
 * FTL types wrap JavaScript values and store additional configuration for
 * them, which can then be used in the `toString` method together with a proper
 * `Intl` formatter.
 */
class FTLType {

  /**
   * Create an `FTLType` instance.
   *
   * @param   {Any}    value - JavaScript value to wrap.
   * @param   {Object} opts  - Configuration.
   * @returns {FTLType}
   */
  constructor(value, opts) {
    this.value = value;
    this.opts = opts;
  }

  /**
   * Get the JavaScript value wrapped by this `FTLType` instance.
   *
   * @returns {Any}
   */
  valueOf() {
    return this.value;
  }

  /**
   * Stringify an instance of `FTLType`.
   *
   * This method can use `Intl` formatters memoized by the `MessageContext`
   * instance passed as an argument.
   *
   * @param   {MessageContext} ctx
   * @returns {string}
   */
  toString(ctx) {
    return this.value.toString(ctx);
  }
}

class FTLNone extends FTLType {
  toString() {
    return this.value || '???';
  }
}

class FTLNumber extends FTLType {
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

class FTLDateTime extends FTLType {
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

class FTLKeyword extends FTLType {
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
    }
    return false;
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

/**
 * @module
 *
 * The FTL resolver ships with a number of functions built-in.
 *
 * Each function take two arguments:
 *   - args - an array of positional args
 *   - opts - an object of key-value args
 *
 * Arguments to functions are guaranteed to already be instances of `FTLType`.
 * Functions must return `FTLType` objects as well.  For this reason it may be
 * necessary to unwrap the JavaScript value behind the FTL Value and to merge
 * the configuration of the argument with the configuration of the return
 * value.
 */
var builtins = {
  'NUMBER': ([arg], opts) =>
    new FTLNumber(arg.valueOf(), merge(arg.opts, opts)),
  'DATETIME': ([arg], opts) =>
    new FTLDateTime(arg.valueOf(), merge(arg.opts, opts)),
  'LIST': args => FTLList.from(args),
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

/**
 * @module
 *
 * The role of the FTL resolver is to format a translation object to an
 * instance of `FTLType`.
 *
 * Translations can contain references to other entities or external arguments,
 * conditional logic in form of select expressions, traits which describe their
 * grammatical features, and can use FTL builtins which make use of the `Intl`
 * formatters to format numbers, dates, lists and more into the context's
 * language.  See the documentation of the FTL syntax for more information.
 *
 * In case of errors the resolver will try to salvage as much of the
 * translation as possible.  In rare situations where the resolver didn't know
 * how to recover from an error it will return an instance of `FTLNone`.
 *
 * `EntityReference`, `MemberExpression` and `SelectExpression` resolve to raw
 * Runtime Entries objects and the result of the resolution needs to be passed
 * into `Value` to get their real value.  This is useful for composing
 * expressions.  Consider:
 *
 *     brand-name[nominative]
 *
 * which is a `MemberExpression` with properties `obj: EntityReference` and
 * `key: Keyword`.  If `EntityReference` was resolved eagerly, it would
 * instantly resolve to the value of the `brand-name` entity.  Instead, we want
 * to get the entity object and look for its `nominative` trait.
 *
 * All other expressions (except for `FunctionReference` which is only used in
 * `CallExpression`) resolve to an instance of `FTLType`, which must then be
 * sringified with its `toString` method by the caller.
 */

// Prevent expansion of too long placeables.
const MAX_PLACEABLE_LENGTH = 2500;

// Unicode bidi isolation characters.
const FSI = '\u2068';
const PDI = '\u2069';


/**
 * Map an array of JavaScript values into FTL Values.
 *
 * Used for external arguments of Array type and for implicit Lists in
 * placeables.
 *
 * @private
 */
function mapValues(env, arr) {
  const values = new FTLList();
  for (const elem of arr) {
    values.push(Value(env, elem));
  }
  return values;
}

/**
 * Helper for choosing the default value from a set of members.
 *
 * Used in SelectExpressions and Value.
 *
 * @private
 */
function DefaultMember(env, members, def) {
  if (members[def]) {
    return members[def];
  }

  const { errors } = env;
  errors.push(new RangeError('No default'));
  return new FTLNone();
}


/**
 * Resolve a reference to an entity to the entity object.
 *
 * @private
 */
function EntityReference(env, {name}) {
  const { ctx, errors } = env;
  const entity = ctx.messages.get(name);

  if (!entity) {
    errors.push(new ReferenceError(`Unknown entity: ${name}`));
    return new FTLNone(name);
  }

  return entity;
}

/**
 * Resolve a member expression to the member object.
 *
 * @private
 */
function MemberExpression(env, {obj, key}) {
  const entity = EntityReference(env, obj);
  if (entity instanceof FTLNone) {
    return entity;
  }

  const { ctx, errors } = env;
  const keyword = Value(env, key);

  if (entity.traits) {
    // Match the specified key against keys of each trait, in order.
    for (const member of entity.traits) {
      const memberKey = Value(env, member.key);
      if (keyword.match(ctx, memberKey)) {
        return member;
      }
    }
  }

  errors.push(new ReferenceError(`Unknown trait: ${keyword.toString(ctx)}`));
  return Value(env, entity);
}

/**
 * Resolve a select expression to the member object.
 *
 * @private
 */
function SelectExpression(env, {exp, vars, def}) {
  const selector = Value(env, exp);
  if (selector instanceof FTLNone) {
    return DefaultMember(env, vars, def);
  }

  // Match the selector against keys of each variant, in order.
  for (const variant of vars) {
    const key = Value(env, variant.key);

    // XXX A special case of numbers to avoid code repetition in types.js.
    if (key instanceof FTLNumber &&
        selector instanceof FTLNumber &&
        key.valueOf() === selector.valueOf()) {
      return variant;
    }

    const { ctx } = env;

    if (key instanceof FTLKeyword && key.match(ctx, selector)) {
      return variant;
    }
  }

  return DefaultMember(env, vars, def);
}


/**
 * Resolve expression to an FTL type.
 *
 * JavaScript strings are a special case.  Since they natively have the
 * `toString` method they can be used as if they were an FTL type without
 * paying the cost of creating a instance of one.
 *
 * @param   {Object} expr
 * @returns {FTLType}
 * @private
 */
function Value(env, expr) {
  // A fast-path for strings which are the most common case, and for `FTLNone`
  // which doesn't require any additional logic.
  if (typeof expr === 'string' || expr instanceof FTLNone) {
    return expr;
  }

  // The Runtime AST (Entries) encodes patterns (complex strings with
  // placeables) as Arrays.
  if (Array.isArray(expr)) {
    return Pattern(env, expr);
  }


  switch (expr.type) {
    case 'kw':
      return new FTLKeyword(expr);
    case 'num':
      return new FTLNumber(expr.val);
    case 'ext':
      return ExternalArgument(env, expr);
    case 'fun':
      return FunctionReference(env, expr);
    case 'call':
      return CallExpression(env, expr);
    case 'ref': {
      const entity = EntityReference(env, expr);
      return Value(env, entity);
    }
    case 'mem': {
      const member = MemberExpression(env, expr);
      return Value(env, member);
    }
    case 'sel': {
      const member = SelectExpression(env, expr);
      return Value(env, member);
    }
    case undefined: {
      // If it's a node with a value, resolve the value.
      if (expr.val !== undefined) {
        return Value(env, expr.val);
      }

      const def = DefaultMember(env, expr.traits, expr.def);
      return Value(env, def);
    }
    default:
      return new FTLNone();
  }
}

/**
 * Resolve a reference to an external argument.
 *
 * @private
 */
function ExternalArgument(env, {name}) {
  const { args, errors } = env;

  if (!args || !args.hasOwnProperty(name)) {
    errors.push(new ReferenceError(`Unknown external: ${name}`));
    return new FTLNone(name);
  }

  const arg = args[name];

  if (arg instanceof FTLType) {
    return arg;
  }

  // Convert the argument to an FTL type.
  switch (typeof arg) {
    case 'string':
      return arg;
    case 'number':
      return new FTLNumber(arg);
    case 'object':
      if (Array.isArray(arg)) {
        return mapValues(env, arg);
      }
      if (arg instanceof Date) {
        return new FTLDateTime(arg);
      }
    default:
      errors.push(
        new TypeError(`Unsupported external type: ${name}, ${typeof arg}`)
      );
      return new FTLNone(name);
  }
}

/**
 * Resolve a reference to a function.
 *
 * @private
 */
function FunctionReference(env, {name}) {
  // Some functions are built-in.  Others may be provided by the runtime via
  // the `MessageContext` constructor.
  const { ctx: { functions }, errors } = env;
  const func = functions[name] || builtins[name];

  if (!func) {
    errors.push(new ReferenceError(`Unknown function: ${name}()`));
    return new FTLNone(`${name}()`);
  }

  if (typeof func !== 'function') {
    errors.push(new TypeError(`Function ${name}() is not callable`));
    return new FTLNone(`${name}()`);
  }

  return func;
}

/**
 * Resolve a call to a Function with positional and key-value arguments.
 *
 * @private
 */
function CallExpression(env, {name, args}) {
  const callee = FunctionReference(env, name);

  if (callee instanceof FTLNone) {
    return callee;
  }

  const posargs = [];
  const keyargs = [];

  for (const arg of args) {
    if (arg.type === 'kv') {
      keyargs[arg.name] = Value(env, arg.val);
    } else {
      posargs.push(Value(env, arg));
    }
  }

  // XXX functions should also report errors
  return callee(posargs, keyargs);
}

/**
 * Resolve a pattern (a complex string with placeables).
 *
 * @private
 */
function Pattern(env, ptn) {
  const { ctx, dirty, errors } = env;

  if (dirty.has(ptn)) {
    errors.push(new RangeError('Cyclic reference'));
    return new FTLNone();
  }

  // Tag the pattern as dirty for the purpose of the current resolution.
  dirty.add(ptn);
  let result = '';

  for (const part of ptn) {
    if (typeof part === 'string') {
      result += part;
    } else {
      // Optimize the most common case: the placeable only has one expression.
      // Otherwise map its expressions to Values.
      const value = part.length === 1 ?
        Value(env, part[0]) : mapValues(env, part);

      let str = value.toString(ctx);

      if (str.length > MAX_PLACEABLE_LENGTH) {
        errors.push(
          new RangeError(
            'Too many characters in placeable ' +
            `(${str.length}, max allowed is ${MAX_PLACEABLE_LENGTH})`
          )
        );
        str = str.substr(0, MAX_PLACEABLE_LENGTH);
      }

      if (ctx.useIsolating) {
        result += `${FSI}${str}${PDI}`;
      } else {
        result += str;
      }
    }
  }

  dirty.delete(ptn);
  return result;
}

/**
 * Format a translation into an `FTLType`.
 *
 * The return value must be sringified with its `toString` method by the
 * caller.
 *
 * @param   {MessageContext} ctx
 * @param   {Object}         args
 * @param   {Object}         entity
 * @param   {Array}          errors
 * @returns {FTLType}
 */
function resolve(ctx, args, entity, errors = []) {
  const env = {
    ctx, args, errors, dirty: new WeakSet()
  };
  return Value(env, entity);
}

/**
 * Message contexts are single-language stores of translations.  They are
 * responsible for parsing translation resources in the FTL syntax and can
 * format translation units (entities) to strings.
 *
 * Always use `MessageContext.format` to retrieve translation units from
 * a context.  Translations can contain references to other entities or
 * external arguments, conditional logic in form of select expressions, traits
 * which describe their grammatical features, and can use FTL builtins which
 * make use of the `Intl` formatters to format numbers, dates, lists and more
 * into the context's language.  See the documentation of the FTL syntax for
 * more information.
 */
class MessageContext {

  /**
   * Create an instance of `MessageContext`.
   *
   * The `lang` argument is used to instantiate `Intl` formatters used by
   * translations.  The `options` object can be used to configure the context.
   *
   * Examples:
   *
   *     const ctx = new MessageContext(lang);
   *
   *     const ctx = new MessageContext(lang, { useIsolating: false });
   *
   *     const ctx = new MessageContext(lang, {
   *       useIsolating: true,
   *       functions: {
   *         NODE_ENV: () => process.env.NODE_ENV
   *       }
   *     });
   *
   * Available options:
   *
   *   - `functions` - an object of additional functions available to
   *                   translations as builtins.
   *
   *   - `useIsolating` - boolean specifying whether to use Unicode isolation
   *                    marks (FSI, PDI) for bidi interpolations.
   *
   * @param   {string} lang      - Language of the context.
   * @param   {Object} [options]
   * @returns {MessageContext}
   */
  constructor(lang, { functions = {}, useIsolating = true } = {}) {
    this.lang = lang;
    this.functions = functions;
    this.useIsolating = useIsolating;
    this.messages = new Map();
    this.intls = new WeakMap();
  }

  /**
   * Add a translation resource to the context.
   *
   * The translation resource must use the FTL syntax.  It will be parsed by
   * the context and each translation unit (entity) will be available in the
   * `messages` map by its identifier.
   *
   *     ctx.addMessages('foo = Foo');
   *     ctx.messages.get('foo');
   *
   *     // Returns a raw representation of the 'foo' entity.
   *
   * Parsed entities should be formatted with the `format` method in case they
   * contain logic (references, select expressions etc.).
   *
   * @param   {string} source - Text resource with translations.
   * @returns {Array<Error>}
   */
  addMessages(source) {
    const [entries, errors] = FTLRuntimeParser.parseResource(source);
    for (const id in entries) {
      this.messages.set(id, entries[id]);
    }

    return errors;
  }

  /**
   * Format an entity to a string or null.
   *
   * Format a raw `entity` from the context's `messages` map into a string (or
   * a null if it has a null value).  `args` will be used to resolve references
   * to external arguments inside of the translation.
   *
   * In case of errors `format` will try to salvage as much of the translation
   * as possible and will still return a string.  For performance reasons, the
   * encountered errors are not returned but instead are appended to the
   * `errors` array passed as the third argument.
   *
   *     const errors = [];
   *     ctx.addMessages('hello = Hello, { $name }!');
   *     const hello = ctx.messages.get('hello');
   *     ctx.format(hello, { name: 'Jane' }, errors);
   *
   *     // Returns 'Hello, Jane!' and `errors` is empty.
   *
   *     ctx.format(hello, undefined, errors);
   *
   *     // Returns 'Hello, name!' and `errors` is now:
   *
   *     [<ReferenceError: Unknown external: name>]
   *
   * @param   {Object | string}    entity
   * @param   {Object | undefined} args
   * @param   {Array}              errors
   * @returns {?string}
   */
  format(entity, args, errors) {
    // optimize entities which are simple strings with no traits
    if (typeof entity === 'string') {
      return entity;
    }

    // optimize entities whose value is a simple string, and traits
    if (typeof entity.val === 'string') {
      return entity.val;
    }

    // optimize entities with null values and no default traits
    if (entity.val === undefined && entity.def === undefined) {
      return null;
    }

    const result = resolve(this, args, entity, errors);
    return result instanceof FTLNone ? null : result;
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
  };
}

if (!Intl.PluralRules) {
  Intl.PluralRules = function(code) {
    const fn = getPluralRule(code);
    return {
      select(n) {
        return fn(n);
      }
    };
  };
}

if (!Intl.ListFormat) {
  Intl.ListFormat = function() {
    return {
      format(list) {
        return list.join(', ');
      }
    };
  };
}

class Node {
  constructor() {}
}

class NodeList extends Node {
  constructor(body = [], comment = null) {
    super();
    this.type = 'NodeList';
    this.body = body;
    this.comment = comment;
  }
}

class Resource extends NodeList {
  constructor(body = [], comment = null) {
    super(body, comment);
    this.type = 'Resource';
  }
}

class Section extends NodeList {
  constructor(key, body = [], comment = null) {
    super(body, comment);
    this.type = 'Section';
    this.key = key;
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

class Pattern$1 extends Node {
  constructor(source, elements, quoted = false) {
    super();
    this.type = 'Pattern';
    this.source = source;
    this.elements = elements;
    this.quoted = quoted;
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

class Entity extends Entry {
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
  constructor(name, namespace = null) {
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
  Entity,
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

/*  eslint no-magic-numbers: [0]  */

const MAX_PLACEABLES$1 = 100;

function isIdentifierStart(cc) {
  return ((cc >= 97 && cc <= 122) || // a-z
          (cc >= 65 && cc <= 90) ||  // A-Z
           cc === 95);               // _
}

/**
 * The `Parser` class is responsible for parsing FTL resources.
 *
 * It's only public method is `getResource(source)` which takes an FTL
 * string and returns a two element Array with FTL AST
 * generated from the source as the first element and an array of L10nError
 * objects as the second.
 *
 * This parser is aiming for generating full AST which is useful for FTL tools.
 *
 * There is an equivalent of this parser in ftl/entries/parser which is meant
 * for runtime performance and generates an optimized entries object.
 */
class Parser {
  constructor(withSource = true) {
    this.withSource = withSource;
  }

  /**
   * @param {string} string
   * @returns {[AST.Resource, []]}
   */
  getResource(string) {
    this._source = string;
    this._index = 0;
    this._length = string.length;

    // This variable is used for error recovery and reporting.
    this._lastGoodEntryEnd = 0;

    const resource = new AST.Resource();
    const errors = [];
    let comment = null;

    // Indicates which section entries should be added to.
    // At the moment it may be either Resource.body, or Section.body
    let section = resource.body;

    // If the file starts with a comment not followed immediatelly by
    // an entry, the comment is going to be assigned to the Resource
    if (this._source[this._index] === '#') {
      comment = this.getComment();

      const cc = this._source.charCodeAt(this._index);
      if (!isIdentifierStart(cc)) {
        resource.comment = comment;
        comment = null;
      }
    }

    this.getWS();

    while (this._index < this._length) {
      try {
        const entry = this.getEntry(comment);

        // If retrieved entry is a Section, switch the section pointer to it.
        if (entry instanceof AST.Section) {
          resource.body.push(entry);
          section = entry.body;
        } else {
          section.push(entry);
        }
        this._lastGoodEntryEnd = this._index;

        // If there was a comment at the beginning of the file, and it was
        // immediatelly followed by an Entity, we passed the comment to getEntry
        // and now we want to mark it as null to prevent it from being
        // fed to the next entry.
        if (comment !== null) {
          comment = null;
        }
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
    // The pointer here should either be at the beginning of the file
    // or right after new line.
    if (this._index !== 0 &&
        this._source[this._index - 1] !== '\n') {
      throw this.error('Expected new line and a new entry');
    }

    if (comment === null && this._source[this._index] === '#') {
      comment = this.getComment();
    }

    if (this._source[this._index] === '[') {
      return this.getSection(comment);
    }

    if (this._source[this._index] !== '\n') {
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

    this._index++;

    this.getLineWS();

    value = this.getPattern();

    ch = this._source[this._index];

    // In the scenario when the pattern is quote-delimited
    // the pattern ends with the closing quote.
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
    const start = this._index;
    let cc = this._source.charCodeAt(this._index);

    if (isIdentifierStart(cc)) {
      cc = this._source.charCodeAt(++this._index);
    } else {
      throw this.error('Expected an identifier (starting with [a-zA-Z_])');
    }

    while ((cc >= 97 && cc <= 122) || // a-z
           (cc >= 65 && cc <= 90) ||  // A-Z
           (cc >= 48 && cc <= 57) ||  // 0-9
           cc === 95 || cc === 45) {  // _-
      cc = this._source.charCodeAt(++this._index);
    }

    const name = this._source.slice(start, this._index);

    return new AST.Identifier(name);
  }

  getKeyword() {
    let name = '';
    let namespace = this.getIdentifier().name;

    // If the first character after identifier string is '/', it means
    // that what we collected so far is actually a namespace.
    //
    // But if it is not '/', that means that what we collected so far
    // is just the beginning of the keyword and we should continue collecting
    // it.
    // In that scenario, we're going to move charcters collected so far
    // from namespace variable to name variable and set namespace to null.
    //
    // For example, if the keyword is "Foo bar", at this point we only
    // collected "Foo", the index character is not "/", so we're going
    // to move on and see if the next character is allowed in the name.
    //
    // Because it's a space, it is and we'll continue collecting the name.
    //
    // In case the keyword is "Foo/bar", we're going to keep what we collected
    // so far as `namespace`, bump the index and start collecting the name.
    if (this._source[this._index] === '/') {
      this._index++;
    } else if (namespace) {
      name = namespace;
      namespace = null;
    }

    const start = this._index;
    let cc = this._source.charCodeAt(this._index);

    if (isIdentifierStart(cc)) {
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

    // If we encountered the end of name, we want to test is the last
    // collected character is a space.
    // If it is, we will backtrack to the last non-space character because
    // the keyword cannot end with a space character.
    while (this._source.charCodeAt(this._index - 1) === 32) {
      this._index--;
    }

    name += this._source.slice(start, this._index);

    return new AST.Keyword(name, namespace);
  }

  /* eslint-disable complexity */
  getPattern() {
    let buffer = '';
    let source = '';
    let placeables = 0;
    const content = [];
    // We actually use all three possible states of this variable:
    // true and false indicate if we're within a quote-delimited string
    // null indicates that the string is not quote-delimited
    let quoteDelimited = null;
    let firstLine = true;

    let ch = this._source[this._index];


    // If the string starts with \", \{ or \\ skip the first `\` and add the
    // following character to the buffer without interpreting it.
    if (ch === '\\' &&
      (this._source[this._index + 1] === '"' ||
       this._source[this._index + 1] === '{' ||
       this._source[this._index + 1] === '\\')) {
      buffer += this._source[this._index + 1];
      this._index += 2;
      ch = this._source[this._index];
    } else if (ch === '"') {
      // If the first character of the string is `"`, mark the string
      // as quote delimited.
      quoteDelimited = true;
      this._index++;
      ch = this._source[this._index];
    }

    while (this._index < this._length) {
      // This block handles multi-line strings combining strings seaprated
      // by new line and `|` character at the beginning of the next one.
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
        // We only handle `{` as a character that can be escaped in a string
        // and `"` if the string is quote delimited.
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
        // Push the buffer to content array right before placeable
        if (buffer.length) {
          content.push(new AST.TextElement(buffer));
        }
        if (placeables > MAX_PLACEABLES$1 - 1) {
          throw this.error(
            `Too many placeables, maximum allowed is ${MAX_PLACEABLES$1}`);
        }
        source += buffer;
        buffer = '';
        const start = this._index;
        content.push(this.getPlaceable());
        source += this._source.substring(start, this._index);
        ch = this._source[this._index];
        placeables++;
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

    return new AST.Pattern(
      this.withSource ? source : null, content, quoteDelimited !== null
    );
  }
  /* eslint-enable complexity */

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

    // If the expression is followed by `->` we're going to collect
    // its members and return it as a select expression.
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

      // EntityReference in this place may be an entity reference, like:
      // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
      if (!(exp instanceof AST.EntityReference)) {
        args.push(exp);
      } else {
        this.getLineWS();

        if (this._source[this._index] === ':') {
          this._index++;
          this.getLineWS();

          const val = this.getCallExpression();

          // If the expression returned as a value of the argument
          // is not a quote delimited string, number or
          // external argument, throw an error.
          //
          // We don't have to check here if the pattern is quote delimited
          // because that's the only type of string allowed in expressions.
          if (val instanceof AST.Pattern ||
              val instanceof AST.Number ||
              val instanceof AST.ExternalArgument) {
            args.push(new AST.KeyValueArg(exp.name, val));
          } else {
            // If we encountered an error, get back to the last kvp separator
            // and throw an error from there.
            this._index = this._source.lastIndexOf(':', this._index) + 1;
            throw this.error(
              'Expected string in quotes, number or external argument');
          }
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

    // The number literal may start with negative sign `-`.
    if (cc === 45) {
      num += '-';
      cc = this._source.charCodeAt(++this._index);
    }

    // next, we expect at least one digit
    if (cc < 48 || cc > 57) {
      throw this.error(`Unknown literal "${num}"`);
    }

    // followed by potentially more digits
    while (cc >= 48 && cc <= 57) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);
    }

    // followed by an optional decimal separator `.`
    if (cc === 46) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);

      // followed by at least one digit
      if (cc < 48 || cc > 57) {
        throw this.error(`Unknown literal "${num}"`);
      }

      // and optionally more digits
      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }
    }

    return new AST.Number(num);
  }

  getMemberExpression() {
    let exp = this.getLiteral();

    // the obj element of the member expression
    // must be either an entity reference or another member expression.
    while ((exp instanceof AST.EntityReference ||
            exp instanceof AST.MemberExpression) &&
            this._source[this._index] === '[') {
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

  // MemberKey may be a Keyword or Number
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
    if ((cc >= 48 && cc <= 57) || cc === 45) { // 0-9, -
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

    // We ignore the first white space of each line
    if (this._source[this._index] === ' ') {
      this._index++;
    }

    let eol = this._source.indexOf('\n', this._index);

    let content = this._source.substring(this._index, eol);

    while (eol !== -1 && this._source[eol + 1] === '#') {
      this._index = eol + 2;

      if (this._source[this._index] === ' ') {
        this._index++;
      }

      eol = this._source.indexOf('\n', this._index);

      if (eol === -1) {
        break;
      }

      content += `\n${this._source.substring(this._index, eol)}`;
    }

    if (eol === -1) {
      this._index = this._length;
    } else {
      this._index = eol + 1;
    }

    return new AST.Comment(content);
  }

  error(message, start = null) {
    const pos = this._index;

    if (start === null) {
      start = pos;
    }
    start = this._findEntityStart(start);

    const context = this._source.slice(start, pos + 10);

    const msg =
      `\n\n  ${message}\nat pos ${pos}:\n------\n…${context}\n------`;
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

      if (isIdentifierStart(cc)) {
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

        if (isIdentifierStart(cc) || cc === 35 || cc === 91) {
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
  parseResource: function(string, { withSource = true } = {}) {
    const parser = new Parser(withSource);
    return parser.getResource(string);
  },
};

function transformEntity(entity) {
  if (entity.traits.length === 0) {
    const val = transformPattern(entity.value);
    return Array.isArray(val) ? { val } : val;
  }

  const [traits, def] = transformMembers(entity.traits);
  const ret = {
    traits,
    def
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
      const [vars, def] = transformMembers(exp.variants);
      return {
        type: 'sel',
        exp: transformExpression(exp.expression),
        vars,
        def
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

function transformMembers(members) {
  let def = members.findIndex(member => member.default);
  if (def === -1) {
    def = undefined;
  }
  const traits = members.map(transformMember);
  return [traits, def];
}

function transformMember(member) {
  const ret = {
    key: transformExpression(member.key),
    val: transformPattern(member.value),
  };

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
        resolve(e.target.responseText);
      } else {
        reject(new Error(`${url} not found`));
      }
    });

    xhr.addEventListener('error',
      () => reject(new Error(`${url} failed to load`))
    );
    xhr.addEventListener('timeout',
      () => reject(new Error(`${url} timed out`))
    );

    xhr.send(null);
  });
}

function fetchResource(res, lang) {
  const url = res.replace('{locale}', lang);
  return load(url).catch(() => null);
}

var index = {
  FTLASTParser, FTLEntriesParser: FTLRuntimeParser, createEntriesFromAST, L10nError,
  fetchResource
};

return index;

}());