'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
        return Object.assign({}, seq, _defineProperty({}, cur, opts[cur].valueOf()));
      }, {});
    };

    // Unicode bidi isolation characters


    var mapValues = regeneratorRuntime.mark(function mapValues(arr) {
      var values, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, elem;

      return regeneratorRuntime.wrap(function mapValues$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              values = new FTLList();
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 4;
              _iterator = arr[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 15;
                break;
              }

              elem = _step.value;
              _context.t0 = values;
              return _context.delegateYield(Value(elem), 't1', 10);

            case 10:
              _context.t2 = _context.t1;

              _context.t0.push.call(_context.t0, _context.t2);

            case 12:
              _iteratorNormalCompletion = true;
              _context.next = 6;
              break;

            case 15:
              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t3 = _context['catch'](4);
              _didIteratorError = true;
              _iteratorError = _context.t3;

            case 21:
              _context.prev = 21;
              _context.prev = 22;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 24:
              _context.prev = 24;

              if (!_didIteratorError) {
                _context.next = 27;
                break;
              }

              throw _iteratorError;

            case 27:
              return _context.finish(24);

            case 28:
              return _context.finish(21);

            case 29:
              return _context.abrupt('return', values);

            case 30:
            case 'end':
              return _context.stop();
          }
        }
      }, mapValues, this, [[4, 17, 21, 29], [22,, 24, 28]]);
    });

    // Helper for choosing entity value

    var DefaultMember = regeneratorRuntime.mark(function DefaultMember(members) {
      var allowNoDefault = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, member;

      return regeneratorRuntime.wrap(function DefaultMember$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 3;
              _iterator2 = members[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context2.next = 12;
                break;
              }

              member = _step2.value;

              if (!member.def) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt('return', member);

            case 9:
              _iteratorNormalCompletion2 = true;
              _context2.next = 5;
              break;

            case 12:
              _context2.next = 18;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2['catch'](3);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;

            case 18:
              _context2.prev = 18;
              _context2.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 21:
              _context2.prev = 21;

              if (!_didIteratorError2) {
                _context2.next = 24;
                break;
              }

              throw _iteratorError2;

            case 24:
              return _context2.finish(21);

            case 25:
              return _context2.finish(18);

            case 26:
              if (allowNoDefault) {
                _context2.next = 29;
                break;
              }

              _context2.next = 29;
              return tell(new RangeError('No default'));

            case 29:
              return _context2.abrupt('return', { val: new FTLNone() });

            case 30:
            case 'end':
              return _context2.stop();
          }
        }
      }, DefaultMember, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });

    // Half-resolved expressions evaluate to raw Runtime AST nodes

    var EntityReference = regeneratorRuntime.mark(function EntityReference(_ref13) {
      var name = _ref13.name;

      var _ref14, ctx, entity;

      return regeneratorRuntime.wrap(function EntityReference$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return ask();

            case 2:
              _ref14 = _context3.sent;
              ctx = _ref14.ctx;
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
    var MemberExpression = regeneratorRuntime.mark(function MemberExpression(_ref15) {
      var obj = _ref15.obj;
      var key = _ref15.key;

      var entity, _ref16, ctx, keyword, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, member, memberKey;

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
              _ref16 = _context4.sent;
              ctx = _ref16.ctx;
              return _context4.delegateYield(Value(key), 't1', 9);

            case 9:
              keyword = _context4.t1;
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context4.prev = 13;
              _iterator3 = entity.traits[Symbol.iterator]();

            case 15:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context4.next = 24;
                break;
              }

              member = _step3.value;
              return _context4.delegateYield(Value(member.key), 't2', 18);

            case 18:
              memberKey = _context4.t2;

              if (!keyword.match(ctx, memberKey)) {
                _context4.next = 21;
                break;
              }

              return _context4.abrupt('return', member);

            case 21:
              _iteratorNormalCompletion3 = true;
              _context4.next = 15;
              break;

            case 24:
              _context4.next = 30;
              break;

            case 26:
              _context4.prev = 26;
              _context4.t3 = _context4['catch'](13);
              _didIteratorError3 = true;
              _iteratorError3 = _context4.t3;

            case 30:
              _context4.prev = 30;
              _context4.prev = 31;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 33:
              _context4.prev = 33;

              if (!_didIteratorError3) {
                _context4.next = 36;
                break;
              }

              throw _iteratorError3;

            case 36:
              return _context4.finish(33);

            case 37:
              return _context4.finish(30);

            case 38:
              _context4.next = 40;
              return tell(new ReferenceError('Unknown trait: ' + keyword.toString(ctx)));

            case 40:
              return _context4.delegateYield(Entity(entity), 't4', 41);

            case 41:
              _context4.t5 = _context4.t4;
              return _context4.abrupt('return', {
                val: _context4.t5
              });

            case 43:
            case 'end':
              return _context4.stop();
          }
        }
      }, MemberExpression, this, [[13, 26, 30, 38], [31,, 33, 37]]);
    });
    var SelectExpression = regeneratorRuntime.mark(function SelectExpression(_ref17) {
      var exp = _ref17.exp;
      var vars = _ref17.vars;

      var selector, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, variant, key, _ref18, _ctx;

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
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context5.prev = 8;
              _iterator4 = vars[Symbol.iterator]();

            case 10:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context5.next = 25;
                break;
              }

              variant = _step4.value;
              return _context5.delegateYield(Value(variant.key), 't2', 13);

            case 13:
              key = _context5.t2;

              if (!(key instanceof FTLNumber && selector instanceof FTLNumber && key.valueOf() === selector.valueOf())) {
                _context5.next = 16;
                break;
              }

              return _context5.abrupt('return', variant);

            case 16:
              _context5.next = 18;
              return ask();

            case 18:
              _ref18 = _context5.sent;
              _ctx = _ref18.ctx;

              if (!(key instanceof FTLKeyword && key.match(_ctx, selector))) {
                _context5.next = 22;
                break;
              }

              return _context5.abrupt('return', variant);

            case 22:
              _iteratorNormalCompletion4 = true;
              _context5.next = 10;
              break;

            case 25:
              _context5.next = 31;
              break;

            case 27:
              _context5.prev = 27;
              _context5.t3 = _context5['catch'](8);
              _didIteratorError4 = true;
              _iteratorError4 = _context5.t3;

            case 31:
              _context5.prev = 31;
              _context5.prev = 32;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 34:
              _context5.prev = 34;

              if (!_didIteratorError4) {
                _context5.next = 37;
                break;
              }

              throw _iteratorError4;

            case 37:
              return _context5.finish(34);

            case 38:
              return _context5.finish(31);

            case 39:
              return _context5.delegateYield(DefaultMember(vars), 't4', 40);

            case 40:
              return _context5.abrupt('return', _context5.t4);

            case 41:
            case 'end':
              return _context5.stop();
          }
        }
      }, SelectExpression, this, [[8, 27, 31, 39], [32,, 34, 38]]);
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
    var ExternalArgument = regeneratorRuntime.mark(function ExternalArgument(_ref19) {
      var name = _ref19.name;

      var _ref20, args, arg;

      return regeneratorRuntime.wrap(function ExternalArgument$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return ask();

            case 2:
              _ref20 = _context7.sent;
              args = _ref20.args;

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
    var FunctionReference = regeneratorRuntime.mark(function FunctionReference(_ref21) {
      var name = _ref21.name;

      var _ref22, functions, func;

      return regeneratorRuntime.wrap(function FunctionReference$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return ask();

            case 2:
              _ref22 = _context8.sent;
              functions = _ref22.ctx.functions;
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
    var CallExpression = regeneratorRuntime.mark(function CallExpression(_ref23) {
      var name = _ref23.name;
      var args = _ref23.args;

      var callee, posargs, keyargs, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _arg;

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
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context9.prev = 9;
              _iterator5 = args[Symbol.iterator]();

            case 11:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context9.next = 25;
                break;
              }

              _arg = _step5.value;

              if (!(_arg.type === 'kv')) {
                _context9.next = 18;
                break;
              }

              return _context9.delegateYield(Value(_arg.val), 't1', 15);

            case 15:
              keyargs[_arg.name] = _context9.t1;
              _context9.next = 22;
              break;

            case 18:
              _context9.t2 = posargs;
              return _context9.delegateYield(Value(_arg), 't3', 20);

            case 20:
              _context9.t4 = _context9.t3;

              _context9.t2.push.call(_context9.t2, _context9.t4);

            case 22:
              _iteratorNormalCompletion5 = true;
              _context9.next = 11;
              break;

            case 25:
              _context9.next = 31;
              break;

            case 27:
              _context9.prev = 27;
              _context9.t5 = _context9['catch'](9);
              _didIteratorError5 = true;
              _iteratorError5 = _context9.t5;

            case 31:
              _context9.prev = 31;
              _context9.prev = 32;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 34:
              _context9.prev = 34;

              if (!_didIteratorError5) {
                _context9.next = 37;
                break;
              }

              throw _iteratorError5;

            case 37:
              return _context9.finish(34);

            case 38:
              return _context9.finish(31);

            case 39:
              return _context9.abrupt('return', callee(posargs, keyargs));

            case 40:
            case 'end':
              return _context9.stop();
          }
        }
      }, CallExpression, this, [[9, 27, 31, 39], [32,, 34, 38]]);
    });
    var Pattern = regeneratorRuntime.mark(function Pattern(ptn) {
      var _ref24, ctx, dirty, result, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, part, value, str;

      return regeneratorRuntime.wrap(function Pattern$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return ask();

            case 2:
              _ref24 = _context10.sent;
              ctx = _ref24.ctx;
              dirty = _ref24.dirty;

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
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context10.prev = 14;
              _iterator6 = ptn[Symbol.iterator]();

            case 16:
              if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                _context10.next = 41;
                break;
              }

              part = _step6.value;

              if (!(typeof part === 'string')) {
                _context10.next = 22;
                break;
              }

              result += part;
              _context10.next = 38;
              break;

            case 22:
              if (!(part.length === 1)) {
                _context10.next = 27;
                break;
              }

              return _context10.delegateYield(Value(part[0]), 't1', 24);

            case 24:
              _context10.t0 = _context10.t1;
              _context10.next = 29;
              break;

            case 27:
              return _context10.delegateYield(mapValues(part), 't2', 28);

            case 28:
              _context10.t0 = _context10.t2;

            case 29:
              value = _context10.t0;
              str = value.toString(ctx);

              if (!(str.length > MAX_PLACEABLE_LENGTH)) {
                _context10.next = 37;
                break;
              }

              _context10.next = 34;
              return tell(new RangeError('Too many characters in placeable ' + ('(' + str.length + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')')));

            case 34:
              result += FSI + str.substr(0, MAX_PLACEABLE_LENGTH) + PDI;
              _context10.next = 38;
              break;

            case 37:
              result += FSI + str + PDI;

            case 38:
              _iteratorNormalCompletion6 = true;
              _context10.next = 16;
              break;

            case 41:
              _context10.next = 47;
              break;

            case 43:
              _context10.prev = 43;
              _context10.t3 = _context10['catch'](14);
              _didIteratorError6 = true;
              _iteratorError6 = _context10.t3;

            case 47:
              _context10.prev = 47;
              _context10.prev = 48;

              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }

            case 50:
              _context10.prev = 50;

              if (!_didIteratorError6) {
                _context10.next = 53;
                break;
              }

              throw _iteratorError6;

            case 53:
              return _context10.finish(50);

            case 54:
              return _context10.finish(47);

            case 55:

              dirty.delete(ptn);
              return _context10.abrupt('return', result);

            case 57:
            case 'end':
              return _context10.stop();
          }
        }
      }, Pattern, this, [[14, 43, 47, 55], [48,, 50, 54]]);
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
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = requested[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var lang = _step7.value;

          if (availableLangs.has(lang)) {
            supportedLocales.add(lang);
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
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

        var _ref28 = Array.isArray(key) ? key : [key, undefined];

        var _ref29 = _slicedToArray(_ref28, 2);

        var id = _ref29[0];
        var args = _ref29[1];


        var result = method.call(_this17, ctx, id, args);
        errors.push.apply(errors, _toConsumableArray(result[1]));
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

      var _ctx$formatToPrimitiv2 = _slicedToArray(_ctx$formatToPrimitiv, 2);

      var value = _ctx$formatToPrimitiv2[0];
      var errors = _ctx$formatToPrimitiv2[1];


      var formatted = {
        value: value,
        attrs: null
      };

      if (entity.traits) {
        formatted.attrs = Object.create(null);
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = entity.traits[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var trait = _step14.value;

            var _ctx$format = ctx.format(trait, args);

            var _ctx$format2 = _slicedToArray(_ctx$format, 2);

            var attrValue = _ctx$format2[0];
            var attrErrors = _ctx$format2[1];

            errors.push.apply(errors, _toConsumableArray(attrErrors));
            formatted.attrs[trait.key.name] = attrValue;
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14.return) {
              _iterator14.return();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
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
      var _bundles = _slicedToArray(bundles, 1);

      var bundle = _bundles[0];


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
      return bundles1.length === bundles2.length && bundles1.every(function (_ref32, i) {
        var lang = _ref32.lang;
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
      }).reduce(function (seq, _ref33) {
        var _ref34 = _slicedToArray(_ref33, 2);

        var href = _ref34[0];
        var name = _ref34[1];
        return seq.set(name, (seq.get(name) || []).concat(href));
      }, new Map());
    };

    var getMeta = function getMeta(head) {
      var availableLangs = new Set();
      var defaultLang = null;
      var appVersion = null;

      // XXX take last found instead of first?
      var metas = Array.from(head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]'));
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = metas[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var meta = _step15.value;

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
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15.return) {
            _iterator15.return();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
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

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(L10nError).call(this));

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

      _createClass(ParseContext, [{
        key: 'getResource',
        value: function getResource() {
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
        }
      }, {
        key: 'getEntry',
        value: function getEntry() {
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
        }
      }, {
        key: 'getSection',
        value: function getSection() {
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
        }
      }, {
        key: 'getEntity',
        value: function getEntity() {
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
        }
      }, {
        key: 'getWS',
        value: function getWS() {
          var cc = this._source.charCodeAt(this._index);
          // space, \n, \t, \r
          while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
            cc = this._source.charCodeAt(++this._index);
          }
        }
      }, {
        key: 'getLineWS',
        value: function getLineWS() {
          var cc = this._source.charCodeAt(this._index);
          // space, \t
          while (cc === 32 || cc === 9) {
            cc = this._source.charCodeAt(++this._index);
          }
        }
      }, {
        key: 'getIdentifier',
        value: function getIdentifier() {
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
        }
      }, {
        key: 'getKeyword',
        value: function getKeyword() {
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
        }
      }, {
        key: 'getPattern',
        value: function getPattern() {
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
        }
      }, {
        key: 'getComplexPattern',
        value: function getComplexPattern() {
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
        }
      }, {
        key: 'getPlaceable',
        value: function getPlaceable() {
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
        }
      }, {
        key: 'getPlaceableExpression',
        value: function getPlaceableExpression() {
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
        }
      }, {
        key: 'getCallExpression',
        value: function getCallExpression() {
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
        }
      }, {
        key: 'getCallArgs',
        value: function getCallArgs() {
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
        }
      }, {
        key: 'getNumber',
        value: function getNumber() {
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
        }
      }, {
        key: 'getMemberExpression',
        value: function getMemberExpression() {
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
        }
      }, {
        key: 'getMembers',
        value: function getMembers() {
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
        }
      }, {
        key: 'getMemberKey',
        value: function getMemberKey() {
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
        }
      }, {
        key: 'getLiteral',
        value: function getLiteral() {
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
        }
      }, {
        key: 'getComment',
        value: function getComment() {
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
        }
      }, {
        key: 'error',
        value: function error(message) {
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
        }
      }, {
        key: 'getJunkEntry',
        value: function getJunkEntry() {
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
        }
      }, {
        key: '_findEntityStart',
        value: function _findEntityStart(pos) {
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
        }
      }, {
        key: '_findNextEntryStart',
        value: function _findNextEntryStart(pos) {
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
        }
      }]);

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

      _createClass(ReadWrite, [{
        key: 'run',
        value: function run(ctx) {
          return this.fn(ctx);
        }
      }, {
        key: 'flatMap',
        value: function flatMap(fn) {
          var _this2 = this;

          return new ReadWrite(function (ctx) {
            var _run = _this2.run(ctx);

            var _run2 = _slicedToArray(_run, 2);

            var cur = _run2[0];
            var curErrs = _run2[1];

            var _fn$run = fn(cur).run(ctx);

            var _fn$run2 = _slicedToArray(_fn$run, 2);

            var val = _fn$run2[0];
            var valErrs = _fn$run2[1];

            return [val, [].concat(_toConsumableArray(curErrs), _toConsumableArray(valErrs))];
          });
        }
      }]);

      return ReadWrite;
    }();

    var FTLBase = function () {
      function FTLBase(value, opts) {
        _classCallCheck(this, FTLBase);

        this.value = value;
        this.opts = opts;
      }

      _createClass(FTLBase, [{
        key: 'valueOf',
        value: function valueOf() {
          return this.value;
        }
      }]);

      return FTLBase;
    }();

    var FTLNone = function (_FTLBase) {
      _inherits(FTLNone, _FTLBase);

      function FTLNone() {
        _classCallCheck(this, FTLNone);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FTLNone).apply(this, arguments));
      }

      _createClass(FTLNone, [{
        key: 'toString',
        value: function toString() {
          return this.value || '???';
        }
      }]);

      return FTLNone;
    }(FTLBase);

    var FTLNumber = function (_FTLBase2) {
      _inherits(FTLNumber, _FTLBase2);

      function FTLNumber(value, opts) {
        _classCallCheck(this, FTLNumber);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FTLNumber).call(this, parseFloat(value), opts));
      }

      _createClass(FTLNumber, [{
        key: 'toString',
        value: function toString(ctx) {
          var nf = ctx._memoizeIntlObject(Intl.NumberFormat, this.opts);
          return nf.format(this.value);
        }
      }]);

      return FTLNumber;
    }(FTLBase);

    var FTLDateTime = function (_FTLBase3) {
      _inherits(FTLDateTime, _FTLBase3);

      function FTLDateTime(value, opts) {
        _classCallCheck(this, FTLDateTime);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FTLDateTime).call(this, new Date(value), opts));
      }

      _createClass(FTLDateTime, [{
        key: 'toString',
        value: function toString(ctx) {
          var dtf = ctx._memoizeIntlObject(Intl.DateTimeFormat, this.opts);
          return dtf.format(this.value);
        }
      }]);

      return FTLDateTime;
    }(FTLBase);

    var FTLKeyword = function (_FTLBase4) {
      _inherits(FTLKeyword, _FTLBase4);

      function FTLKeyword() {
        _classCallCheck(this, FTLKeyword);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FTLKeyword).apply(this, arguments));
      }

      _createClass(FTLKeyword, [{
        key: 'toString',
        value: function toString() {
          var _value = this.value;
          var name = _value.name;
          var namespace = _value.namespace;

          return namespace ? namespace + ':' + name : name;
        }
      }, {
        key: 'match',
        value: function match(ctx, other) {
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
        }
      }]);

      return FTLKeyword;
    }(FTLBase);

    var FTLList = function (_Array) {
      _inherits(FTLList, _Array);

      function FTLList() {
        _classCallCheck(this, FTLList);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(FTLList).apply(this, arguments));
      }

      _createClass(FTLList, [{
        key: 'toString',
        value: function toString(ctx) {
          var lf = ctx._memoizeIntlObject(Intl.ListFormat // XXX add this.opts
          );
          var elems = this.map(function (elem) {
            return elem.toString(ctx);
          });
          return lf.format(elems);
        }
      }]);

      return FTLList;
    }(Array);

    // each builtin takes two arguments:
    //  - args = an array of positional args
    //  - opts  = an object of key-value args

    var builtins = {
      'NUMBER': function NUMBER(_ref, opts) {
        var _ref2 = _slicedToArray(_ref, 1);

        var arg = _ref2[0];
        return new FTLNumber(arg.valueOf(), merge(arg.opts, opts));
      },
      'PLURAL': function PLURAL(_ref3, opts) {
        var _ref4 = _slicedToArray(_ref3, 1);

        var arg = _ref4[0];
        return new FTLNumber(arg.valueOf(), merge(arg.opts, opts));
      },
      'DATETIME': function DATETIME(_ref5, opts) {
        var _ref6 = _slicedToArray(_ref5, 1);

        var arg = _ref6[0];
        return new FTLDateTime(arg.valueOf(), merge(arg.opts, opts));
      },
      'LIST': function LIST(args) {
        return FTLList.from(args);
      },
      'LEN': function LEN(_ref7) {
        var _ref8 = _slicedToArray(_ref7, 1);

        var arg = _ref8[0];
        return new FTLNumber(arg.valueOf().length);
      },
      'TAKE': function TAKE(_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2);

        var num = _ref10[0];
        var arg = _ref10[1];
        return FTLList.from(arg.valueOf().slice(0, num.value));
      },
      'DROP': function DROP(_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2);

        var num = _ref12[0];
        var arg = _ref12[1];
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

      _createClass(MessageContext, [{
        key: 'addMessages',
        value: function addMessages(source) {
          var _FTLRuntimeParser$par = FTLRuntimeParser.parseResource(source);

          var _FTLRuntimeParser$par2 = _slicedToArray(_FTLRuntimeParser$par, 2);

          var entries = _FTLRuntimeParser$par2[0];
          var errors = _FTLRuntimeParser$par2[1];

          for (var id in entries) {
            this.messages.set(id, entries[id]);
          }

          return errors;
        }

        // format `entity` to a string or null

      }, {
        key: 'formatToPrimitive',
        value: function formatToPrimitive(entity, args) {
          var result = _format(this, args, entity, optsPrimitive);
          return result[0] instanceof FTLNone ? [null, result[1]] : result;
        }

        // format `entity` to a string

      }, {
        key: 'format',
        value: function format(entity, args) {
          var result = _format(this, args, entity);
          return [result[0].toString(), result[1]];
        }
      }, {
        key: '_memoizeIntlObject',
        value: function _memoizeIntlObject(ctor, opts) {
          var cache = this.intls.get(ctor) || {};
          var id = JSON.stringify(opts);

          if (!cache[id]) {
            cache[id] = new ctor(this.lang, opts);
            this.intls.set(ctor, cache);
          }

          return cache[id];
        }
      }]);

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

    var LocalizationObserver = function (_Map) {
      _inherits(LocalizationObserver, _Map);

      function LocalizationObserver() {
        _classCallCheck(this, LocalizationObserver);

        var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(LocalizationObserver).call(this));

        _this8.rootsByLocalization = new WeakMap();
        _this8.localizationsByRoot = new WeakMap();
        _this8.observer = new MutationObserver(function (mutations) {
          return _this8.translateMutations(mutations);
        });
        return _this8;
      }

      _createClass(LocalizationObserver, [{
        key: 'handleEvent',
        value: function handleEvent() {
          return this.requestLanguages();
        }
      }, {
        key: 'requestLanguages',
        value: function requestLanguages(requestedLangs) {
          var _this9 = this;

          var localizations = Array.from(this.values());
          return Promise.all(localizations.map(function (l10n) {
            return l10n.requestLanguages(requestedLangs);
          })).then(function () {
            return _this9.translateAllRoots();
          });
        }
      }, {
        key: 'setAttributes',
        value: function setAttributes(element, id, args) {
          element.setAttribute('data-l10n-id', id);
          if (args) {
            element.setAttribute('data-l10n-args', JSON.stringify(args));
          }
          return element;
        }
      }, {
        key: 'getAttributes',
        value: function getAttributes(element) {
          return {
            id: element.getAttribute('data-l10n-id'),
            args: JSON.parse(element.getAttribute('data-l10n-args'))
          };
        }
      }, {
        key: 'observeRoot',
        value: function observeRoot(root) {
          var l10n = arguments.length <= 1 || arguments[1] === undefined ? this.get('main') : arguments[1];

          this.localizationsByRoot.set(root, l10n);
          if (!this.rootsByLocalization.has(l10n)) {
            this.rootsByLocalization.set(l10n, new Set());
          }
          this.rootsByLocalization.get(l10n).add(root);
          this.observer.observe(root, observerConfig);
        }
      }, {
        key: 'disconnectRoot',
        value: function disconnectRoot(root) {
          this.pause();
          this.localizationsByRoot.delete(root);
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _step8$value = _slicedToArray(_step8.value, 2);

              var name = _step8$value[0];
              var l10n = _step8$value[1];

              var roots = this.rootsByLocalization.get(l10n);
              if (roots && roots.has(root)) {
                roots.delete(root);
                if (roots.size === 0) {
                  this.delete(name);
                  this.rootsByLocalization.delete(l10n);
                }
              }
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }

          this.resume();
        }
      }, {
        key: 'pause',
        value: function pause() {
          this.observer.disconnect();
        }
      }, {
        key: 'resume',
        value: function resume() {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = this.values()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var l10n = _step9.value;

              if (this.rootsByLocalization.has(l10n)) {
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                  for (var _iterator10 = this.rootsByLocalization.get(l10n)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var root = _step10.value;

                    this.observer.observe(root, observerConfig);
                  }
                } catch (err) {
                  _didIteratorError10 = true;
                  _iteratorError10 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion10 && _iterator10.return) {
                      _iterator10.return();
                    }
                  } finally {
                    if (_didIteratorError10) {
                      throw _iteratorError10;
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9.return) {
                _iterator9.return();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        }
      }, {
        key: 'translateAllRoots',
        value: function translateAllRoots() {
          var _this10 = this;

          var localizations = Array.from(this.values());
          return Promise.all(localizations.map(function (l10n) {
            return _this10.translateRoots(l10n);
          }));
        }
      }, {
        key: 'translateRoots',
        value: function translateRoots(l10n) {
          var _this11 = this;

          if (!this.rootsByLocalization.has(l10n)) {
            return Promise.resolve();
          }

          var roots = Array.from(this.rootsByLocalization.get(l10n));
          return Promise.all(roots.map(function (root) {
            return _this11.translateRoot(root, l10n);
          }));
        }
      }, {
        key: 'translateRoot',
        value: function translateRoot(root) {
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
        }
      }, {
        key: 'translateMutations',
        value: function translateMutations(mutations) {
          var targets = new Set();

          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = mutations[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var mutation = _step11.value;

              switch (mutation.type) {
                case 'attributes':
                  targets.add(mutation.target);
                  break;
                case 'childList':
                  var _iteratorNormalCompletion12 = true;
                  var _didIteratorError12 = false;
                  var _iteratorError12 = undefined;

                  try {
                    for (var _iterator12 = mutation.addedNodes[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                      var addedNode = _step12.value;

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
                  } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                      }
                    } finally {
                      if (_didIteratorError12) {
                        throw _iteratorError12;
                      }
                    }
                  }

                  break;
              }
            }
          } catch (err) {
            _didIteratorError11 = true;
            _iteratorError11 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion11 && _iterator11.return) {
                _iterator11.return();
              }
            } finally {
              if (_didIteratorError11) {
                throw _iteratorError11;
              }
            }
          }

          if (targets.size === 0) {
            return;
          }

          this.translateElements(Array.from(targets));
        }
      }, {
        key: 'translateFragment',
        value: function translateFragment(frag) {
          return this.translateElements(this.getTranslatables(frag));
        }
      }, {
        key: 'translateElements',
        value: function translateElements(elements) {
          var _this13 = this;

          var elemsByL10n = this.groupElementsByLocalization(elements);
          return this.getElementsTranslation(elemsByL10n).then(function (translations) {
            return _this13.applyTranslations(elemsByL10n, translations);
          });
        }
      }, {
        key: 'applyTranslations',
        value: function applyTranslations(elemsByL10n, translationsByL10n) {
          this.pause();
          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = elemsByL10n[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _step13$value = _slicedToArray(_step13.value, 2);

              var l10n = _step13$value[0];
              var elems = _step13$value[1];

              var translations = translationsByL10n.get(l10n);
              for (var i = 0; i < elems.length; i++) {
                l10n.overlayElement(elems[i], translations[i]);
              }
            }
          } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
              }
            } finally {
              if (_didIteratorError13) {
                throw _iteratorError13;
              }
            }
          }

          this.resume();
        }
      }, {
        key: 'groupElementsByLocalization',
        value: function groupElementsByLocalization(elements) {
          var _this14 = this;

          return Array.from(elements).reduce(function (seq, elem) {
            var l10n = _this14.getLocalizationForElement(elem);
            var group = (seq.get(l10n) || []).concat(elem);
            return seq.set(l10n, group);
          }, new Map());
        }
      }, {
        key: 'getTranslatables',
        value: function getTranslatables(element) {
          var nodes = Array.from(element.querySelectorAll('[data-l10n-id]'));

          if (typeof element.hasAttribute === 'function' && element.hasAttribute('data-l10n-id')) {
            nodes.push(element);
          }

          return nodes;
        }
      }, {
        key: 'getLocalizationForElement',
        value: function getLocalizationForElement(elem) {
          return this.get(elem.getAttribute('data-l10n-bundle') || 'main');
        }
      }, {
        key: 'getKeysForElements',
        value: function getKeysForElements(elems) {
          return elems.map(function (elem) {
            var id = elem.getAttribute('data-l10n-id');
            var args = elem.getAttribute('data-l10n-args');

            return args ? [id, JSON.parse(args.replace(reHtml, function (match) {
              return htmlEntities[match];
            }))] : id;
          });
        }
      }, {
        key: 'getElementsTranslation',
        value: function getElementsTranslation(elemsByL10n) {
          var _this15 = this;

          return Promise.all(Array.from(elemsByL10n).map(function (_ref26) {
            var _ref27 = _slicedToArray(_ref26, 2);

            var l10n = _ref27[0];
            var elems = _ref27[1];
            return l10n.formatEntities(_this15.getKeysForElements(elems));
          })).then(function (translationsList) {
            return Array.from(elemsByL10n.keys()).reduce(function (seq, cur, idx) {
              return seq.set(cur, translationsList[idx]);
            }, new Map());
          });
        }
      }]);

      return LocalizationObserver;
    }(Map);

    var ContentLocalizationObserver = function (_LocalizationObserver) {
      _inherits(ContentLocalizationObserver, _LocalizationObserver);

      function ContentLocalizationObserver() {
        _classCallCheck(this, ContentLocalizationObserver);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ContentLocalizationObserver).apply(this, arguments));
      }

      _createClass(ContentLocalizationObserver, [{
        key: 'translateRootContent',
        value: function translateRootContent(root) {
          return this.translateFragment(root);
        }
      }]);

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

      _createClass(Localization, [{
        key: 'requestLanguages',
        value: function requestLanguages(requestedLangs) {
          var _this18 = this;

          return this.interactive.then(function (bundles) {
            return changeLanguages(_this18, bundles, requestedLangs);
          });
        }
      }, {
        key: 'formatWithFallback',
        value: function formatWithFallback(bundles, keys, method, prev) {
          var _this19 = this;

          var ctx = contexts.get(bundles[0]);

          if (!ctx) {
            return prev.map(function (tuple) {
              return tuple[0];
            });
          }

          var _keysFromContext = keysFromContext(ctx, keys, method, prev);

          var _keysFromContext2 = _slicedToArray(_keysFromContext, 2);

          var translations = _keysFromContext2[0];
          var errors = _keysFromContext2[1];


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
        }
      }, {
        key: 'formatEntities',
        value: function formatEntities(keys) {
          var _this20 = this;

          return this.interactive.then(function (bundles) {
            return _this20.formatWithFallback(bundles, keys, entityFromContext);
          });
        }
      }, {
        key: 'formatValues',
        value: function formatValues() {
          var _this21 = this;

          for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
            keys[_key] = arguments[_key];
          }

          return this.interactive.then(function (bundles) {
            return _this21.formatWithFallback(bundles, keys, valueFromContext);
          });
        }
      }, {
        key: 'formatValue',
        value: function formatValue(id, args) {
          return this.formatValues([id, args]).then(function (_ref30) {
            var _ref31 = _slicedToArray(_ref30, 1);

            var val = _ref31[0];
            return val;
          });
        }
      }]);

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

        return _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLLocalization).apply(this, arguments));
      }

      _createClass(HTMLLocalization, [{
        key: 'overlayElement',
        value: function overlayElement(element, translation) {
          return _overlayElement(this, element, translation);
        }

        // XXX the allowed list should be amendable; https://bugzil.la/922573

      }, {
        key: 'isElementAllowed',
        value: function isElementAllowed(element) {
          return allowed.elements.indexOf(element.tagName.toLowerCase()) !== -1;
        }
      }, {
        key: 'isAttrAllowed',
        value: function isAttrAllowed(attr, element) {
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
        }
      }]);

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

      _createClass(ResourceBundle, [{
        key: 'fetch',
        value: function fetch() {
          var _this23 = this;

          if (!this.loaded) {
            this.loaded = Promise.all(this.resIds.map(function (id) {
              return fetchResource(id, _this23.lang);
            }));
          }

          return this.loaded;
        }
      }]);

      return ResourceBundle;
    }();

    document.l10n = new ContentLocalizationObserver();
    window.addEventListener('languagechange', document.l10n);

    documentReady().then(function () {
      var _getMeta = getMeta(document.head);

      var defaultLang = _getMeta.defaultLang;
      var availableLangs = _getMeta.availableLangs;
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        for (var _iterator16 = getResourceLinks(document.head)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          var _step16$value = _slicedToArray(_step16.value, 2);

          var name = _step16$value[0];
          var resIds = _step16$value[1];

          if (!document.l10n.has(name)) {
            createLocalization(name, resIds, defaultLang, availableLangs);
          }
        }
      } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion16 && _iterator16.return) {
            _iterator16.return();
          }
        } finally {
          if (_didIteratorError16) {
            throw _iteratorError16;
          }
        }
      }
    });
  })();
}