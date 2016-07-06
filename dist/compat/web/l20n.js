'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

{
  (function () {

    // utility functions for plural rules methods

    var isIn = function isIn(n, list) {
      return list.indexOf(n) !== -1;
    };

    var isBetween = function isBetween(n, start, end) {
      return (typeof n === 'undefined' ? 'undefined' : _typeof(n)) === (typeof start === 'undefined' ? 'undefined' : _typeof(start)) && start <= n && n <= end;
    };

    // list of all plural rules methods:
    // map an integer to the plural form name to use


    var getPluralRule = function getPluralRule(code) {
      // return a function that gives the plural form name for a given integer
      var index = locales2rules[code.replace(/-.*$/, '')];
      if (!(index in pluralRules)) {
        return function () {
          return 'other';
        };
      }
      return pluralRules[index];
    };

    var ask = function ask() {
      return new ReadWrite(function (ctx) {
        return [ctx, []];
      });
    };

    var tell = function tell(log) {
      return new ReadWrite(function () {
        return [null, [log]];
      });
    };

    var unit = function unit(val) {
      return new ReadWrite(function () {
        return [val, []];
      });
    };

    var resolve = function resolve(iter) {
      return function step(resume) {
        var _iter$next = iter.next(resume);

        var value = _iter$next.value;
        var done = _iter$next.done;

        var rw = value instanceof ReadWrite ? value : unit(value);
        return done ? rw : rw.flatMap(step);
      }();
    };

    var merge = function merge(argopts, opts) {
      return Object.assign({}, argopts, valuesOf(opts));
    };

    var valuesOf = function valuesOf(opts) {
      return Object.keys(opts).reduce(function (seq, cur) {
        var _Object$assign;

        return Object.assign({}, seq, (_Object$assign = {}, _Object$assign[cur] = opts[cur].valueOf(), _Object$assign));
      }, {});
    };

    // Unicode bidi isolation characters


    var mapValues = regeneratorRuntime.mark(function mapValues(arr) {
      var values, _iterator, _isArray, _i, _ref7, elem;

      return regeneratorRuntime.wrap(function mapValues$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              values = new FTLList();
              _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

            case 2:
              if (!_isArray) {
                _context.next = 8;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt('break', 19);

            case 5:
              _ref7 = _iterator[_i++];
              _context.next = 12;
              break;

            case 8:
              _i = _iterator.next();

              if (!_i.done) {
                _context.next = 11;
                break;
              }

              return _context.abrupt('break', 19);

            case 11:
              _ref7 = _i.value;

            case 12:
              elem = _ref7;
              _context.t0 = values;
              return _context.delegateYield(Value(elem), 't1', 15);

            case 15:
              _context.t2 = _context.t1;

              _context.t0.push.call(_context.t0, _context.t2);

            case 17:
              _context.next = 2;
              break;

            case 19:
              return _context.abrupt('return', values);

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, mapValues, this);
    });

    // Helper for choosing entity value

    var DefaultMember = regeneratorRuntime.mark(function DefaultMember(members) {
      var allowNoDefault = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var _iterator2, _isArray2, _i2, _ref8, member;

      return regeneratorRuntime.wrap(function DefaultMember$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iterator2 = members, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();

            case 1:
              if (!_isArray2) {
                _context2.next = 7;
                break;
              }

              if (!(_i2 >= _iterator2.length)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('break', 16);

            case 4:
              _ref8 = _iterator2[_i2++];
              _context2.next = 11;
              break;

            case 7:
              _i2 = _iterator2.next();

              if (!_i2.done) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt('break', 16);

            case 10:
              _ref8 = _i2.value;

            case 11:
              member = _ref8;

              if (!member.def) {
                _context2.next = 14;
                break;
              }

              return _context2.abrupt('return', member);

            case 14:
              _context2.next = 1;
              break;

            case 16:
              if (allowNoDefault) {
                _context2.next = 19;
                break;
              }

              _context2.next = 19;
              return tell(new RangeError('No default'));

            case 19:
              return _context2.abrupt('return', { val: new FTLNone() });

            case 20:
            case 'end':
              return _context2.stop();
          }
        }
      }, DefaultMember, this);
    });

    // Half-resolved expressions evaluate to raw Runtime AST nodes

    var EntityReference = regeneratorRuntime.mark(function EntityReference(_ref9) {
      var name = _ref9.name;

      var _ref10, ctx, entity;

      return regeneratorRuntime.wrap(function EntityReference$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return ask();

            case 2:
              _ref10 = _context3.sent;
              ctx = _ref10.ctx;
              entity = ctx.messages.get(name);

              if (entity) {
                _context3.next = 9;
                break;
              }

              _context3.next = 8;
              return tell(new ReferenceError('Unknown entity: ' + name));

            case 8:
              return _context3.abrupt('return', new FTLNone(name));

            case 9:
              return _context3.abrupt('return', entity);

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, EntityReference, this);
    });
    var MemberExpression = regeneratorRuntime.mark(function MemberExpression(_ref11) {
      var obj = _ref11.obj;
      var key = _ref11.key;

      var entity, _ref12, ctx, keyword, _iterator3, _isArray3, _i3, _ref13, member, memberKey;

      return regeneratorRuntime.wrap(function MemberExpression$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.delegateYield(EntityReference(obj), 't0', 1);

            case 1:
              entity = _context4.t0;

              if (!(entity instanceof FTLNone)) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt('return', { val: entity });

            case 4:
              _context4.next = 6;
              return ask();

            case 6:
              _ref12 = _context4.sent;
              ctx = _ref12.ctx;
              return _context4.delegateYield(Value(key), 't1', 9);

            case 9:
              keyword = _context4.t1;
              _iterator3 = entity.traits, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();

            case 11:
              if (!_isArray3) {
                _context4.next = 17;
                break;
              }

              if (!(_i3 >= _iterator3.length)) {
                _context4.next = 14;
                break;
              }

              return _context4.abrupt('break', 28);

            case 14:
              _ref13 = _iterator3[_i3++];
              _context4.next = 21;
              break;

            case 17:
              _i3 = _iterator3.next();

              if (!_i3.done) {
                _context4.next = 20;
                break;
              }

              return _context4.abrupt('break', 28);

            case 20:
              _ref13 = _i3.value;

            case 21:
              member = _ref13;
              return _context4.delegateYield(Value(member.key), 't2', 23);

            case 23:
              memberKey = _context4.t2;

              if (!keyword.match(ctx, memberKey)) {
                _context4.next = 26;
                break;
              }

              return _context4.abrupt('return', member);

            case 26:
              _context4.next = 11;
              break;

            case 28:
              _context4.next = 30;
              return tell(new ReferenceError('Unknown trait: ' + keyword.toString(ctx)));

            case 30:
              return _context4.delegateYield(Entity(entity), 't3', 31);

            case 31:
              _context4.t4 = _context4.t3;
              return _context4.abrupt('return', {
                val: _context4.t4
              });

            case 33:
            case 'end':
              return _context4.stop();
          }
        }
      }, MemberExpression, this);
    });
    var SelectExpression = regeneratorRuntime.mark(function SelectExpression(_ref14) {
      var exp = _ref14.exp;
      var vars = _ref14.vars;

      var selector, _iterator4, _isArray4, _i4, _ref15, variant, key, _ref16, _ctx;

      return regeneratorRuntime.wrap(function SelectExpression$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.delegateYield(Value(exp), 't0', 1);

            case 1:
              selector = _context5.t0;

              if (!(selector instanceof FTLNone)) {
                _context5.next = 5;
                break;
              }

              return _context5.delegateYield(DefaultMember(vars), 't1', 4);

            case 4:
              return _context5.abrupt('return', _context5.t1);

            case 5:
              _iterator4 = vars, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();

            case 6:
              if (!_isArray4) {
                _context5.next = 12;
                break;
              }

              if (!(_i4 >= _iterator4.length)) {
                _context5.next = 9;
                break;
              }

              return _context5.abrupt('break', 29);

            case 9:
              _ref15 = _iterator4[_i4++];
              _context5.next = 16;
              break;

            case 12:
              _i4 = _iterator4.next();

              if (!_i4.done) {
                _context5.next = 15;
                break;
              }

              return _context5.abrupt('break', 29);

            case 15:
              _ref15 = _i4.value;

            case 16:
              variant = _ref15;
              return _context5.delegateYield(Value(variant.key), 't2', 18);

            case 18:
              key = _context5.t2;

              if (!(key instanceof FTLNumber && selector instanceof FTLNumber && key.valueOf() === selector.valueOf())) {
                _context5.next = 21;
                break;
              }

              return _context5.abrupt('return', variant);

            case 21:
              _context5.next = 23;
              return ask();

            case 23:
              _ref16 = _context5.sent;
              _ctx = _ref16.ctx;

              if (!(key instanceof FTLKeyword && key.match(_ctx, selector))) {
                _context5.next = 27;
                break;
              }

              return _context5.abrupt('return', variant);

            case 27:
              _context5.next = 6;
              break;

            case 29:
              return _context5.delegateYield(DefaultMember(vars), 't3', 30);

            case 30:
              return _context5.abrupt('return', _context5.t3);

            case 31:
            case 'end':
              return _context5.stop();
          }
        }
      }, SelectExpression, this);
    });

    // Fully-resolved expressions evaluate to FTL types

    var Value = regeneratorRuntime.mark(function Value(expr) {
      var ref, mem, sel;
      return regeneratorRuntime.wrap(function Value$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(typeof expr === 'string' || expr instanceof FTLNone)) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt('return', expr);

            case 2:
              if (!Array.isArray(expr)) {
                _context6.next = 5;
                break;
              }

              return _context6.delegateYield(Pattern(expr), 't0', 4);

            case 4:
              return _context6.abrupt('return', _context6.t0);

            case 5:
              _context6.t1 = expr.type;
              _context6.next = _context6.t1 === 'kw' ? 8 : _context6.t1 === 'num' ? 9 : _context6.t1 === 'ext' ? 10 : _context6.t1 === 'fun' ? 12 : _context6.t1 === 'call' ? 14 : _context6.t1 === 'ref' ? 16 : _context6.t1 === 'mem' ? 20 : _context6.t1 === 'sel' ? 24 : 28;
              break;

            case 8:
              return _context6.abrupt('return', new FTLKeyword(expr));

            case 9:
              return _context6.abrupt('return', new FTLNumber(expr.val));

            case 10:
              return _context6.delegateYield(ExternalArgument(expr), 't2', 11);

            case 11:
              return _context6.abrupt('return', _context6.t2);

            case 12:
              return _context6.delegateYield(FunctionReference(expr), 't3', 13);

            case 13:
              return _context6.abrupt('return', _context6.t3);

            case 14:
              return _context6.delegateYield(CallExpression(expr), 't4', 15);

            case 15:
              return _context6.abrupt('return', _context6.t4);

            case 16:
              return _context6.delegateYield(EntityReference(expr), 't5', 17);

            case 17:
              ref = _context6.t5;
              return _context6.delegateYield(Entity(ref), 't6', 19);

            case 19:
              return _context6.abrupt('return', _context6.t6);

            case 20:
              return _context6.delegateYield(MemberExpression(expr), 't7', 21);

            case 21:
              mem = _context6.t7;
              return _context6.delegateYield(Value(mem.val), 't8', 23);

            case 23:
              return _context6.abrupt('return', _context6.t8);

            case 24:
              return _context6.delegateYield(SelectExpression(expr), 't9', 25);

            case 25:
              sel = _context6.t9;
              return _context6.delegateYield(Value(sel.val), 't10', 27);

            case 27:
              return _context6.abrupt('return', _context6.t10);

            case 28:
              return _context6.delegateYield(Value(expr.val), 't11', 29);

            case 29:
              return _context6.abrupt('return', _context6.t11);

            case 30:
            case 'end':
              return _context6.stop();
          }
        }
      }, Value, this);
    });
    var ExternalArgument = regeneratorRuntime.mark(function ExternalArgument(_ref17) {
      var name = _ref17.name;

      var _ref18, args, arg;

      return regeneratorRuntime.wrap(function ExternalArgument$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return ask();

            case 2:
              _ref18 = _context7.sent;
              args = _ref18.args;

              if (!(!args || !args.hasOwnProperty(name))) {
                _context7.next = 8;
                break;
              }

              _context7.next = 7;
              return tell(new ReferenceError('Unknown external: ' + name));

            case 7:
              return _context7.abrupt('return', new FTLNone(name));

            case 8:
              arg = args[name];

              if (!(arg instanceof FTLBase)) {
                _context7.next = 11;
                break;
              }

              return _context7.abrupt('return', arg);

            case 11:
              _context7.t0 = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
              _context7.next = _context7.t0 === 'string' ? 14 : _context7.t0 === 'number' ? 15 : _context7.t0 === 'object' ? 16 : 21;
              break;

            case 14:
              return _context7.abrupt('return', arg);

            case 15:
              return _context7.abrupt('return', new FTLNumber(arg));

            case 16:
              if (!Array.isArray(arg)) {
                _context7.next = 19;
                break;
              }

              return _context7.delegateYield(mapValues(arg), 't1', 18);

            case 18:
              return _context7.abrupt('return', _context7.t1);

            case 19:
              if (!(arg instanceof Date)) {
                _context7.next = 21;
                break;
              }

              return _context7.abrupt('return', new FTLDateTime(arg));

            case 21:
              _context7.next = 23;
              return tell(new TypeError('Unsupported external type: ' + name + ', ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg))));

            case 23:
              return _context7.abrupt('return', new FTLNone(name));

            case 24:
            case 'end':
              return _context7.stop();
          }
        }
      }, ExternalArgument, this);
    });
    var FunctionReference = regeneratorRuntime.mark(function FunctionReference(_ref19) {
      var name = _ref19.name;

      var _ref20, functions, func;

      return regeneratorRuntime.wrap(function FunctionReference$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return ask();

            case 2:
              _ref20 = _context8.sent;
              functions = _ref20.ctx.functions;
              func = functions[name] || builtins[name];

              if (func) {
                _context8.next = 9;
                break;
              }

              _context8.next = 8;
              return tell(new ReferenceError('Unknown built-in: ' + name + '()'));

            case 8:
              return _context8.abrupt('return', new FTLNone(name + '()'));

            case 9:
              if (func instanceof Function) {
                _context8.next = 13;
                break;
              }

              _context8.next = 12;
              return tell(new TypeError('Function ' + name + '() is not callable'));

            case 12:
              return _context8.abrupt('return', new FTLNone(name + '()'));

            case 13:
              return _context8.abrupt('return', func);

            case 14:
            case 'end':
              return _context8.stop();
          }
        }
      }, FunctionReference, this);
    });
    var CallExpression = regeneratorRuntime.mark(function CallExpression(_ref21) {
      var name = _ref21.name;
      var args = _ref21.args;

      var callee, posargs, keyargs, _iterator5, _isArray5, _i5, _ref22, _arg;

      return regeneratorRuntime.wrap(function CallExpression$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.delegateYield(FunctionReference(name), 't0', 1);

            case 1:
              callee = _context9.t0;

              if (!(callee instanceof FTLNone)) {
                _context9.next = 4;
                break;
              }

              return _context9.abrupt('return', callee);

            case 4:
              posargs = [];
              keyargs = [];
              _iterator5 = args, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();

            case 7:
              if (!_isArray5) {
                _context9.next = 13;
                break;
              }

              if (!(_i5 >= _iterator5.length)) {
                _context9.next = 10;
                break;
              }

              return _context9.abrupt('break', 29);

            case 10:
              _ref22 = _iterator5[_i5++];
              _context9.next = 17;
              break;

            case 13:
              _i5 = _iterator5.next();

              if (!_i5.done) {
                _context9.next = 16;
                break;
              }

              return _context9.abrupt('break', 29);

            case 16:
              _ref22 = _i5.value;

            case 17:
              _arg = _ref22;

              if (!(_arg.type === 'kv')) {
                _context9.next = 23;
                break;
              }

              return _context9.delegateYield(Value(_arg.val), 't1', 20);

            case 20:
              keyargs[_arg.name] = _context9.t1;
              _context9.next = 27;
              break;

            case 23:
              _context9.t2 = posargs;
              return _context9.delegateYield(Value(_arg), 't3', 25);

            case 25:
              _context9.t4 = _context9.t3;

              _context9.t2.push.call(_context9.t2, _context9.t4);

            case 27:
              _context9.next = 7;
              break;

            case 29:
              return _context9.abrupt('return', callee(posargs, keyargs));

            case 30:
            case 'end':
              return _context9.stop();
          }
        }
      }, CallExpression, this);
    });
    var Pattern = regeneratorRuntime.mark(function Pattern(ptn) {
      var _ref23, ctx, dirty, result, _iterator6, _isArray6, _i6, _ref24, part, value, str;

      return regeneratorRuntime.wrap(function Pattern$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return ask();

            case 2:
              _ref23 = _context10.sent;
              ctx = _ref23.ctx;
              dirty = _ref23.dirty;

              if (!dirty.has(ptn)) {
                _context10.next = 9;
                break;
              }

              _context10.next = 8;
              return tell(new RangeError('Cyclic reference'));

            case 8:
              return _context10.abrupt('return', new FTLNone());

            case 9:

              dirty.add(ptn);
              result = '';
              _iterator6 = ptn, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();

            case 12:
              if (!_isArray6) {
                _context10.next = 18;
                break;
              }

              if (!(_i6 >= _iterator6.length)) {
                _context10.next = 15;
                break;
              }

              return _context10.abrupt('break', 45);

            case 15:
              _ref24 = _iterator6[_i6++];
              _context10.next = 22;
              break;

            case 18:
              _i6 = _iterator6.next();

              if (!_i6.done) {
                _context10.next = 21;
                break;
              }

              return _context10.abrupt('break', 45);

            case 21:
              _ref24 = _i6.value;

            case 22:
              part = _ref24;

              if (!(typeof part === 'string')) {
                _context10.next = 27;
                break;
              }

              result += part;
              _context10.next = 43;
              break;

            case 27:
              if (!(part.length === 1)) {
                _context10.next = 32;
                break;
              }

              return _context10.delegateYield(Value(part[0]), 't1', 29);

            case 29:
              _context10.t0 = _context10.t1;
              _context10.next = 34;
              break;

            case 32:
              return _context10.delegateYield(mapValues(part), 't2', 33);

            case 33:
              _context10.t0 = _context10.t2;

            case 34:
              value = _context10.t0;
              str = value.toString(ctx);

              if (!(str.length > MAX_PLACEABLE_LENGTH)) {
                _context10.next = 42;
                break;
              }

              _context10.next = 39;
              return tell(new RangeError('Too many characters in placeable ' + ('(' + str.length + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')')));

            case 39:
              result += FSI + str.substr(0, MAX_PLACEABLE_LENGTH) + PDI;
              _context10.next = 43;
              break;

            case 42:
              result += FSI + str + PDI;

            case 43:
              _context10.next = 12;
              break;

            case 45:

              dirty.delete(ptn);
              return _context10.abrupt('return', result);

            case 47:
            case 'end':
              return _context10.stop();
          }
        }
      }, Pattern, this);
    });
    var Entity = regeneratorRuntime.mark(function Entity(entity) {
      var allowNoDefault = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var def;
      return regeneratorRuntime.wrap(function Entity$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!(entity.val !== undefined)) {
                _context11.next = 3;
                break;
              }

              return _context11.delegateYield(Value(entity.val), 't0', 2);

            case 2:
              return _context11.abrupt('return', _context11.t0);

            case 3:
              if (entity.traits) {
                _context11.next = 6;
                break;
              }

              return _context11.delegateYield(Value(entity), 't1', 5);

            case 5:
              return _context11.abrupt('return', _context11.t1);

            case 6:
              return _context11.delegateYield(DefaultMember(entity.traits, allowNoDefault), 't2', 7);

            case 7:
              def = _context11.t2;
              return _context11.delegateYield(Value(def), 't3', 9);

            case 9:
              return _context11.abrupt('return', _context11.t3);

            case 10:
            case 'end':
              return _context11.stop();
          }
        }
      }, Entity, this);
    });

    // evaluate `entity` to an FTL Value type: string or FTLNone

    var toFTLType = regeneratorRuntime.mark(function toFTLType(entity, opts) {
      return regeneratorRuntime.wrap(function toFTLType$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              if (!(entity === undefined)) {
                _context12.next = 2;
                break;
              }

              return _context12.abrupt('return', new FTLNone());

            case 2:
              return _context12.delegateYield(Entity(entity, opts.allowNoDefault), 't0', 3);

            case 3:
              return _context12.abrupt('return', _context12.t0);

            case 4:
            case 'end':
              return _context12.stop();
          }
        }
      }, toFTLType, this);
    });

    var _format = function _format(ctx, args, entity) {
      var opts = arguments.length <= 3 || arguments[3] === undefined ? _opts : arguments[3];

      // optimization: many translations are simple strings and we can very easily
      // avoid the cost of a proper resolution by having this shortcut here
      if (typeof entity === 'string') {
        return [entity, []];
      }

      return resolve(toFTLType(entity, opts)).run({
        ctx: ctx, args: args, dirty: new WeakSet()
      });
    };

    var prioritizeLocales = function prioritizeLocales(def, availableLangs, requested) {
      var supportedLocales = new Set();
      for (var _iterator7 = requested, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
        var _ref26;

        if (_isArray7) {
          if (_i7 >= _iterator7.length) break;
          _ref26 = _iterator7[_i7++];
        } else {
          _i7 = _iterator7.next();
          if (_i7.done) break;
          _ref26 = _i7.value;
        }

        var lang = _ref26;

        if (availableLangs.has(lang)) {
          supportedLocales.add(lang);
        }
      }

      supportedLocales.add(def);
      return supportedLocales;
    };

    var getDirection = function getDirection(code) {
      var tag = code.split('-')[0];
      return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(tag) >= 0 ? 'rtl' : 'ltr';
    };

    var keysFromContext = function keysFromContext(ctx, keys, method, prev) {
      var _this17 = this;

      var errors = [];
      var translations = keys.map(function (key, i) {
        if (prev && prev[i] && prev[i][1].length === 0) {
          // Use a previously formatted good value if there were no errors
          return prev[i];
        }

        var _ref36 = Array.isArray(key) ? key : [key, undefined];

        var id = _ref36[0];
        var args = _ref36[1];


        var result = method.call(_this17, ctx, id, args);
        errors.push.apply(errors, result[1]);
        // XXX Depending on the kind of errors it might be better to return prev[i]
        // here;  for instance, when the current translation is completely missing
        return result;
      });

      return [translations, errors];
    };

    var valueFromContext = function valueFromContext(ctx, id, args) {
      var entity = ctx.messages.get(id);

      if (entity === undefined) {
        return [id, [new L10nError('Unknown entity: ' + id)]];
      }

      return ctx.format(entity, args);
    };

    var entityFromContext = function entityFromContext(ctx, id, args) {
      var entity = ctx.messages.get(id);

      if (entity === undefined) {
        return [{ value: id, attrs: null }, [new L10nError('Unknown entity: ' + id)]];
      }

      var _ctx$formatToPrimitiv = ctx.formatToPrimitive(entity, args);

      var value = _ctx$formatToPrimitiv[0];
      var errors = _ctx$formatToPrimitiv[1];


      var formatted = {
        value: value,
        attrs: null
      };

      if (entity.traits) {
        formatted.attrs = Object.create(null);
        for (var _iterator14 = entity.traits, _isArray14 = Array.isArray(_iterator14), _i14 = 0, _iterator14 = _isArray14 ? _iterator14 : _iterator14[Symbol.iterator]();;) {
          var _ref37;

          if (_isArray14) {
            if (_i14 >= _iterator14.length) break;
            _ref37 = _iterator14[_i14++];
          } else {
            _i14 = _iterator14.next();
            if (_i14.done) break;
            _ref37 = _i14.value;
          }

          var trait = _ref37;

          var _ctx$format = ctx.format(trait, args);

          var attrValue = _ctx$format[0];
          var attrErrors = _ctx$format[1];

          errors.push.apply(errors, attrErrors);
          formatted.attrs[trait.key.name] = attrValue;
        }
      }

      return [formatted, errors];
    };

    var createContextFromBundle = function createContextFromBundle(bundle, createContext) {
      return bundle.fetch().then(function (resources) {
        var ctx = createContext(bundle.lang);
        resources.filter(function (res) {
          return !(res instanceof Error);
        }).forEach(function (res) {
          return ctx.addMessages(res);
        });
        contexts.set(bundle, ctx);
        return ctx;
      });
    };

    var fetchFirstBundle = function fetchFirstBundle(bundles, createContext) {
      var bundle = bundles[0];


      if (!bundle) {
        return Promise.resolve(bundles);
      }

      return createContextFromBundle(bundle, createContext).then(function () {
        return bundles;
      });
    };

    var changeLanguages = function changeLanguages(l10n, oldBundles, requestedLangs) {
      var _properties$get2 = properties.get(l10n);

      var requestBundles = _properties$get2.requestBundles;
      var createContext = _properties$get2.createContext;


      return l10n.interactive = requestBundles(requestedLangs).then(function (newBundles) {
        return equal(oldBundles, newBundles) ? oldBundles : fetchFirstBundle(newBundles, createContext);
      });
    };

    var equal = function equal(bundles1, bundles2) {
      return bundles1.length === bundles2.length && bundles1.every(function (_ref39, i) {
        var lang = _ref39.lang;
        return lang === bundles2[i].lang;
      });
    };

    // match the opening angle bracket (<) in HTML tags, and HTML entities like
    // &amp;, &#0038;, &#x0026;.


    var _overlayElement = function _overlayElement(l10n, element, translation) {
      var value = translation.value;

      if (typeof value === 'string') {
        if (!reOverlay.test(value)) {
          element.textContent = value;
        } else {
          // start with an inert template element and move its children into
          // `element` but such that `element`'s own children are not replaced
          var tmpl = element.ownerDocument.createElementNS('http://www.w3.org/1999/xhtml', 'template');
          tmpl.innerHTML = value;
          // overlay the node with the DocumentFragment
          overlay(l10n, element, tmpl.content);
        }
      }

      for (var key in translation.attrs) {
        if (l10n.isAttrAllowed({ name: key }, element)) {
          element.setAttribute(key, translation.attrs[key]);
        }
      }
    };

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


    var overlay = function overlay(l10n, sourceElement, translationElement) {
      var result = translationElement.ownerDocument.createDocumentFragment();
      var k = void 0,
          attr = void 0;

      // take one node from translationElement at a time and check it against
      // the allowed list or try to match it with a corresponding element
      // in the source
      var childElement = void 0;
      while (childElement = translationElement.childNodes[0]) {
        translationElement.removeChild(childElement);

        if (childElement.nodeType === childElement.TEXT_NODE) {
          result.appendChild(childElement);
          continue;
        }

        var _index = getIndexOfType(childElement);
        var sourceChild = getNthElementOfType(sourceElement, childElement, _index);
        if (sourceChild) {
          // there is a corresponding element in the source, let's use it
          overlay(l10n, sourceChild, childElement);
          result.appendChild(sourceChild);
          continue;
        }

        if (l10n.isElementAllowed(childElement)) {
          var sanitizedChild = childElement.ownerDocument.createElement(childElement.nodeName);
          overlay(l10n, sanitizedChild, childElement);
          result.appendChild(sanitizedChild);
          continue;
        }

        // otherwise just take this child's textContent
        result.appendChild(translationElement.ownerDocument.createTextNode(childElement.textContent));
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
        for (k = 0, attr; attr = translationElement.attributes[k]; k++) {
          if (l10n.isAttrAllowed(attr, sourceElement)) {
            sourceElement.setAttribute(attr.name, attr.value);
          }
        }
      }
    };

    // Get n-th immediate child of context that is of the same type as element.
    // XXX Use querySelector(':scope > ELEMENT:nth-of-type(index)'), when:
    // 1) :scope is widely supported in more browsers and 2) it works with
    // DocumentFragments.


    var getNthElementOfType = function getNthElementOfType(context, element, index) {
      /* jshint boss:true */
      var nthOfType = 0;
      for (var i = 0, _child; _child = context.children[i]; i++) {
        if (_child.nodeType === _child.ELEMENT_NODE && _child.tagName.toLowerCase() === element.tagName.toLowerCase()) {
          if (nthOfType === index) {
            return _child;
          }
          nthOfType++;
        }
      }
      return null;
    };

    // Get the index of the element among siblings of the same type.


    var getIndexOfType = function getIndexOfType(element) {
      var index = 0;
      var child = void 0;
      while (child = element.previousElementSibling) {
        if (child.tagName === element.tagName) {
          index++;
        }
      }
      return index;
    };

    var load = function load(url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        if (xhr.overrideMimeType) {
          xhr.overrideMimeType('text/plain');
        }

        xhr.open('GET', url, true);

        xhr.addEventListener('load', function (e) {
          if (e.target.status === HTTP_STATUS_CODE_OK || e.target.status === 0) {
            resolve(e.target.response);
          } else {
            reject(new L10nError('Not found: ' + url));
          }
        });
        xhr.addEventListener('error', reject);
        xhr.addEventListener('timeout', reject);

        xhr.send(null);
      });
    };

    var fetchResource = function fetchResource(res, lang) {
      var url = res.replace('{locale}', lang);
      return load(url).catch(function (e) {
        return e;
      });
    };

    // A document.ready shim
    // https://github.com/whatwg/html/issues/127

    var documentReady = function documentReady() {
      if (document.readyState !== 'loading') {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        document.addEventListener('readystatechange', function onrsc() {
          document.removeEventListener('readystatechange', onrsc);
          resolve();
        });
      });
    };

    var getResourceLinks = function getResourceLinks(head) {
      return Array.prototype.map.call(head.querySelectorAll('link[rel="localization"]'), function (el) {
        return [el.getAttribute('href'), el.getAttribute('name') || 'main'];
      }).reduce(function (seq, _ref40) {
        var href = _ref40[0];
        var name = _ref40[1];
        return seq.set(name, (seq.get(name) || []).concat(href));
      }, new Map());
    };

    var getMeta = function getMeta(head) {
      var availableLangs = new Set();
      var defaultLang = null;
      var appVersion = null;

      // XXX take last found instead of first?
      var metas = Array.from(head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]'));
      for (var _iterator15 = metas, _isArray15 = Array.isArray(_iterator15), _i15 = 0, _iterator15 = _isArray15 ? _iterator15 : _iterator15[Symbol.iterator]();;) {
        var _ref41;

        if (_isArray15) {
          if (_i15 >= _iterator15.length) break;
          _ref41 = _iterator15[_i15++];
        } else {
          _i15 = _iterator15.next();
          if (_i15.done) break;
          _ref41 = _i15.value;
        }

        var meta = _ref41;

        var name = meta.getAttribute('name');
        var _content = meta.getAttribute('content').trim();
        switch (name) {
          case 'availableLanguages':
            availableLangs = new Set(_content.split(',').map(function (lang) {
              return lang.trim();
            }));
            break;
          case 'defaultLanguage':
            defaultLang = _content;
            break;
          case 'appVersion':
            appVersion = _content;
        }
      }

      return {
        defaultLang: defaultLang,
        availableLangs: availableLangs,
        appVersion: appVersion
      };
    };

    var createContext = function createContext(lang) {
      return new Intl.MessageContext(lang);
    };

    var createLocalization = function createLocalization(name, resIds, defaultLang, availableLangs) {
      function requestBundles() {
        var requestedLangs = arguments.length <= 0 || arguments[0] === undefined ? new Set(navigator.languages) : arguments[0];

        var newLangs = prioritizeLocales(defaultLang, availableLangs, requestedLangs);

        var bundles = [];
        newLangs.forEach(function (lang) {
          bundles.push(new ResourceBundle(lang, resIds));
        });
        return Promise.resolve(bundles);
      }

      document.l10n.set(name, new HTMLLocalization(requestBundles, createContext));

      if (name === 'main') {
        var rootElem = document.documentElement;
        document.l10n.observeRoot(rootElem, document.l10n.get(name));
        document.l10n.translateRoot(rootElem);
      }
    };

    // See docs/compat.md for more information on providing polyfills which are
    // required for l20n.js to work in legacy browsers.
    //
    // The following are simple fixes which aren't included in any of the popular
    // polyfill libraries.

    // IE, Safari and Opera don't support it yet
    if (typeof navigator !== 'undefined' && navigator.languages === undefined) {
      navigator.languages = [navigator.language];
    }

    // iOS Safari doesn't even have the Intl object defined
    if (typeof Intl === 'undefined') {
      window.Intl = {};
    }

    /*eslint no-magic-numbers: [0]*/

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
    };var pluralRules = {
      '0': function _() {
        return 'other';
      },
      '1': function _(n) {
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
      '2': function _(n) {
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
      '3': function _(n) {
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '4': function _(n) {
        if (isBetween(n, 0, 1)) {
          return 'one';
        }
        return 'other';
      },
      '5': function _(n) {
        if (isBetween(n, 0, 2) && n !== 2) {
          return 'one';
        }
        return 'other';
      },
      '6': function _(n) {
        if (n === 0) {
          return 'zero';
        }
        if (n % 10 === 1 && n % 100 !== 11) {
          return 'one';
        }
        return 'other';
      },
      '7': function _(n) {
        if (n === 2) {
          return 'two';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '8': function _(n) {
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
      '9': function _(n) {
        if (n === 0 || n !== 1 && isBetween(n % 100, 1, 19)) {
          return 'few';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '10': function _(n) {
        if (isBetween(n % 10, 2, 9) && !isBetween(n % 100, 11, 19)) {
          return 'few';
        }
        if (n % 10 === 1 && !isBetween(n % 100, 11, 19)) {
          return 'one';
        }
        return 'other';
      },
      '11': function _(n) {
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
      '12': function _(n) {
        if (isBetween(n, 2, 4)) {
          return 'few';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '13': function _(n) {
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
      '14': function _(n) {
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
      '15': function _(n) {
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
      '16': function _(n) {
        if (n % 10 === 1 && n !== 11) {
          return 'one';
        }
        return 'other';
      },
      '17': function _(n) {
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
      '18': function _(n) {
        if (n === 0) {
          return 'zero';
        }
        if (isBetween(n, 0, 2) && n !== 0 && n !== 2) {
          return 'one';
        }
        return 'other';
      },
      '19': function _(n) {
        if (isBetween(n, 2, 10)) {
          return 'few';
        }
        if (isBetween(n, 0, 1)) {
          return 'one';
        }
        return 'other';
      },
      '20': function _(n) {
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
      '21': function _(n) {
        if (n === 0) {
          return 'zero';
        }
        if (n === 1) {
          return 'one';
        }
        return 'other';
      },
      '22': function _(n) {
        if (isBetween(n, 0, 1) || isBetween(n, 11, 99)) {
          return 'one';
        }
        return 'other';
      },
      '23': function _(n) {
        if (isBetween(n % 10, 1, 2) || n % 20 === 0) {
          return 'one';
        }
        return 'other';
      },
      '24': function _(n) {
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

    var L10nError = function (_Error) {
      _inherits(L10nError, _Error);

      function L10nError(message, id, lang) {
        _classCallCheck(this, L10nError);

        var _this = _possibleConstructorReturn(this, _Error.call(this));

        _this.name = 'L10nError';
        _this.message = message;
        _this.id = id;
        _this.lang = lang;
        return _this;
      }

      return L10nError;
    }(Error);

    var ParseContext = function () {
      function ParseContext(string) {
        _classCallCheck(this, ParseContext);

        this._source = string;
        this._index = 0;
        this._length = string.length;

        this._lastGoodEntryEnd = 0;
      }

      ParseContext.prototype.getResource = function getResource() {
        var entries = {};
        var errors = [];

        this.getWS();
        while (this._index < this._length) {
          try {
            var entry = this.getEntry();
            if (!entry) {
              this.getWS();
              continue;
            }

            var id = entry.id;
            entries[id] = {};

            if (entry.traits !== null && entry.traits.length !== 0) {
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
      };

      ParseContext.prototype.getEntry = function getEntry() {
        if (this._index !== 0 && this._source[this._index - 1] !== '\n') {
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

        if (this._index < this._length && this._source[this._index] !== '\n') {
          return this.getEntity();
        }
      };

      ParseContext.prototype.getSection = function getSection() {
        this._index += 1;
        if (this._source[this._index] !== '[') {
          throw this.error('Expected "[[" to open a section');
        }

        this._index += 1;

        this.getLineWS();
        this.getKeyword();
        this.getLineWS();

        if (this._source[this._index] !== ']' || this._source[this._index + 1] !== ']') {
          throw this.error('Expected "]]" to close a section');
        }

        this._index += 2;

        // sections are ignored in the runtime ast
        return undefined;
      };

      ParseContext.prototype.getEntity = function getEntity() {
        var id = this.getIdentifier();

        var traits = null;
        var value = null;

        this.getLineWS();

        var ch = this._source[this._index];

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

        if (ch === '[' && this._source[this._index + 1] !== '[' || ch === '*') {
          traits = this.getMembers();
        } else if (value === null) {
          throw this.error('Expected a value (like: " = value") or a trait (like: "[key] value")');
        }

        return {
          id: id,
          value: value,
          traits: traits
        };
      };

      ParseContext.prototype.getWS = function getWS() {
        var cc = this._source.charCodeAt(this._index);
        // space, \n, \t, \r
        while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
          cc = this._source.charCodeAt(++this._index);
        }
      };

      ParseContext.prototype.getLineWS = function getLineWS() {
        var cc = this._source.charCodeAt(this._index);
        // space, \t
        while (cc === 32 || cc === 9) {
          cc = this._source.charCodeAt(++this._index);
        }
      };

      ParseContext.prototype.getIdentifier = function getIdentifier() {
        var name = '';

        var start = this._index;
        var cc = this._source.charCodeAt(this._index);

        if (cc >= 97 && cc <= 122 || // a-z
        cc >= 65 && cc <= 90 || // A-Z
        cc === 95) {
          // _
          cc = this._source.charCodeAt(++this._index);
        } else if (name.length === 0) {
          throw this.error('Expected an identifier (starting with [a-zA-Z_])');
        }

        while (cc >= 97 && cc <= 122 || // a-z
        cc >= 65 && cc <= 90 || // A-Z
        cc >= 48 && cc <= 57 || // 0-9
        cc === 95 || cc === 45) {
          // _-
          cc = this._source.charCodeAt(++this._index);
        }

        name += this._source.slice(start, this._index);

        return name;
      };

      ParseContext.prototype.getKeyword = function getKeyword() {
        var name = '';
        var namespace = this.getIdentifier();

        if (this._source[this._index] === '/') {
          this._index++;
        } else if (namespace) {
          name = namespace;
          namespace = null;
        }

        var start = this._index;
        var cc = this._source.charCodeAt(this._index);

        if (cc >= 97 && cc <= 122 || // a-z
        cc >= 65 && cc <= 90 || // A-Z
        cc === 95 || cc === 32) {
          //  _
          cc = this._source.charCodeAt(++this._index);
        } else if (name.length === 0) {
          throw this.error('Expected an identifier (starting with [a-zA-Z_])');
        }

        while (cc >= 97 && cc <= 122 || // a-z
        cc >= 65 && cc <= 90 || // A-Z
        cc >= 48 && cc <= 57 || // 0-9
        cc === 95 || cc === 45 || cc === 32) {
          //  _-
          cc = this._source.charCodeAt(++this._index);
        }

        name += this._source.slice(start, this._index).trimRight();

        return namespace ? { type: 'kw', ns: namespace, name: name } : { type: 'kw', name: name };
      };

      ParseContext.prototype.getPattern = function getPattern() {
        var start = this._index;
        if (this._source[start] === '"') {
          return this.getComplexPattern();
        }
        var eol = this._source.indexOf('\n', this._index);

        if (eol === -1) {
          eol = this._length;
        }

        var line = this._source.slice(start, eol);

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
      };

      ParseContext.prototype.getComplexPattern = function getComplexPattern() {
        var buffer = '';
        var content = [];
        var quoteDelimited = null;
        var firstLine = true;

        var ch = this._source[this._index];

        if (ch === '\\' && (this._source[this._index + 1] === '"' || this._source[this._index + 1] === '{' || this._source[this._index + 1] === '\\')) {
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
            var ch2 = this._source[this._index + 1];
            if (quoteDelimited && ch2 === '"' || ch2 === '{') {
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
            buffer = '';
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

        if (content.length === 1 && typeof content[0] === 'string') {
          return content[0];
        }

        return content;
      };

      ParseContext.prototype.getPlaceable = function getPlaceable() {
        this._index++;

        var expressions = [];

        this.getLineWS();

        while (this._index < this._length) {
          var _start = this._index;
          try {
            expressions.push(this.getPlaceableExpression());
          } catch (e) {
            throw this.error(e.description, _start);
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
      };

      ParseContext.prototype.getPlaceableExpression = function getPlaceableExpression() {
        var selector = this.getCallExpression();
        var members = null;

        this.getWS();

        if (this._source[this._index] !== '}' && this._source[this._index] !== ',') {
          if (this._source[this._index] !== '-' || this._source[this._index + 1] !== '>') {
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
      };

      ParseContext.prototype.getCallExpression = function getCallExpression() {
        var exp = this.getMemberExpression();

        if (this._source[this._index] !== '(') {
          return exp;
        }

        this._index++;

        var args = this.getCallArgs();

        this._index++;

        if (exp.type = 'ref') {
          exp.type = 'fun';
        }

        return {
          type: 'call',
          name: exp,
          args: args
        };
      };

      ParseContext.prototype.getCallArgs = function getCallArgs() {
        var args = [];

        if (this._source[this._index] === ')') {
          return args;
        }

        while (this._index < this._length) {
          this.getLineWS();

          var _exp = this.getCallExpression();

          if (_exp.type !== 'ref' || _exp.namespace !== undefined) {
            args.push(_exp);
          } else {
            this.getLineWS();

            if (this._source[this._index] === ':') {
              this._index++;
              this.getLineWS();

              var val = this.getCallExpression();

              if (val.type === 'ref' || val.type === 'member') {
                this._index = this._source.lastIndexOf('=', this._index) + 1;
                throw this.error('Expected string in quotes');
              }

              args.push({
                type: 'kv',
                name: _exp.name,
                val: val
              });
            } else {
              args.push(_exp);
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
      };

      ParseContext.prototype.getNumber = function getNumber() {
        var num = '';
        var cc = this._source.charCodeAt(this._index);

        if (cc === 45) {
          num += '-';
          cc = this._source.charCodeAt(++this._index);
        }

        if (cc < 48 || cc > 57) {
          throw this.error('Unknown literal "' + num + '"');
        }

        while (cc >= 48 && cc <= 57) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);
        }

        if (cc === 46) {
          num += this._source[this._index++];
          cc = this._source.charCodeAt(this._index);

          if (cc < 48 || cc > 57) {
            throw this.error('Unknown literal "' + num + '"');
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
      };

      ParseContext.prototype.getMemberExpression = function getMemberExpression() {
        var exp = this.getLiteral();

        while (this._source[this._index] === '[') {
          var _keyword = this.getMemberKey();
          exp = {
            type: 'mem',
            key: _keyword,
            obj: exp
          };
        }

        return exp;
      };

      ParseContext.prototype.getMembers = function getMembers() {
        var members = [];

        while (this._index < this._length) {
          if ((this._source[this._index] !== '[' || this._source[this._index + 1] === '[') && this._source[this._index] !== '*') {
            break;
          }
          var def = false;
          if (this._source[this._index] === '*') {
            this._index++;
            def = true;
          }

          if (this._source[this._index] !== '[') {
            throw this.error('Expected "["');
          }

          var key = this.getMemberKey();

          this.getLineWS();

          var value = this.getPattern();

          var member = {
            key: key,
            val: value
          };
          if (def) {
            member.def = true;
          }
          members.push(member);

          this.getWS();
        }

        return members;
      };

      ParseContext.prototype.getMemberKey = function getMemberKey() {
        this._index++;

        var cc = this._source.charCodeAt(this._index);
        var literal = void 0;

        if (cc >= 48 && cc <= 57 || cc === 45) {
          literal = this.getNumber();
        } else {
          literal = this.getKeyword();
        }

        if (this._source[this._index] !== ']') {
          throw this.error('Expected "]"');
        }

        this._index++;
        return literal;
      };

      ParseContext.prototype.getLiteral = function getLiteral() {
        var cc = this._source.charCodeAt(this._index);
        if (cc >= 48 && cc <= 57 || cc === 45) {
          return this.getNumber();
        } else if (cc === 34) {
          // "
          return this.getPattern();
        } else if (cc === 36) {
          // $
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
      };

      ParseContext.prototype.getComment = function getComment() {
        var eol = this._source.indexOf('\n', this._index);

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
      };

      ParseContext.prototype.error = function error(message) {
        var start = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var pos = this._index;

        if (start === null) {
          start = pos;
        }
        start = this._findEntityStart(start);

        var context = this._source.slice(start, pos + 10);

        var msg = '\n\n  ' + message + '\nat pos ' + pos + ':\n------\n…' + context + '\n------';
        var err = new L10nError(msg);

        var row = this._source.slice(0, pos).split('\n').length;
        var col = pos - this._source.lastIndexOf('\n', pos - 1);
        err._pos = { start: pos, end: undefined, col: col, row: row };
        err.offset = pos - start;
        err.description = message;
        err.context = context;
        return err;
      };

      ParseContext.prototype.getJunkEntry = function getJunkEntry() {
        var pos = this._index;

        var nextEntity = this._findNextEntryStart(pos);

        if (nextEntity === -1) {
          nextEntity = this._length;
        }

        this._index = nextEntity;

        var entityStart = this._findEntityStart(pos);

        if (entityStart < this._lastGoodEntryEnd) {
          entityStart = this._lastGoodEntryEnd;
        }
      };

      ParseContext.prototype._findEntityStart = function _findEntityStart(pos) {
        var start = pos;

        while (true) {
          start = this._source.lastIndexOf('\n', start - 2);
          if (start === -1 || start === 0) {
            start = 0;
            break;
          }
          var _cc = this._source.charCodeAt(start + 1);

          if (_cc >= 97 && _cc <= 122 || // a-z
          _cc >= 65 && _cc <= 90 || // A-Z
          _cc === 95) {
            // _
            start++;
            break;
          }
        }

        return start;
      };

      ParseContext.prototype._findNextEntryStart = function _findNextEntryStart(pos) {
        var start = pos;

        while (true) {
          if (start === 0 || this._source[start - 1] === '\n') {
            var _cc2 = this._source.charCodeAt(start);

            if (_cc2 >= 97 && _cc2 <= 122 || // a-z
            _cc2 >= 65 && _cc2 <= 90 || // A-Z
            _cc2 === 95 || _cc2 === 35 || _cc2 === 91) {
              // _#[
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
      };

      return ParseContext;
    }();

    var FTLRuntimeParser = {
      parseResource: function parseResource(string) {
        var parseContext = new ParseContext(string);
        return parseContext.getResource();
      }
    };

    var ReadWrite = function () {
      function ReadWrite(fn) {
        _classCallCheck(this, ReadWrite);

        this.fn = fn;
      }

      ReadWrite.prototype.run = function run(ctx) {
        return this.fn(ctx);
      };

      ReadWrite.prototype.flatMap = function flatMap(fn) {
        var _this2 = this;

        return new ReadWrite(function (ctx) {
          var _run = _this2.run(ctx);

          var cur = _run[0];
          var curErrs = _run[1];

          var _fn$run = fn(cur).run(ctx);

          var val = _fn$run[0];
          var valErrs = _fn$run[1];

          return [val, [].concat(curErrs, valErrs)];
        });
      };

      return ReadWrite;
    }();

    var FTLBase = function () {
      function FTLBase(value, opts) {
        _classCallCheck(this, FTLBase);

        this.value = value;
        this.opts = opts;
      }

      FTLBase.prototype.valueOf = function valueOf() {
        return this.value;
      };

      return FTLBase;
    }();

    var FTLNone = function (_FTLBase) {
      _inherits(FTLNone, _FTLBase);

      function FTLNone() {
        _classCallCheck(this, FTLNone);

        return _possibleConstructorReturn(this, _FTLBase.apply(this, arguments));
      }

      FTLNone.prototype.toString = function toString() {
        return this.value || '???';
      };

      return FTLNone;
    }(FTLBase);

    var FTLNumber = function (_FTLBase2) {
      _inherits(FTLNumber, _FTLBase2);

      function FTLNumber(value, opts) {
        _classCallCheck(this, FTLNumber);

        return _possibleConstructorReturn(this, _FTLBase2.call(this, parseFloat(value), opts));
      }

      FTLNumber.prototype.toString = function toString(ctx) {
        var nf = ctx._memoizeIntlObject(Intl.NumberFormat, this.opts);
        return nf.format(this.value);
      };

      return FTLNumber;
    }(FTLBase);

    var FTLDateTime = function (_FTLBase3) {
      _inherits(FTLDateTime, _FTLBase3);

      function FTLDateTime(value, opts) {
        _classCallCheck(this, FTLDateTime);

        return _possibleConstructorReturn(this, _FTLBase3.call(this, new Date(value), opts));
      }

      FTLDateTime.prototype.toString = function toString(ctx) {
        var dtf = ctx._memoizeIntlObject(Intl.DateTimeFormat, this.opts);
        return dtf.format(this.value);
      };

      return FTLDateTime;
    }(FTLBase);

    var FTLKeyword = function (_FTLBase4) {
      _inherits(FTLKeyword, _FTLBase4);

      function FTLKeyword() {
        _classCallCheck(this, FTLKeyword);

        return _possibleConstructorReturn(this, _FTLBase4.apply(this, arguments));
      }

      FTLKeyword.prototype.toString = function toString() {
        var _value = this.value;
        var name = _value.name;
        var namespace = _value.namespace;

        return namespace ? namespace + ':' + name : name;
      };

      FTLKeyword.prototype.match = function match(ctx, other) {
        var _value2 = this.value;
        var name = _value2.name;
        var namespace = _value2.namespace;

        if (other instanceof FTLKeyword) {
          return name === other.value.name && namespace === other.value.namespace;
        } else if (namespace) {
          return false;
        } else if (typeof other === 'string') {
          return name === other;
        } else if (other instanceof FTLNumber) {
          var pr = ctx._memoizeIntlObject(Intl.PluralRules, other.opts);
          return name === pr.select(other.valueOf());
        } else {
          return false;
        }
      };

      return FTLKeyword;
    }(FTLBase);

    var FTLList = function (_Array) {
      _inherits(FTLList, _Array);

      function FTLList() {
        _classCallCheck(this, FTLList);

        return _possibleConstructorReturn(this, _Array.apply(this, arguments));
      }

      FTLList.prototype.toString = function toString(ctx) {
        var lf = ctx._memoizeIntlObject(Intl.ListFormat // XXX add this.opts
        );
        var elems = this.map(function (elem) {
          return elem.toString(ctx);
        });
        return lf.format(elems);
      };

      return FTLList;
    }(Array);

    // each builtin takes two arguments:
    //  - args = an array of positional args
    //  - opts  = an object of key-value args

    var builtins = {
      'NUMBER': function NUMBER(_ref, opts) {
        var arg = _ref[0];
        return new FTLNumber(arg.valueOf(), merge(arg.opts, opts));
      },
      'PLURAL': function PLURAL(_ref2, opts) {
        var arg = _ref2[0];
        return new FTLNumber(arg.valueOf(), merge(arg.opts, opts));
      },
      'DATETIME': function DATETIME(_ref3, opts) {
        var arg = _ref3[0];
        return new FTLDateTime(arg.valueOf(), merge(arg.opts, opts));
      },
      'LIST': function LIST(args) {
        return FTLList.from(args);
      },
      'LEN': function LEN(_ref4) {
        var arg = _ref4[0];
        return new FTLNumber(arg.valueOf().length);
      },
      'TAKE': function TAKE(_ref5) {
        var num = _ref5[0];
        var arg = _ref5[1];
        return FTLList.from(arg.valueOf().slice(0, num.value));
      },
      'DROP': function DROP(_ref6) {
        var num = _ref6[0];
        var arg = _ref6[1];
        return FTLList.from(arg.valueOf().slice(num.value));
      }
    };

    var FSI = '⁨';
    var PDI = '⁩';

    var MAX_PLACEABLE_LENGTH = 2500;

    var _opts = {
      allowNoDefault: false
    };

    var optsPrimitive = { allowNoDefault: true };

    var MessageContext = function () {
      function MessageContext(lang) {
        var _ref25 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var functions = _ref25.functions;

        _classCallCheck(this, MessageContext);

        this.lang = lang;
        this.functions = functions || {};
        this.messages = new Map();
        this.intls = new WeakMap();
      }

      MessageContext.prototype.addMessages = function addMessages(source) {
        var _FTLRuntimeParser$par = FTLRuntimeParser.parseResource(source);

        var entries = _FTLRuntimeParser$par[0];
        var errors = _FTLRuntimeParser$par[1];

        for (var id in entries) {
          this.messages.set(id, entries[id]);
        }

        return errors;
      };

      // format `entity` to a string or null


      MessageContext.prototype.formatToPrimitive = function formatToPrimitive(entity, args) {
        var result = _format(this, args, entity, optsPrimitive);
        return result[0] instanceof FTLNone ? [null, result[1]] : result;
      };

      // format `entity` to a string


      MessageContext.prototype.format = function format(entity, args) {
        var result = _format(this, args, entity);
        return [result[0].toString(), result[1]];
      };

      MessageContext.prototype._memoizeIntlObject = function _memoizeIntlObject(ctor, opts) {
        var cache = this.intls.get(ctor) || {};
        var id = JSON.stringify(opts);

        if (!cache[id]) {
          cache[id] = new ctor(this.lang, opts);
          this.intls.set(ctor, cache);
        }

        return cache[id];
      };

      return MessageContext;
    }();

    Intl.MessageContext = MessageContext;
    Intl.MessageNumberArgument = FTLNumber;
    Intl.MessageDateTimeArgument = FTLDateTime;

    if (!Intl.NumberFormat) {
      Intl.NumberFormat = function () {
        return {
          format: function format(n) {
            return n;
          }
        };
      };
    }

    if (!Intl.PluralRules) {
      Intl.PluralRules = function (code) {
        var fn = getPluralRule(code);
        return {
          select: function select(n) {
            return fn(n);
          }
        };
      };
    }

    if (!Intl.ListFormat) {
      Intl.ListFormat = function () {
        return {
          format: function format(list) {
            return list.join(', ');
          }
        };
      };
    }

    var reHtml = /[&<>]/g;
    var htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    var observerConfig = {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: ['data-l10n-id', 'data-l10n-args', 'data-l10n-bundle']
    };

    var LocalizationObserver = function () {
      function LocalizationObserver() {
        var _this8 = this;

        _classCallCheck(this, LocalizationObserver);

        this.localizations = new Map();
        this.rootsByLocalization = new WeakMap();
        this.localizationsByRoot = new WeakMap();
        this.observer = new MutationObserver(function (mutations) {
          return _this8.translateMutations(mutations);
        });
      }

      LocalizationObserver.prototype.has = function has(name) {
        return this.localizations.has(name);
      };

      LocalizationObserver.prototype.get = function get(name) {
        return this.localizations.get(name);
      };

      LocalizationObserver.prototype.set = function set(name, value) {
        return this.localizations.set(name, value);
      };

      LocalizationObserver.prototype[Symbol.iterator] = regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.delegateYield(this.localizations, 't0', 1);

              case 1:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee, this);
      });

      LocalizationObserver.prototype.handleEvent = function handleEvent() {
        return this.requestLanguages();
      };

      LocalizationObserver.prototype.requestLanguages = function requestLanguages(requestedLangs) {
        var _this9 = this;

        var localizations = Array.from(this.localizations.values());
        return Promise.all(localizations.map(function (l10n) {
          return l10n.requestLanguages(requestedLangs);
        })).then(function () {
          return _this9.translateAllRoots();
        });
      };

      LocalizationObserver.prototype.setAttributes = function setAttributes(element, id, args) {
        element.setAttribute('data-l10n-id', id);
        if (args) {
          element.setAttribute('data-l10n-args', JSON.stringify(args));
        }
        return element;
      };

      LocalizationObserver.prototype.getAttributes = function getAttributes(element) {
        return {
          id: element.getAttribute('data-l10n-id'),
          args: JSON.parse(element.getAttribute('data-l10n-args'))
        };
      };

      LocalizationObserver.prototype.observeRoot = function observeRoot(root) {
        var l10n = arguments.length <= 1 || arguments[1] === undefined ? this.get('main') : arguments[1];

        this.localizationsByRoot.set(root, l10n);
        if (!this.rootsByLocalization.has(l10n)) {
          this.rootsByLocalization.set(l10n, new Set());
        }
        this.rootsByLocalization.get(l10n).add(root);
        this.observer.observe(root, observerConfig);
      };

      LocalizationObserver.prototype.disconnectRoot = function disconnectRoot(root) {
        this.pause();
        this.localizationsByRoot.delete(root);
        for (var _iterator8 = this.localizations, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
          var _ref27;

          if (_isArray8) {
            if (_i8 >= _iterator8.length) break;
            _ref27 = _iterator8[_i8++];
          } else {
            _i8 = _iterator8.next();
            if (_i8.done) break;
            _ref27 = _i8.value;
          }

          var _ref28 = _ref27;
          var name = _ref28[0];
          var l10n = _ref28[1];

          var roots = this.rootsByLocalization.get(l10n);
          if (roots && roots.has(root)) {
            roots.delete(root);
            if (roots.size === 0) {
              this.delete(name);
              this.rootsByLocalization.delete(l10n);
            }
          }
        }
        this.resume();
      };

      LocalizationObserver.prototype.pause = function pause() {
        this.observer.disconnect();
      };

      LocalizationObserver.prototype.resume = function resume() {
        for (var _iterator9 = this.localizations.values(), _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
          var _ref29;

          if (_isArray9) {
            if (_i9 >= _iterator9.length) break;
            _ref29 = _iterator9[_i9++];
          } else {
            _i9 = _iterator9.next();
            if (_i9.done) break;
            _ref29 = _i9.value;
          }

          var l10n = _ref29;

          if (this.rootsByLocalization.has(l10n)) {
            for (var _iterator10 = this.rootsByLocalization.get(l10n), _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
              var _ref30;

              if (_isArray10) {
                if (_i10 >= _iterator10.length) break;
                _ref30 = _iterator10[_i10++];
              } else {
                _i10 = _iterator10.next();
                if (_i10.done) break;
                _ref30 = _i10.value;
              }

              var root = _ref30;

              this.observer.observe(root, observerConfig);
            }
          }
        }
      };

      LocalizationObserver.prototype.translateAllRoots = function translateAllRoots() {
        var _this10 = this;

        var localizations = Array.from(this.localizations.values());
        return Promise.all(localizations.map(function (l10n) {
          return _this10.translateRoots(l10n);
        }));
      };

      LocalizationObserver.prototype.translateRoots = function translateRoots(l10n) {
        var _this11 = this;

        if (!this.rootsByLocalization.has(l10n)) {
          return Promise.resolve();
        }

        var roots = Array.from(this.rootsByLocalization.get(l10n));
        return Promise.all(roots.map(function (root) {
          return _this11.translateRoot(root, l10n);
        }));
      };

      LocalizationObserver.prototype.translateRoot = function translateRoot(root) {
        var _this12 = this;

        var l10n = arguments.length <= 1 || arguments[1] === undefined ? this.localizationsByRoot.get(root) : arguments[1];

        return l10n.interactive.then(function (bundles) {
          var langs = bundles.map(function (bundle) {
            return bundle.lang;
          });

          function setLangs() {
            var wasLocalizedBefore = root.hasAttribute('langs');

            root.setAttribute('langs', langs.join(' '));
            root.setAttribute('lang', langs[0]);
            root.setAttribute('dir', getDirection(langs[0]));

            if (wasLocalizedBefore) {
              root.dispatchEvent(new CustomEvent('DOMRetranslated', {
                bubbles: false,
                cancelable: false
              }));
            }
          }

          return _this12.translateRootContent(root).then(setLangs);
        });
      };

      LocalizationObserver.prototype.translateMutations = function translateMutations(mutations) {
        var targets = new Set();

        for (var _iterator11 = mutations, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
          var _ref31;

          if (_isArray11) {
            if (_i11 >= _iterator11.length) break;
            _ref31 = _iterator11[_i11++];
          } else {
            _i11 = _iterator11.next();
            if (_i11.done) break;
            _ref31 = _i11.value;
          }

          var mutation = _ref31;

          switch (mutation.type) {
            case 'attributes':
              targets.add(mutation.target);
              break;
            case 'childList':
              for (var _iterator12 = mutation.addedNodes, _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
                var _ref32;

                if (_isArray12) {
                  if (_i12 >= _iterator12.length) break;
                  _ref32 = _iterator12[_i12++];
                } else {
                  _i12 = _iterator12.next();
                  if (_i12.done) break;
                  _ref32 = _i12.value;
                }

                var addedNode = _ref32;

                if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
                  if (addedNode.childElementCount) {
                    this.getTranslatables(addedNode).forEach(targets.add.bind(targets));
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
      };

      LocalizationObserver.prototype.translateFragment = function translateFragment(frag) {
        return this.translateElements(this.getTranslatables(frag));
      };

      LocalizationObserver.prototype.translateElements = function translateElements(elements) {
        var _this13 = this;

        var elemsByL10n = this.groupElementsByLocalization(elements);
        return this.getElementsTranslation(elemsByL10n).then(function (translations) {
          return _this13.applyTranslations(elemsByL10n, translations);
        });
      };

      LocalizationObserver.prototype.applyTranslations = function applyTranslations(elemsByL10n, translationsByL10n) {
        this.pause();
        for (var _iterator13 = elemsByL10n, _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
          var _ref33;

          if (_isArray13) {
            if (_i13 >= _iterator13.length) break;
            _ref33 = _iterator13[_i13++];
          } else {
            _i13 = _iterator13.next();
            if (_i13.done) break;
            _ref33 = _i13.value;
          }

          var _ref34 = _ref33;
          var l10n = _ref34[0];
          var elems = _ref34[1];

          var translations = translationsByL10n.get(l10n);
          for (var i = 0; i < elems.length; i++) {
            l10n.overlayElement(elems[i], translations[i]);
          }
        }
        this.resume();
      };

      LocalizationObserver.prototype.groupElementsByLocalization = function groupElementsByLocalization(elements) {
        var _this14 = this;

        return Array.from(elements).reduce(function (seq, elem) {
          var l10n = _this14.getLocalizationForElement(elem);
          var group = (seq.get(l10n) || []).concat(elem);
          return seq.set(l10n, group);
        }, new Map());
      };

      LocalizationObserver.prototype.getTranslatables = function getTranslatables(element) {
        var nodes = Array.from(element.querySelectorAll('[data-l10n-id]'));

        if (typeof element.hasAttribute === 'function' && element.hasAttribute('data-l10n-id')) {
          nodes.push(element);
        }

        return nodes;
      };

      LocalizationObserver.prototype.getLocalizationForElement = function getLocalizationForElement(elem) {
        return this.get(elem.getAttribute('data-l10n-bundle') || 'main');
      };

      LocalizationObserver.prototype.getKeysForElements = function getKeysForElements(elems) {
        return elems.map(function (elem) {
          var id = elem.getAttribute('data-l10n-id');
          var args = elem.getAttribute('data-l10n-args');

          return args ? [id, JSON.parse(args.replace(reHtml, function (match) {
            return htmlEntities[match];
          }))] : id;
        });
      };

      LocalizationObserver.prototype.getElementsTranslation = function getElementsTranslation(elemsByL10n) {
        var _this15 = this;

        return Promise.all(Array.from(elemsByL10n).map(function (_ref35) {
          var l10n = _ref35[0];
          var elems = _ref35[1];
          return l10n.formatEntities(_this15.getKeysForElements(elems));
        })).then(function (translationsList) {
          return Array.from(elemsByL10n.keys()).reduce(function (seq, cur, idx) {
            return seq.set(cur, translationsList[idx]);
          }, new Map());
        });
      };

      return LocalizationObserver;
    }();

    var ContentLocalizationObserver = function (_LocalizationObserver) {
      _inherits(ContentLocalizationObserver, _LocalizationObserver);

      function ContentLocalizationObserver() {
        _classCallCheck(this, ContentLocalizationObserver);

        return _possibleConstructorReturn(this, _LocalizationObserver.apply(this, arguments));
      }

      ContentLocalizationObserver.prototype.translateRootContent = function translateRootContent(root) {
        return this.translateFragment(root);
      };

      return ContentLocalizationObserver;
    }(LocalizationObserver);

    var properties = new WeakMap();
    var contexts = new WeakMap();

    var Localization = function () {
      function Localization(requestBundles, createContext) {
        _classCallCheck(this, Localization);

        this.interactive = requestBundles().then(function (bundles) {
          return fetchFirstBundle(bundles, createContext);
        });

        properties.set(this, {
          requestBundles: requestBundles, createContext: createContext
        });
      }

      Localization.prototype.requestLanguages = function requestLanguages(requestedLangs) {
        var _this18 = this;

        return this.interactive.then(function (bundles) {
          return changeLanguages(_this18, bundles, requestedLangs);
        });
      };

      Localization.prototype.formatWithFallback = function formatWithFallback(bundles, keys, method, prev) {
        var _this19 = this;

        var ctx = contexts.get(bundles[0]);

        if (!ctx) {
          return prev.map(function (tuple) {
            return tuple[0];
          });
        }

        var _keysFromContext = keysFromContext(ctx, keys, method, prev);

        var translations = _keysFromContext[0];
        var errors = _keysFromContext[1];


        if (errors.length === 0) {
          return translations.map(function (tuple) {
            return tuple[0];
          });
        }

        // XXX report/emit errors?
        // errors.forEach(e => console.warn(e));

        var _properties$get = properties.get(this);

        var createContext = _properties$get.createContext;

        return fetchFirstBundle(bundles.slice(1), createContext).then(function (bundles) {
          return _this19.formatWithFallback(bundles, keys, method, translations);
        });
      };

      Localization.prototype.formatEntities = function formatEntities(keys) {
        var _this20 = this;

        return this.interactive.then(function (bundles) {
          return _this20.formatWithFallback(bundles, keys, entityFromContext);
        });
      };

      Localization.prototype.formatValues = function formatValues() {
        var _this21 = this;

        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        return this.interactive.then(function (bundles) {
          return _this21.formatWithFallback(bundles, keys, valueFromContext);
        });
      };

      Localization.prototype.formatValue = function formatValue(id, args) {
        return this.formatValues([id, args]).then(function (_ref38) {
          var val = _ref38[0];
          return val;
        });
      };

      return Localization;
    }();

    var reOverlay = /<|&#?\w+;/;

    var allowed = {
      elements: ['a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr'],
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

    var HTMLLocalization = function (_Localization) {
      _inherits(HTMLLocalization, _Localization);

      function HTMLLocalization() {
        _classCallCheck(this, HTMLLocalization);

        return _possibleConstructorReturn(this, _Localization.apply(this, arguments));
      }

      HTMLLocalization.prototype.overlayElement = function overlayElement(element, translation) {
        return _overlayElement(this, element, translation);
      };

      // XXX the allowed list should be amendable; https://bugzil.la/922573


      HTMLLocalization.prototype.isElementAllowed = function isElementAllowed(element) {
        return allowed.elements.indexOf(element.tagName.toLowerCase()) !== -1;
      };

      HTMLLocalization.prototype.isAttrAllowed = function isAttrAllowed(attr, element) {
        var attrName = attr.name.toLowerCase();
        var tagName = element.tagName.toLowerCase();
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
          var type = element.type.toLowerCase();
          if (type === 'submit' || type === 'button' || type === 'reset') {
            return true;
          }
        }
        return false;
      };

      return HTMLLocalization;
    }(Localization);

    var HTTP_STATUS_CODE_OK = 200;

    var ResourceBundle = function () {
      function ResourceBundle(lang, resIds) {
        _classCallCheck(this, ResourceBundle);

        this.lang = lang;
        this.loaded = false;
        this.resIds = resIds;
      }

      ResourceBundle.prototype.fetch = function fetch() {
        var _this23 = this;

        if (!this.loaded) {
          this.loaded = Promise.all(this.resIds.map(function (id) {
            return fetchResource(id, _this23.lang);
          }));
        }

        return this.loaded;
      };

      return ResourceBundle;
    }();

    document.l10n = new ContentLocalizationObserver();
    window.addEventListener('languagechange', document.l10n);

    documentReady().then(function () {
      var _getMeta = getMeta(document.head);

      var defaultLang = _getMeta.defaultLang;
      var availableLangs = _getMeta.availableLangs;

      for (var _iterator16 = getResourceLinks(document.head), _isArray16 = Array.isArray(_iterator16), _i16 = 0, _iterator16 = _isArray16 ? _iterator16 : _iterator16[Symbol.iterator]();;) {
        var _ref42;

        if (_isArray16) {
          if (_i16 >= _iterator16.length) break;
          _ref42 = _iterator16[_i16++];
        } else {
          _i16 = _iterator16.next();
          if (_i16.done) break;
          _ref42 = _i16.value;
        }

        var _ref43 = _ref42;
        var name = _ref43[0];
        var resIds = _ref43[1];

        if (!document.l10n.has(name)) {
          createLocalization(name, resIds, defaultLang, availableLangs);
        }
      }
    });
  })();
}