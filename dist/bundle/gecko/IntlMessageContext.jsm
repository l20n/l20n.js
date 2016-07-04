/* vim: set ts=2 et sw=2 tw=80 filetype=javascript: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

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

this.EXPORTED_SYMBOLS = ['MessageContext'];

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(Intl, "ListFormat",
  "resource://gre/modules/IntlListFormat.jsm");
XPCOMUtils.defineLazyModuleGetter(Intl, "PluralRules",
  "resource://gre/modules/IntlPluralRules.jsm");
XPCOMUtils.defineLazyModuleGetter(Intl, "RelativeTimeFormat",
  "resource://gre/modules/IntlRelativeTimeFormat.jsm");

this.MessageContext = MessageContext;