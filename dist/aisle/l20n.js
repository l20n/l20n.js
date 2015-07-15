define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

	var _libFormatL20nAstParser = __webpack_require__(1);

	exports.L20nParser = _interopRequire(_libFormatL20nAstParser);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _ast = __webpack_require__(2);

	var _ast2 = _interopRequireDefault(_ast);

	var _errors = __webpack_require__(3);

	var MAX_PLACEABLES = 100;

	exports.default = {
	  parse: function (env, string) {
	    var pos = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    this._source = string;
	    this._index = 0;
	    this._length = string.length;
	    this._curEntryStart = 0;
	    this._config = {
	      pos: pos
	    };

	    if (pos !== true) {
	      _ast2.default.Node.prototype.setPosition = function () {};
	    }
	    return this.getResource(pos);
	  },

	  getResource: function () {
	    var resource = new _ast2.default.Resource();
	    resource.setPosition(0, this._length);
	    resource._errors = [];

	    this.getWS();
	    while (this._index < this._length) {
	      try {
	        resource.body.push(this.getEntry());
	      } catch (e) {
	        if (e instanceof _errors.L10nError) {
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
	  },

	  getEntry: function () {
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
	  },

	  getEntity: function (id, index) {
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

	    var entity = new _ast2.default.Entity(id, value, index, attrs);
	    entity.setPosition(this._curEntryStart, this._index);
	    return entity;
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
	    return null;
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

	    var id = new _ast2.default.Identifier(this._source.slice(start, this._index));
	    id.setPosition(start, this._index);
	    return id;
	  },

	  getUnicodeChar: function () {
	    for (var i = 0; i < 4; i++) {
	      var cc = this._source.charCodeAt(++this._index);
	      if (cc > 96 && cc < 103 || cc > 64 && cc < 71 || cc > 47 && cc < 58) {
	        continue;
	      }
	      throw this.error('Illegal unicode escape sequence');
	    }
	    return '\\u' + this._source.slice(this._index - 3, this._index + 1);
	  },

	  getString: function (opchar, opcharLen) {
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

	    var string = new _ast2.default.String(this._source.slice(start, this._index - 1), body);
	    string.setPosition(start, this._index);
	    string._opchar = opchar;

	    return string;
	  },

	  getAttributes: function () {
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
	  },

	  getAttribute: function () {
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
	    var attr = new _ast2.default.Attribute(key, this.getValue(), index);
	    attr.setPosition(start, this._index);
	    return attr;
	  },

	  getHash: function () {
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

	    var hash = new _ast2.default.Hash(items);
	    hash.setPosition(start, this._index);
	    return hash;
	  },

	  getHashItem: function () {
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

	    var hashItem = new _ast2.default.HashItem(key, this.getValue(), defItem);
	    hashItem.setPosition(start, this._index);
	    return hashItem;
	  },

	  getComment: function () {
	    this._index += 2;
	    var start = this._index;
	    var end = this._source.indexOf('*/', start);

	    if (end === -1) {
	      throw this.error('Comment without a closing tag');
	    }

	    this._index = end + 2;
	    var comment = new _ast2.default.Comment(this._source.slice(start, end));
	    comment.setPosition(start - 2, this._index);
	    return comment;
	  },

	  getExpression: function () {
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
	  },

	  getPropertyExpression: function (idref, computed, start) {
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

	    var propExpr = new _ast2.default.PropertyExpression(idref, exp, computed);
	    propExpr.setPosition(start, this._index);
	    return propExpr;
	  },

	  getCallExpression: function (callee, start) {
	    this.getWS();

	    var callExpr = new _ast2.default.CallExpression(callee, this.getItemList(this.getExpression, ')'));
	    callExpr.setPosition(start, this._index);
	    return callExpr;
	  },

	  getPrimaryExpression: function () {
	    var start = this._index;
	    var ch = this._source[this._index];

	    switch (ch) {
	      case '$':
	        ++this._index;
	        var variable = new _ast2.default.Variable(this.getIdentifier());
	        variable.setPosition(start, this._index);
	        return variable;
	      case '@':
	        ++this._index;
	        var global = new _ast2.default.Global(this.getIdentifier());
	        global.setPosition(start, this._index);
	        return global;
	      default:
	        return this.getIdentifier();
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

	  error: function (message) {
	    var pos = this._index;

	    var start = this._source.lastIndexOf('<', pos - 1);
	    var lastClose = this._source.lastIndexOf('>', pos - 1);
	    start = lastClose > start ? lastClose + 1 : start;
	    var context = this._source.slice(start, pos + 10);

	    var msg = message + ' at pos ' + pos + ': `' + context + '`';

	    var err = new _errors.L10nError(msg);
	    err._pos = { start: pos, end: undefined };
	    err.offset = pos - start;
	    err.description = message;
	    err.context = context;
	    return err;
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

	    var junk = new _ast2.default.JunkEntry(this._source.slice(this._curEntryStart, nextEntry));
	    if (this._config.pos) {
	      junk._pos = { start: this._curEntryStart, end: nextEntry };
	    }
	    return junk;
	  }
	};
	module.exports = exports.default;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Node = (function () {
	  function Node() {
	    _classCallCheck(this, Node);

	    this.type = this.constructor.name;
	  }

	  _createClass(Node, [{
	    key: 'setPosition',
	    value: function setPosition(start, end) {
	      this._pos = { start: start, end: end };
	    }
	  }]);

	  return Node;
	})();

	var Entry = (function (_Node) {
	  _inherits(Entry, _Node);

	  function Entry() {
	    _classCallCheck(this, Entry);

	    _get(Object.getPrototypeOf(Entry.prototype), 'constructor', this).call(this);
	  }

	  return Entry;
	})(Node);

	var Identifier = (function (_Node2) {
	  _inherits(Identifier, _Node2);

	  function Identifier(name) {
	    _classCallCheck(this, Identifier);

	    _get(Object.getPrototypeOf(Identifier.prototype), 'constructor', this).call(this);
	    this.name = name;
	  }

	  return Identifier;
	})(Node);

	var Variable = (function (_Node3) {
	  _inherits(Variable, _Node3);

	  function Variable(name) {
	    _classCallCheck(this, Variable);

	    _get(Object.getPrototypeOf(Variable.prototype), 'constructor', this).call(this);
	    this.name = name;
	  }

	  return Variable;
	})(Node);

	var Global = (function (_Node4) {
	  _inherits(Global, _Node4);

	  function Global(name) {
	    _classCallCheck(this, Global);

	    _get(Object.getPrototypeOf(Global.prototype), 'constructor', this).call(this);
	    this.name = name;
	  }

	  return Global;
	})(Node);

	var Value = (function (_Node5) {
	  _inherits(Value, _Node5);

	  function Value() {
	    _classCallCheck(this, Value);

	    _get(Object.getPrototypeOf(Value.prototype), 'constructor', this).call(this);
	  }

	  return Value;
	})(Node);

	var String = (function (_Value) {
	  _inherits(String, _Value);

	  function String(source, content) {
	    _classCallCheck(this, String);

	    _get(Object.getPrototypeOf(String.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(Hash.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(Entity.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(Resource.prototype), 'constructor', this).call(this);
	    this.body = [];
	  }

	  return Resource;
	})(Node);

	var Attribute = (function (_Node7) {
	  _inherits(Attribute, _Node7);

	  function Attribute(id, value) {
	    var index = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

	    _classCallCheck(this, Attribute);

	    _get(Object.getPrototypeOf(Attribute.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(HashItem.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(Comment.prototype), 'constructor', this).call(this);
	    this.body = body;
	  }

	  return Comment;
	})(Entry);

	var Expression = (function (_Node9) {
	  _inherits(Expression, _Node9);

	  function Expression() {
	    _classCallCheck(this, Expression);

	    _get(Object.getPrototypeOf(Expression.prototype), 'constructor', this).call(this);
	  }

	  return Expression;
	})(Node);

	var PropertyExpression = (function (_Expression) {
	  _inherits(PropertyExpression, _Expression);

	  function PropertyExpression(idref, exp) {
	    var computed = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    _classCallCheck(this, PropertyExpression);

	    _get(Object.getPrototypeOf(PropertyExpression.prototype), 'constructor', this).call(this);
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

	    _get(Object.getPrototypeOf(CallExpression.prototype), 'constructor', this).call(this);
	    this.callee = callee;
	    this.args = args;
	  }

	  return CallExpression;
	})(Expression);

	var JunkEntry = (function (_Entry3) {
	  _inherits(JunkEntry, _Entry3);

	  function JunkEntry(content) {
	    _classCallCheck(this, JunkEntry);

	    _get(Object.getPrototypeOf(JunkEntry.prototype), 'constructor', this).call(this);
	    this.content = content;
	  }

	  return JunkEntry;
	})(Entry);

	exports.default = {
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
	module.exports = exports.default;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.L10nError = L10nError;

	function L10nError(message, id, lang) {
	  this.name = 'L10nError';
	  this.message = message;
	  this.id = id;
	  this.lang = lang;
	}

	L10nError.prototype = Object.create(Error.prototype);
	L10nError.prototype.constructor = L10nError;

/***/ }
/******/ ])});;