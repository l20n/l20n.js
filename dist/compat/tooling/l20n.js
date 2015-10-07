'use strict';

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (global) {
  'use strict';

  var modules = new Map();
  var moduleCache = new Map();

  function getModule(id) {
    if (!moduleCache.has(id)) {
      moduleCache.set(id, modules.get(id).call(global));
    }

    return moduleCache.get(id);
  }

  modules.set('lib/mocks', function () {
    var PropertiesParser = getModule('lib/format/properties/parser');

    var _getModule = getModule('lib/plurals');

    var getPluralRule = _getModule.getPluralRule;

    var lang = {
      code: 'en-US',
      src: 'app',
      dir: 'ltr'
    };

    function createEntriesFromSource(source) {
      return PropertiesParser.parse(null, source);
    }

    function MockContext(entries) {
      this._getNumberFormatter = function () {
        return {
          format: function (value) {
            return value;
          }
        };
      };

      this._getEntity = function (lang, id) {
        return entries[id];
      };

      this._getMacro = function (lang, id) {
        switch (id) {
          case 'plural':
            return getPluralRule(lang.code);

          default:
            return undefined;
        }
      };
    }

    return { lang: lang, createEntriesFromSource: createEntriesFromSource, MockContext: MockContext };
  });
  modules.set('lib/format/l20n/entries/serializer', function () {
    return function () {
      this.serialize = function (ast) {
        var string = '';

        for (var id in ast) {
          string += dumpEntry(ast[id]) + '\n';
        }

        return string;
      };

      function dumpEntry(entry) {
        return dumpEntity(entry);
      }

      function dumpEntity(entity) {
        var id,
            val = null,
            attrs = {};
        var index = '';

        for (var key in entity) {
          switch (key) {
            case '$v':
              val = entity.$v;
              break;

            case '$x':
              index = dumpIndex(entity.$x);
              break;

            case '$i':
              id = entity.$i.replace(/-/g, '_');
              break;

            default:
              attrs[key] = entity[key];
          }
        }

        if (Object.keys(attrs).length === 0) {
          return '<' + id + index + ' ' + dumpValue(val, 0) + '>';
        } else {
          return '<' + id + index + ' ' + dumpValue(val, 0) + '\n' + dumpAttributes(attrs) + '>';
        }
      }

      function dumpIndex(index) {
        if (index[0].v === 'plural') {
          return '[ @cldr.plural($' + index[1] + ') ]';
        }
      }

      function dumpValue(value, depth) {
        if (value === null) {
          return '';
        }

        if (typeof value === 'string') {
          return dumpString(value);
        }

        if (Array.isArray(value)) {
          return dumpComplexString(value);
        }

        if (typeof value === 'object') {
          if (value.$o) {
            return dumpValue(value.$o);
          }

          return dumpHash(value, depth);
        }
      }

      function dumpString(str) {
        if (str) {
          return '"' + str.replace(/"/g, '\\"') + '"';
        }

        return '';
      }

      function dumpComplexString(chunks) {
        var str = '"';

        for (var i = 0; i < chunks.length; i++) {
          if (typeof chunks[i] === 'string') {
            str += chunks[i];
          } else {
            str += '{{ ' + chunks[i].v.replace(/-/g, '_') + ' }}';
          }
        }

        return str + '"';
      }

      function dumpHash(hash, depth) {
        var items = [];
        var str;

        for (var key in hash) {
          str = '  ' + key + ': ' + dumpValue(hash[key]);
          items.push(str);
        }

        var indent = depth ? '  ' : '';
        return '{\n' + indent + items.join(',\n' + indent) + '\n' + indent + '}';
      }

      function dumpAttributes(attrs) {
        var str = '';

        for (var key in attrs) {
          if (attrs[key].$x) {
            str += '  ' + key + dumpIndex(attrs[key].$x) + ': ' + dumpValue(attrs[key].$v, 1) + '\n';
          } else {
            str += '  ' + key + ': ' + dumpValue(attrs[key], 1) + '\n';
          }
        }

        return str;
      }
    };
  });
  modules.set('lib/format/l20n/ast/serializer', function () {
    var _getModule2 = getModule('lib/errors');

    var L10nError = _getModule2.L10nError;

    return {
      serialize: function (ast) {
        var string = '';

        for (var id in ast) {
          string += this.dumpEntry(ast[id]) + '\n';
        }

        return string;
      },
      serializeString: function (ast) {
        var string = '';

        if (typeof ast === 'object') {
          string += this.dumpValue(ast, 0);
        } else {
          string += this.dumpString(ast);
        }

        return string;
      },
      dumpEntry: function (entry) {
        return this.dumpEntity(entry);
      },
      dumpEntity: function (entity) {
        var id,
            val = null,
            attrs = {};
        var index = '';

        for (var key in entity) {
          switch (key) {
            case '$v':
              val = entity.$v;
              break;

            case '$x':
              index = this.dumpIndex(entity.$x);
              break;

            case '$i':
              id = this.dumpIdentifier(entity.$i);
              break;

            default:
              attrs[key] = entity[key];
          }
        }

        if (Object.keys(attrs).length === 0) {
          return '<' + id + index + ' ' + this.dumpValue(val, 0) + '>';
        } else {
          return '<' + id + index + ' ' + this.dumpValue(val, 0) + '\n' + this.dumpAttributes(attrs) + '>';
        }
      },
      dumpIdentifier: function (id) {
        return id.replace(/-/g, '_');
      },
      dumpValue: function (value, depth) {
        if (value === null) {
          return '';
        }

        if (typeof value === 'string') {
          return this.dumpString(value);
        }

        if (Array.isArray(value)) {
          return this.dumpComplexString(value);
        }

        if (typeof value === 'object') {
          if (value.o) {
            return this.dumpValue(value.v);
          }

          return this.dumpHash(value, depth);
        }
      },
      dumpString: function (str) {
        if (str) {
          return '"' + str.replace(/"/g, '\\"') + '"';
        }

        return '';
      },
      dumpComplexString: function (chunks) {
        var str = '"';

        for (var i = 0; i < chunks.length; i++) {
          if (typeof chunks[i] === 'string') {
            str += chunks[i].replace(/"/g, '\\"');
          } else {
            str += '{{ ' + this.dumpExpression(chunks[i]) + ' }}';
          }
        }

        return str + '"';
      },
      dumpAttributes: function (attrs) {
        var str = '';

        for (var key in attrs) {
          if (attrs[key].x) {
            str += '  ' + key + this.dumpIndex(attrs[key].x) + ': ' + this.dumpValue(attrs[key].v, 1) + '\n';
          } else {
            str += '  ' + key + ': ' + this.dumpValue(attrs[key], 1) + '\n';
          }
        }

        return str;
      },
      dumpExpression: function (exp) {
        switch (exp.t) {
          case 'call':
            return this.dumpCallExpression(exp);

          case 'prop':
            return this.dumpPropertyExpression(exp);
        }

        return this.dumpPrimaryExpression(exp);
      },
      dumpPropertyExpression: function (exp) {
        var idref = this.dumpExpression(exp.e);
        var prop = undefined;

        if (exp.c) {
          prop = this.dumpExpression(exp.p);
          return idref + '[' + prop + ']';
        }

        prop = this.dumpIdentifier(exp.p);
        return idref + '.' + prop;
      },
      dumpCallExpression: function (exp) {
        var pexp = this.dumpExpression(exp.v);
        var attrs = this.dumpItemList(exp.a, this.dumpExpression.bind(this));
        pexp += '(' + attrs + ')';
        return pexp;
      },
      dumpPrimaryExpression: function (exp) {
        var ret = '';

        if (typeof exp === 'string') {
          return exp;
        }

        switch (exp.t) {
          case 'glob':
            ret += '@';
            ret += exp.v;
            break;

          case 'var':
            ret += '$';
            ret += exp.v;
            break;

          case 'id':
            ret += this.dumpIdentifier(exp.v);
            break;

          case 'idOrVar':
            ret += this.dumpIdentifier(exp.v);
            break;

          default:
            throw new L10nError('Unknown primary expression');
        }

        return ret;
      },
      dumpHash: function (hash, depth) {
        var items = [];
        var str;
        var defIndex;

        if ('__default' in hash) {
          defIndex = hash.__default;
        }

        for (var key in hash) {
          var _indent = '  ';

          if (key.charAt(0) === '_' && key.charAt(1) === '_') {
            continue;
          }

          if (key === defIndex) {
            _indent = ' *';
          }

          str = _indent + key + ': ' + this.dumpValue(hash[key], depth + 1);
          items.push(str);
        }

        var indent = new Array(depth + 1).join('  ');
        return '{\n' + indent + items.join(',\n' + indent) + '\n' + indent + '}';
      },
      dumpItemList: function (itemList, cb) {
        return itemList.map(cb).join(', ');
      },
      dumpIndex: function (index) {
        return '[' + this.dumpItemList(index, this.dumpExpression.bind(this)) + ']';
      }
    };
  });
  modules.set('lib/format/l20n/ast/ast', function () {
    var Node = function Node() {
      _classCallCheck(this, Node);

      this.type = this.constructor.name;
    };

    var Entry = (function (_Node) {
      _inherits(Entry, _Node);

      function Entry() {
        _classCallCheck(this, Entry);

        _Node.call(this);
      }

      return Entry;
    })(Node);

    var Identifier = (function (_Node2) {
      _inherits(Identifier, _Node2);

      function Identifier(name) {
        _classCallCheck(this, Identifier);

        _Node2.call(this);
        this.name = name;
      }

      return Identifier;
    })(Node);

    var Variable = (function (_Node3) {
      _inherits(Variable, _Node3);

      function Variable(name) {
        _classCallCheck(this, Variable);

        _Node3.call(this);
        this.name = name;
      }

      return Variable;
    })(Node);

    var Global = (function (_Node4) {
      _inherits(Global, _Node4);

      function Global(name) {
        _classCallCheck(this, Global);

        _Node4.call(this);
        this.name = name;
      }

      return Global;
    })(Node);

    var Value = (function (_Node5) {
      _inherits(Value, _Node5);

      function Value() {
        _classCallCheck(this, Value);

        _Node5.call(this);
      }

      return Value;
    })(Node);

    var String = (function (_Value) {
      _inherits(String, _Value);

      function String(source, content) {
        _classCallCheck(this, String);

        _Value.call(this);
        this.source = source;
        this.content = content;
        this._opchar = '"';
      }

      return String;
    })(Value);

    var Hash = (function (_Value2) {
      _inherits(Hash, _Value2);

      function Hash(items) {
        _classCallCheck(this, Hash);

        _Value2.call(this);
        this.items = items;
      }

      return Hash;
    })(Value);

    var Entity = (function (_Entry) {
      _inherits(Entity, _Entry);

      function Entity(id) {
        var value = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var index = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var attrs = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

        _classCallCheck(this, Entity);

        _Entry.call(this);
        this.id = id;
        this.value = value;
        this.index = index;
        this.attrs = attrs;
      }

      return Entity;
    })(Entry);

    var Resource = (function (_Node6) {
      _inherits(Resource, _Node6);

      function Resource() {
        _classCallCheck(this, Resource);

        _Node6.call(this);
        this.body = [];
      }

      return Resource;
    })(Node);

    var Attribute = (function (_Node7) {
      _inherits(Attribute, _Node7);

      function Attribute(id, value) {
        var index = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, Attribute);

        _Node7.call(this);
        this.id = id;
        this.value = value;
        this.index = index;
      }

      return Attribute;
    })(Node);

    var HashItem = (function (_Node8) {
      _inherits(HashItem, _Node8);

      function HashItem(id, value, defItem) {
        _classCallCheck(this, HashItem);

        _Node8.call(this);
        this.id = id;
        this.value = value;
        this.default = defItem;
      }

      return HashItem;
    })(Node);

    var Comment = (function (_Entry2) {
      _inherits(Comment, _Entry2);

      function Comment(body) {
        _classCallCheck(this, Comment);

        _Entry2.call(this);
        this.body = body;
      }

      return Comment;
    })(Entry);

    var Expression = (function (_Node9) {
      _inherits(Expression, _Node9);

      function Expression() {
        _classCallCheck(this, Expression);

        _Node9.call(this);
      }

      return Expression;
    })(Node);

    var PropertyExpression = (function (_Expression) {
      _inherits(PropertyExpression, _Expression);

      function PropertyExpression(idref, exp) {
        var computed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        _classCallCheck(this, PropertyExpression);

        _Expression.call(this);
        this.idref = idref;
        this.exp = exp;
        this.computed = computed;
      }

      return PropertyExpression;
    })(Expression);

    var CallExpression = (function (_Expression2) {
      _inherits(CallExpression, _Expression2);

      function CallExpression(callee, args) {
        _classCallCheck(this, CallExpression);

        _Expression2.call(this);
        this.callee = callee;
        this.args = args;
      }

      return CallExpression;
    })(Expression);

    var JunkEntry = (function (_Entry3) {
      _inherits(JunkEntry, _Entry3);

      function JunkEntry(content) {
        _classCallCheck(this, JunkEntry);

        _Entry3.call(this);
        this.content = content;
      }

      return JunkEntry;
    })(Entry);

    return {
      Node: Node,
      Identifier: Identifier,
      Value: Value,
      String: String,
      Hash: Hash,
      Entity: Entity,
      Resource: Resource,
      Attribute: Attribute,
      HashItem: HashItem,
      Comment: Comment,
      Variable: Variable,
      Global: Global,
      Expression: Expression,
      PropertyExpression: PropertyExpression,
      CallExpression: CallExpression,
      JunkEntry: JunkEntry
    };
  });
  modules.set('lib/format/l20n/ast/parser', function () {
    var AST = getModule('lib/format/l20n/ast/ast');

    var _getModule3 = getModule('lib/errors');

    var L10nError = _getModule3.L10nError;

    var MAX_PLACEABLES = 100;

    var ParseContext = (function () {
      function ParseContext(string, pos) {
        _classCallCheck(this, ParseContext);

        this._config = {
          pos: pos
        };
        this._source = string;
        this._index = 0;
        this._length = string.length;
        this._curEntryStart = 0;
      }

      ParseContext.prototype.setPosition = function setPosition(node, start, end) {
        if (!this._config.pos) {
          return;
        }

        node._pos = {
          start: start,
          end: end
        };
      };

      ParseContext.prototype.getResource = function getResource() {
        var resource = new AST.Resource();
        this.setPosition(resource, 0, this._length);
        resource._errors = [];
        this.getWS();

        while (this._index < this._length) {
          try {
            resource.body.push(this.getEntry());
          } catch (e) {
            if (e instanceof L10nError) {
              resource._errors.push(e);

              resource.body.push(this.getJunkEntry());
            } else {
              throw e;
            }
          }

          if (this._index < this._length) {
            this.getWS();
          }
        }

        return resource;
      };

      ParseContext.prototype.getEntry = function getEntry() {
        this._curEntryStart = this._index;

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
      };

      ParseContext.prototype.getEntity = function getEntity(id, index) {
        if (!this.getRequiredWS()) {
          throw this.error('Expected white space');
        }

        var ch = this._source.charAt(this._index);

        var value = this.getValue(ch, index === undefined);
        var attrs = undefined;

        if (value === null) {
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
        var entity = new AST.Entity(id, value, index, attrs);
        this.setPosition(entity, this._curEntryStart, this._index);
        return entity;
      };

      ParseContext.prototype.getValue = function getValue() {
        var ch = arguments.length <= 0 || arguments[0] === undefined ? this._source[this._index] : arguments[0];
        var optional = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        switch (ch) {
          case '\'':
          case '"':
            return this.getString(ch, 1);

          case '{':
            return this.getHash();
        }

        if (!optional) {
          throw this.error('Unknown value type');
        }

        return null;
      };

      ParseContext.prototype.getWS = function getWS() {
        var cc = this._source.charCodeAt(this._index);

        while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
          cc = this._source.charCodeAt(++this._index);
        }
      };

      ParseContext.prototype.getRequiredWS = function getRequiredWS() {
        var pos = this._index;

        var cc = this._source.charCodeAt(pos);

        while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
          cc = this._source.charCodeAt(++this._index);
        }

        return this._index !== pos;
      };

      ParseContext.prototype.getIdentifier = function getIdentifier() {
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

        var id = new AST.Identifier(this._source.slice(start, this._index));
        this.setPosition(id, start, this._index);
        return id;
      };

      ParseContext.prototype.getUnicodeChar = function getUnicodeChar() {
        for (var i = 0; i < 4; i++) {
          var cc = this._source.charCodeAt(++this._index);

          if (cc > 96 && cc < 103 || cc > 64 && cc < 71 || cc > 47 && cc < 58) {
            continue;
          }

          throw this.error('Illegal unicode escape sequence');
        }

        return '\\u' + this._source.slice(this._index - 3, this._index + 1);
      };

      ParseContext.prototype.getString = function getString(opchar, opcharLen) {
        var body = [];
        var buf = '';
        var placeables = 0;
        this._index += opcharLen - 1;
        var start = this._index + 1;
        var closed = false;

        while (!closed) {
          var ch = this._source[++this._index];

          switch (ch) {
            case '\\':
              var ch2 = this._source[++this._index];

              if (ch2 === 'u') {
                buf += this.getUnicodeChar();
              } else if (ch2 === opchar || ch2 === '\\') {
                buf += ch2;
              } else if (ch2 === '{' && this._source[this._index + 1] === '{') {
                buf += '{';
              } else {
                throw this.error('Illegal escape sequence');
              }

              break;

            case '{':
              if (this._source[this._index + 1] === '{') {
                if (placeables > MAX_PLACEABLES - 1) {
                  throw this.error('Too many placeables, maximum allowed is ' + MAX_PLACEABLES);
                }

                if (buf.length) {
                  body.push(buf);
                  buf = '';
                }

                this._index += 2;
                this.getWS();
                body.push(this.getExpression());
                this.getWS();

                if (!this._source.startsWith('}}', this._index)) {
                  throw this.error('Expected "}}"');
                }

                this._index += 1;
                placeables++;
                break;
              }

            default:
              if (ch === opchar) {
                this._index++;
                closed = true;
                break;
              }

              buf += ch;

              if (this._index + 1 >= this._length) {
                throw this.error('Unclosed string literal');
              }

          }
        }

        if (buf.length) {
          body.push(buf);
        }

        var string = new AST.String(this._source.slice(start, this._index - 1), body);
        this.setPosition(string, start, this._index);
        string._opchar = opchar;
        return string;
      };

      ParseContext.prototype.getAttributes = function getAttributes() {
        var attrs = [];

        while (true) {
          var attr = this.getAttribute();
          attrs.push(attr);
          var ws1 = this.getRequiredWS();

          var ch = this._source.charAt(this._index);

          if (ch === '>') {
            break;
          } else if (!ws1) {
            throw this.error('Expected ">"');
          }
        }

        return attrs;
      };

      ParseContext.prototype.getAttribute = function getAttribute() {
        var start = this._index;
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
        var attr = new AST.Attribute(key, this.getValue(), index);
        this.setPosition(attr, start, this._index);
        return attr;
      };

      ParseContext.prototype.getHash = function getHash() {
        var start = this._index;
        var items = [];
        ++this._index;
        this.getWS();

        while (true) {
          items.push(this.getHashItem());
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

        var hash = new AST.Hash(items);
        this.setPosition(hash, start, this._index);
        return hash;
      };

      ParseContext.prototype.getHashItem = function getHashItem() {
        var start = this._index;
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
        var hashItem = new AST.HashItem(key, this.getValue(), defItem);
        this.setPosition(hashItem, start, this._index);
        return hashItem;
      };

      ParseContext.prototype.getComment = function getComment() {
        this._index += 2;
        var start = this._index;

        var end = this._source.indexOf('*/', start);

        if (end === -1) {
          throw this.error('Comment without a closing tag');
        }

        this._index = end + 2;
        var comment = new AST.Comment(this._source.slice(start, end));
        this.setPosition(comment, start - 2, this._index);
        return comment;
      };

      ParseContext.prototype.getExpression = function getExpression() {
        var start = this._index;
        var exp = this.getPrimaryExpression();

        while (true) {
          var ch = this._source[this._index];

          if (ch === '.' || ch === '[') {
            ++this._index;
            exp = this.getPropertyExpression(exp, ch === '[', start);
          } else if (ch === '(') {
            ++this._index;
            exp = this.getCallExpression(exp, start);
          } else {
            break;
          }
        }

        return exp;
      };

      ParseContext.prototype.getPropertyExpression = function getPropertyExpression(idref, computed, start) {
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

        var propExpr = new AST.PropertyExpression(idref, exp, computed);
        this.setPosition(propExpr, start, this._index);
        return propExpr;
      };

      ParseContext.prototype.getCallExpression = function getCallExpression(callee, start) {
        this.getWS();
        var callExpr = new AST.CallExpression(callee, this.getItemList(this.getExpression, ')'));
        this.setPosition(callExpr, start, this._index);
        return callExpr;
      };

      ParseContext.prototype.getPrimaryExpression = function getPrimaryExpression() {
        var start = this._index;
        var ch = this._source[this._index];

        switch (ch) {
          case '$':
            ++this._index;
            var variable = new AST.Variable(this.getIdentifier());
            this.setPosition(variable, start, this._index);
            return variable;

          case '@':
            ++this._index;
            var global = new AST.Global(this.getIdentifier());
            this.setPosition(global, start, this._index);
            return global;

          default:
            return this.getIdentifier();
        }
      };

      ParseContext.prototype.getItemList = function getItemList(callback, closeChar) {
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
      };

      ParseContext.prototype.error = function error(message) {
        var pos = this._index;

        var start = this._source.lastIndexOf('<', pos - 1);

        var lastClose = this._source.lastIndexOf('>', pos - 1);

        start = lastClose > start ? lastClose + 1 : start;

        var context = this._source.slice(start, pos + 10);

        var msg = message + ' at pos ' + pos + ': `' + context + '`';
        var err = new L10nError(msg);
        err._pos = {
          start: pos,
          end: undefined
        };
        err.offset = pos - start;
        err.description = message;
        err.context = context;
        return err;
      };

      ParseContext.prototype.getJunkEntry = function getJunkEntry() {
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
        var junk = new AST.JunkEntry(this._source.slice(this._curEntryStart, nextEntry));
        this.setPosition(junk, this._curEntryStart, nextEntry);
        return junk;
      };

      return ParseContext;
    })();

    return {
      parseResource: function (string) {
        var pos = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var parseContext = new ParseContext(string, pos);
        return parseContext.getResource();
      }
    };
  });
  modules.set('lib/intl', function () {
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

    return { prioritizeLocales: prioritizeLocales };
  });
  modules.set('bindings/html/langs', function () {
    var _getModule4 = getModule('lib/intl');

    var prioritizeLocales = _getModule4.prioritizeLocales;

    var _getModule5 = getModule('lib/pseudo');

    var pseudo = _getModule5.pseudo;

    var rtlList = ['ar', 'he', 'fa', 'ps', 'qps-plocm', 'ur'];

    function getMeta(head) {
      var availableLangs = Object.create(null);
      var defaultLang = null;
      var appVersion = null;
      var metas = head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]');

      for (var _iterator = metas, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var meta = _ref;

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
      return str.split(',').reduce(function (seq, cur) {
        var _getLangRevisionTuple2 = getLangRevisionTuple(cur);

        var lang = _getLangRevisionTuple2[0];
        var rev = _getLangRevisionTuple2[1];

        seq[lang] = rev;
        return seq;
      }, seq);
    }

    function getLangRevisionTuple(str) {
      var _str$trim$split = str.trim().split(':');

      var lang = _str$trim$split[0];
      var rev = _str$trim$split[1];

      return [lang, parseInt(rev)];
    }

    function negotiateLanguages(fn, appVersion, defaultLang, availableLangs, additionalLangs, prevLangs, requestedLangs) {
      var allAvailableLangs = Object.keys(availableLangs).concat(additionalLangs || []).concat(Object.keys(pseudo));
      var newLangs = prioritizeLocales(defaultLang, allAvailableLangs, requestedLangs);
      var langs = newLangs.map(function (code) {
        return {
          code: code,
          src: getLangSource(appVersion, availableLangs, additionalLangs, code),
          dir: getDirection(code)
        };
      });

      if (!arrEqual(prevLangs, newLangs)) {
        fn(langs);
      }

      return langs;
    }

    function getDirection(code) {
      return rtlList.indexOf(code) >= 0 ? 'rtl' : 'ltr';
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

    return { getMeta: getMeta, negotiateLanguages: negotiateLanguages, getDirection: getDirection };
  });
  modules.set('lib/pseudo', function () {
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
          'qps-ploc': 'ȦƁƇḒḖƑƓĦĪ' + 'ĴĶĿḾȠǾƤɊŘ' + 'ŞŦŬṼẆẊẎẐ' + '[\\]^_`' + 'ȧƀƈḓḗƒɠħī' + 'ĵķŀḿƞǿƥɋř' + 'şŧŭṽẇẋẏẑ',
          'qps-plocm': '∀ԐↃpƎɟפHIſ' + 'Ӽ˥WNOԀÒᴚS⊥∩Ʌ' + 'ＭXʎZ' + '[\\]ᵥ_,' + 'ɐqɔpǝɟƃɥıɾ' + 'ʞʅɯuodbɹsʇnʌʍxʎz'
        };
        var mods = {
          'qps-ploc': function (val) {
            return val.replace(reVowels, function (match) {
              return match + match.toLowerCase();
            });
          },
          'qps-plocm': function (val) {
            return val.replace(reWords, function (match) {
              return '‮' + match + '‬';
            });
          }
        };

        var replaceChars = function (map, val) {
          return val.replace(reAlphas, function (match) {
            return map.charAt(match.charCodeAt(0) - 65);
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
      'qps-ploc': {
        enumerable: true,
        get: createGetter('qps-ploc', 'Runtime Accented')
      },
      'qps-plocm': {
        enumerable: true,
        get: createGetter('qps-plocm', 'Runtime Mirrored')
      }
    });
    return { walkEntry: walkEntry, walkValue: walkValue, pseudo: pseudo };
  });
  modules.set('lib/format/l20n/entries/parser', function () {
    var _getModule6 = getModule('lib/errors');

    var L10nError = _getModule6.L10nError;

    var MAX_PLACEABLES = 100;
    return {
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
        var value = this.getValue(ch, index === undefined);
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
        var optional = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        switch (ch) {
          case '\'':
          case '"':
            return this.getString(ch, 1);

          case '{':
            return this.getHash();
        }

        if (!optional) {
          throw this.error('Unknown value type');
        }

        return;
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
            if (placeables > MAX_PLACEABLES - 1) {
              throw this.error('Too many placeables, maximum allowed is ' + MAX_PLACEABLES);
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
        var value = this.getValue();

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
      getHash: function () {
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
  });
  modules.set('lib/format/properties/parser', function () {
    var _getModule7 = getModule('lib/errors');

    var L10nError = _getModule7.L10nError;

    var MAX_PLACEABLES = 100;
    return {
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
          throw this.error('Error in ID: "' + name + '".' + ' Nested attributes are not supported.');
        }

        var attr;

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

        if (isSimpleValue && (!entries[id] || isSimpleNode)) {
          if (id in root) {
            throw this.error();
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
            complexStr.push({
              type: 'idOrVar',
              name: chunks[i]
            });
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
            },
            args: [{
              type: 'idOrVar',
              name: match[2]
            }]
          }];
        } else {
          return [{
            type: 'idOrVar',
            name: match[1]
          }];
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
  });
  modules.set('lib/plurals', function () {
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

    return { getPluralRule: getPluralRule };
  });
  modules.set('lib/resolver', function () {
    var _getModule8 = getModule('lib/errors');

    var L10nError = _getModule8.L10nError;

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
        return [{
          error: err
        }, FSI + '{{ ' + id + ' }}' + PDI];
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
      return arr.reduce(function (_ref4, cur) {
        var localsSeq = _ref4[0];
        var valueSeq = _ref4[1];

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

    return { format: format };
  });
  modules.set('lib/context', function () {
    var _getModule9 = getModule('lib/errors');

    var L10nError = _getModule9.L10nError;

    var _getModule10 = getModule('lib/resolver');

    var format = _getModule10.format;

    var _getModule11 = getModule('lib/plurals');

    var getPluralRule = _getModule11.getPluralRule;

    var Context = (function () {
      function Context(env) {
        _classCallCheck(this, Context);

        this._env = env;
        this._numberFormatters = null;
      }

      Context.prototype._formatTuple = function _formatTuple(lang, args, entity, id, key) {
        try {
          return format(this, lang, args, entity);
        } catch (err) {
          err.id = key ? id + '::' + key : id;
          err.lang = lang;

          this._env.emit('resolveerror', err, this);

          return [{
            error: err
          }, err.id];
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

      Context.prototype.fetch = function fetch(langs) {
        if (langs.length === 0) {
          return Promise.resolve(langs);
        }

        var resIds = Array.from(this._env._resLists.get(this));
        return Promise.all(resIds.map(this._env._getResource.bind(this._env, langs[0]))).then(function () {
          return langs;
        });
      };

      Context.prototype._resolve = function _resolve(langs, keys, formatter, prevResolved) {
        var _this = this;

        var lang = langs[0];

        if (!lang) {
          return reportMissing.call(this, keys, formatter, prevResolved);
        }

        var hasUnresolved = false;
        var resolved = keys.map(function (key, i) {
          if (prevResolved && prevResolved[i] !== undefined) {
            return prevResolved[i];
          }

          var _ref5 = Array.isArray(key) ? key : [key, undefined];

          var id = _ref5[0];
          var args = _ref5[1];

          var entity = _this._getEntity(lang, id);

          if (entity) {
            return formatter.call(_this, lang, args, entity, id);
          }

          _this._env.emit('notfounderror', new L10nError('"' + id + '"' + ' not found in ' + lang.code, id, lang), _this);

          hasUnresolved = true;
        });

        if (!hasUnresolved) {
          return resolved;
        }

        return this.fetch(langs.slice(1)).then(function (nextLangs) {
          return _this._resolve(nextLangs, keys, formatter, resolved);
        });
      };

      Context.prototype.resolveEntities = function resolveEntities(langs, keys) {
        var _this2 = this;

        return this.fetch(langs).then(function (langs) {
          return _this2._resolve(langs, keys, _this2._formatEntity);
        });
      };

      Context.prototype.resolveValues = function resolveValues(langs, keys) {
        var _this3 = this;

        return this.fetch(langs).then(function (langs) {
          return _this3._resolve(langs, keys, _this3._formatValue);
        });
      };

      Context.prototype._getEntity = function _getEntity(lang, id) {
        var cache = this._env._resCache;
        var resIds = Array.from(this._env._resLists.get(this));

        for (var i = 0, resId = undefined; resId = resIds[i]; i++) {
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
        if (!this._numberFormatters) {
          this._numberFormatters = new Map();
        }

        if (!this._numberFormatters.has(lang)) {
          var formatter = Intl.NumberFormat(lang, {
            useGrouping: false
          });

          this._numberFormatters.set(lang, formatter);

          return formatter;
        }

        return this._numberFormatters.get(lang);
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
      var _this4 = this;

      var missingIds = new Set();
      keys.forEach(function (key, i) {
        if (resolved && resolved[i] !== undefined) {
          return;
        }

        var id = Array.isArray(key) ? key[0] : key;
        missingIds.add(id);
        resolved[i] = formatter === _this4._formatValue ? id : {
          value: id,
          attrs: null
        };
      });

      this._env.emit('notfounderror', new L10nError('"' + Array.from(missingIds).join(', ') + '"' + ' not found in any language', missingIds), this);

      return resolved;
    }

    return { Context: Context };
  });
  modules.set('lib/env', function () {
    var _getModule12 = getModule('lib/context');

    var Context = _getModule12.Context;

    var PropertiesParser = getModule('lib/format/properties/parser');
    var L20nParser = getModule('lib/format/l20n/entries/parser');

    var _getModule13 = getModule('lib/pseudo');

    var walkEntry = _getModule13.walkEntry;
    var pseudo = _getModule13.pseudo;

    var _getModule14 = getModule('lib/events');

    var emit = _getModule14.emit;
    var addEventListener = _getModule14.addEventListener;
    var removeEventListener = _getModule14.removeEventListener;

    var parsers = {
      properties: PropertiesParser,
      l20n: L20nParser
    };

    var Env = (function () {
      function Env(defaultLang, fetch) {
        _classCallCheck(this, Env);

        this.defaultLang = defaultLang;
        this.fetch = fetch;
        this._resLists = new Map();
        this._resCache = new Map();
        var listeners = {};
        this.emit = emit.bind(this, listeners);
        this.addEventListener = addEventListener.bind(this, listeners);
        this.removeEventListener = removeEventListener.bind(this, listeners);
      }

      Env.prototype.createContext = function createContext(resIds) {
        var ctx = new Context(this);

        this._resLists.set(ctx, new Set(resIds));

        return ctx;
      };

      Env.prototype.destroyContext = function destroyContext(ctx) {
        var _this5 = this;

        var lists = this._resLists;
        var resList = lists.get(ctx);
        lists.delete(ctx);
        resList.forEach(function (resId) {
          return deleteIfOrphan(_this5._resCache, lists, resId);
        });
      };

      Env.prototype._parse = function _parse(syntax, lang, data) {
        var _this6 = this;

        var parser = parsers[syntax];

        if (!parser) {
          return data;
        }

        var emit = function (type, err) {
          return _this6.emit(type, amendError(lang, err));
        };

        return parser.parse.call(parser, emit, data);
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
        var _this7 = this;

        var cache = this._resCache;
        var id = res + lang.code + lang.src;

        if (cache.has(id)) {
          return cache.get(id);
        }

        var syntax = res.substr(res.lastIndexOf('.') + 1);

        var saveEntries = function (data) {
          var entries = _this7._parse(syntax, lang, data);

          cache.set(id, _this7._create(lang, entries));
        };

        var recover = function (err) {
          err.lang = lang;
          _this7.emit('fetcherror', err);
          cache.set(id, err);
        };

        var langToFetch = lang.src === 'pseudo' ? {
          code: this.defaultLang,
          src: 'app'
        } : lang;
        var resource = this.fetch(res, langToFetch).then(saveEntries, recover);
        cache.set(id, resource);
        return resource;
      };

      return Env;
    })();

    function deleteIfOrphan(cache, lists, resId) {
      var isNeeded = Array.from(lists).some(function (_ref6) {
        var ctx = _ref6[0];
        var resIds = _ref6[1];
        return resIds.has(resId);
      });

      if (!isNeeded) {
        cache.forEach(function (val, key) {
          return key.startsWith(resId) ? cache.delete(key) : null;
        });
      }
    }

    function amendError(lang, err) {
      err.lang = lang;
      return err;
    }

    return { Env: Env, amendError: amendError };
  });
  modules.set('bindings/html/remote', function () {
    var _getModule15 = getModule('lib/env');

    var Env = _getModule15.Env;

    var _getModule16 = getModule('lib/pseudo');

    var pseudo = _getModule16.pseudo;

    var _getModule17 = getModule('bindings/html/shims');

    var documentReady = _getModule17.documentReady;

    var _getModule18 = getModule('bindings/html/langs');

    var getMeta = _getModule18.getMeta;
    var negotiateLanguages = _getModule18.negotiateLanguages;

    var Remote = (function () {
      function Remote(fetch, broadcast, requestedLangs) {
        var _this8 = this;

        _classCallCheck(this, Remote);

        this.fetch = fetch;
        this.broadcast = broadcast;
        this.ctxs = new Map();
        this.interactive = documentReady().then(function () {
          return _this8.init(requestedLangs);
        });
      }

      Remote.prototype.init = function init(requestedLangs) {
        var _this9 = this;

        var meta = getMeta(document.head);
        this.defaultLanguage = meta.defaultLang;
        this.availableLanguages = meta.availableLangs;
        this.appVersion = meta.appVersion;
        this.env = new Env(this.defaultLanguage, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _this9.fetch.apply(_this9, [_this9.appVersion].concat(args));
        });
        return this.requestLanguages(requestedLangs);
      };

      Remote.prototype.registerView = function registerView(view, resources) {
        var _this10 = this;

        return this.interactive.then(function () {
          _this10.ctxs.set(view, _this10.env.createContext(resources));
          return true;
        });
      };

      Remote.prototype.unregisterView = function unregisterView(view) {
        return this.ctxs.delete(view);
      };

      Remote.prototype.resolveEntities = function resolveEntities(view, langs, keys) {
        return this.ctxs.get(view).resolveEntities(langs, keys);
      };

      Remote.prototype.formatValues = function formatValues(view, keys) {
        var _this11 = this;

        return this.languages.then(function (langs) {
          return _this11.ctxs.get(view).resolveValues(langs, keys);
        });
      };

      Remote.prototype.resolvedLanguages = function resolvedLanguages() {
        return this.languages;
      };

      Remote.prototype.requestLanguages = function requestLanguages(requestedLangs) {
        return changeLanguages.call(this, getAdditionalLanguages(), requestedLangs);
      };

      Remote.prototype.getName = function getName(code) {
        return pseudo[code].name;
      };

      Remote.prototype.processString = function processString(code, str) {
        return pseudo[code].process(str);
      };

      Remote.prototype.handleEvent = function handleEvent(evt) {
        return changeLanguages.call(this, evt.detail || getAdditionalLanguages(), navigator.languages);
      };

      return Remote;
    })();

    function getAdditionalLanguages() {
      if (navigator.mozApps && navigator.mozApps.getAdditionalLanguages) {
        return navigator.mozApps.getAdditionalLanguages().catch(function () {
          return [];
        });
      }

      return Promise.resolve([]);
    }

    function changeLanguages(additionalLangs, requestedLangs) {
      var _this12 = this;

      var prevLangs = this.languages || [];
      return this.languages = Promise.all([additionalLangs, prevLangs]).then(function (_ref7) {
        var additionalLangs = _ref7[0];
        var prevLangs = _ref7[1];
        return negotiateLanguages(_this12.broadcast.bind(_this12, 'translateDocument'), _this12.appVersion, _this12.defaultLanguage, _this12.availableLanguages, additionalLangs, prevLangs, requestedLangs);
      });
    }

    return { Remote: Remote, getAdditionalLanguages: getAdditionalLanguages };
  });
  modules.set('bindings/html/overlay', function () {
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

        if (isAttrAllowed({
          name: attrName
        }, element)) {
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

    return { overlayElement: overlayElement };
  });
  modules.set('bindings/html/dom', function () {
    var _getModule19 = getModule('bindings/html/overlay');

    var overlayElement = _getModule19.overlayElement;

    var reHtml = /[&<>]/g;
    var htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    function getResourceLinks(head) {
      return Array.prototype.map.call(head.querySelectorAll('link[rel="localization"]'), function (el) {
        return decodeURI(el.getAttribute('href'));
      });
    }

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

    function translateMutations(view, langs, mutations) {
      var targets = new Set();

      for (var _iterator2 = mutations, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var mutation = _ref2;

        switch (mutation.type) {
          case 'attributes':
            targets.add(mutation.target);
            break;

          case 'childList':
            for (var _iterator3 = mutation.addedNodes, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
              } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
              }

              var addedNode = _ref3;

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

      translateElements(view, langs, Array.from(targets));
    }

    function translateFragment(view, langs, frag) {
      return translateElements(view, langs, getTranslatables(frag));
    }

    function getElementsTranslation(view, langs, elems) {
      var keys = elems.map(function (elem) {
        var id = elem.getAttribute('data-l10n-id');
        var args = elem.getAttribute('data-l10n-args');
        return args ? [id, JSON.parse(args.replace(reHtml, function (match) {
          return htmlEntities[match];
        }))] : id;
      });
      return view._resolveEntities(langs, keys);
    }

    function translateElements(view, langs, elements) {
      return getElementsTranslation(view, langs, elements).then(function (translations) {
        return applyTranslations(view, elements, translations);
      });
    }

    function applyTranslations(view, elems, translations) {
      view._disconnect();

      for (var i = 0; i < elems.length; i++) {
        overlayElement(elems[i], translations[i]);
      }

      view._observe();
    }

    return { getResourceLinks: getResourceLinks, setAttributes: setAttributes, getAttributes: getAttributes, translateMutations: translateMutations, translateFragment: translateFragment };
  });
  modules.set('bindings/html/shims', function () {
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

    return { documentReady: documentReady };
  });
  modules.set('bindings/html/view', function () {
    var _getModule20 = getModule('bindings/html/shims');

    var documentReady = _getModule20.documentReady;

    var _getModule21 = getModule('bindings/html/dom');

    var setAttributes = _getModule21.setAttributes;
    var getAttributes = _getModule21.getAttributes;
    var _translateFragment = _getModule21.translateFragment;
    var translateMutations = _getModule21.translateMutations;
    var getResourceLinks = _getModule21.getResourceLinks;

    var observerConfig = {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: ['data-l10n-id', 'data-l10n-args']
    };
    var readiness = new WeakMap();

    var View = (function () {
      function View(client, doc) {
        var _this13 = this;

        _classCallCheck(this, View);

        this._doc = doc;
        this.pseudo = {
          'qps-ploc': createPseudo(this, 'qps-ploc'),
          'qps-plocm': createPseudo(this, 'qps-plocm')
        };
        this._interactive = documentReady().then(function () {
          return init(_this13, client);
        });
        var observer = new MutationObserver(onMutations.bind(this));

        this._observe = function () {
          return observer.observe(doc, observerConfig);
        };

        this._disconnect = function () {
          return observer.disconnect();
        };

        var translateView = function (langs) {
          return translateDocument(_this13, langs);
        };

        client.on('translateDocument', translateView);
        this.ready = this.resolvedLanguages().then(translateView);
      }

      View.prototype.resolvedLanguages = function resolvedLanguages() {
        return this._interactive.then(function (client) {
          return client.method('resolvedLanguages');
        });
      };

      View.prototype.requestLanguages = function requestLanguages(langs) {
        return this._interactive.then(function (client) {
          return client.method('requestLanguages', langs);
        });
      };

      View.prototype._resolveEntities = function _resolveEntities(langs, keys) {
        return this._interactive.then(function (client) {
          return client.method('resolveEntities', client.id, langs, keys);
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
        for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          keys[_key2] = arguments[_key2];
        }

        return this._interactive.then(function (client) {
          return client.method('formatValues', client.id, keys);
        });
      };

      View.prototype.translateFragment = function translateFragment(frag) {
        var _this14 = this;

        return this.resolvedLanguages().then(function (langs) {
          return _translateFragment(_this14, langs, frag);
        });
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
      view._observe();

      return client.method('registerView', client.id, getResourceLinks(view._doc.head)).then(function () {
        return client;
      });
    }

    function onMutations(mutations) {
      var _this15 = this;

      return this.resolvedLanguages().then(function (langs) {
        return translateMutations(_this15, langs, mutations);
      });
    }

    function translateDocument(view, langs) {
      var html = view._doc.documentElement;

      if (readiness.has(html)) {
        return _translateFragment(view, langs, html).then(function () {
          return setDOMAttrsAndEmit(html, langs);
        }).then(function () {
          return langs.map(takeCode);
        });
      }

      var translated = langs[0].code === html.getAttribute('lang') ? Promise.resolve() : _translateFragment(view, langs, html).then(function () {
        return setDOMAttrs(html, langs);
      });
      return translated.then(function () {
        return readiness.set(html, true);
      }).then(function () {
        return langs.map(takeCode);
      });
    }

    function setDOMAttrsAndEmit(html, langs) {
      setDOMAttrs(html, langs);
      html.parentNode.dispatchEvent(new CustomEvent('DOMRetranslated', {
        bubbles: false,
        cancelable: false,
        detail: {
          languages: langs.map(takeCode)
        }
      }));
    }

    function setDOMAttrs(html, langs) {
      html.setAttribute('lang', langs[0].code);
      html.setAttribute('dir', langs[0].dir);
    }

    function takeCode(lang) {
      return lang.code;
    }

    return { View: View, translateDocument: translateDocument };
  });
  modules.set('lib/events', function () {
    function emit(listeners) {
      var _this16 = this;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var type = args.shift();

      if (listeners['*']) {
        listeners['*'].slice().forEach(function (listener) {
          return listener.apply(_this16, args);
        });
      }

      if (listeners[type]) {
        listeners[type].slice().forEach(function (listener) {
          return listener.apply(_this16, args);
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

    return { emit: emit, addEventListener: addEventListener, removeEventListener: removeEventListener };
  });
  modules.set('runtime/web/bridge', function () {
    var _getModule22 = getModule('lib/events');

    var emit = _getModule22.emit;
    var addEventListener = _getModule22.addEventListener;

    var Client = (function () {
      function Client(remote) {
        _classCallCheck(this, Client);

        this.id = this;
        this.remote = remote;
        var listeners = {};

        this.on = function () {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return addEventListener.apply(undefined, [listeners].concat(args));
        };

        this.emit = function () {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return emit.apply(undefined, [listeners].concat(args));
        };
      }

      Client.prototype.method = function method(name) {
        var _remote;

        for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
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

    return { Client: Client, broadcast: broadcast };
  });
  modules.set('lib/errors', function () {
    function L10nError(message, id, lang) {
      this.name = 'L10nError';
      this.message = message;
      this.id = id;
      this.lang = lang;
    }

    L10nError.prototype = Object.create(Error.prototype);
    L10nError.prototype.constructor = L10nError;
    return { L10nError: L10nError };
  });
  modules.set('runtime/web/io', function () {
    var _getModule23 = getModule('lib/errors');

    var L10nError = _getModule23.L10nError;

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

        xhr.addEventListener('load', function io_onload(e) {
          if (e.target.status === 200 || e.target.status === 0) {
            resolve(e.target.response || e.target.responseText);
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

    function fetch(ver, res, lang) {
      var url = res.replace('{locale}', lang.code);
      var type = res.endsWith('.json') ? 'json' : 'text';
      return io[lang.src](lang.code, ver, url, type);
    }

    return { fetch: fetch };
  });
  modules.set('runtime/tooling/index', function () {
    var _getModule24 = getModule('runtime/web/io');

    var fetch = _getModule24.fetch;

    var _getModule25 = getModule('runtime/web/bridge');

    var Client = _getModule25.Client;
    var broadcast = _getModule25.broadcast;

    var _getModule26 = getModule('bindings/html/view');

    var View = _getModule26.View;

    var _getModule27 = getModule('bindings/html/remote');

    var Remote = _getModule27.Remote;

    var ASTParser = getModule('lib/format/l20n/ast/parser');
    var ASTSerializer = getModule('lib/format/l20n/ast/serializer');
    var EntriesParser = getModule('lib/format/l20n/entries/parser');
    var EntriesSerializer = getModule('lib/format/l20n/entries/serializer');
    var PropertiesParser = getModule('lib/format/properties/parser');

    var _getModule28 = getModule('lib/context');

    var Context = _getModule28.Context;

    var _getModule29 = getModule('lib/env');

    var Env = _getModule29.Env;

    var _getModule30 = getModule('lib/errors');

    var L10nError = _getModule30.L10nError;

    var _getModule31 = getModule('lib/events');

    var emit = _getModule31.emit;
    var addEventListener = _getModule31.addEventListener;
    var removeEventListener = _getModule31.removeEventListener;

    var _getModule32 = getModule('lib/intl');

    var prioritizeLocales = _getModule32.prioritizeLocales;

    var _getModule33 = getModule('lib/mocks');

    var MockContext = _getModule33.MockContext;
    var lang = _getModule33.lang;

    var _getModule34 = getModule('lib/plurals');

    var getPluralRule = _getModule34.getPluralRule;

    var _getModule35 = getModule('lib/pseudo');

    var walkEntry = _getModule35.walkEntry;
    var walkValue = _getModule35.walkValue;
    var pseudo = _getModule35.pseudo;

    var _getModule36 = getModule('lib/resolver');

    var format = _getModule36.format;

    window.L20n = {
      fetch: fetch, Client: Client, Remote: Remote, View: View, broadcast: broadcast,
      ASTParser: ASTParser, ASTSerializer: ASTSerializer, EntriesParser: EntriesParser, EntriesSerializer: EntriesSerializer, PropertiesParser: PropertiesParser,
      Context: Context, Env: Env, L10nError: L10nError, emit: emit, addEventListener: addEventListener, removeEventListener: removeEventListener,
      prioritizeLocales: prioritizeLocales, MockContext: MockContext, lang: lang, getPluralRule: getPluralRule, walkEntry: walkEntry, walkValue: walkValue,
      pseudo: pseudo, format: format
    };
  });
  getModule('runtime/tooling/index');
})(undefined);