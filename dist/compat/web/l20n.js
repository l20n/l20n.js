'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    /**
     * An `L10nError` with information about language and entity ID in which
     * the error happened.
     */


    var merge = function merge(argopts, opts) {
      return Object.assign({}, argopts, valuesOf(opts));
    };

    var valuesOf = function valuesOf(opts) {
      return Object.keys(opts).reduce(function (seq, cur) {
        return Object.assign({}, seq, _defineProperty({}, cur, opts[cur].valueOf()));
      }, {});
    };

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


    /**
     * Map an array of JavaScript values into FTL Values.
     *
     * Used for external arguments of Array type and for implicit Lists in
     * placeables.
     *
     * @private
     */
    var mapValues = function mapValues(env, arr) {
      var values = new FTLList();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var elem = _step.value;

          values.push(Value(env, elem));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return values;
    };

    /**
     * Helper for choosing the default value from a set of members.
     *
     * Used in SelectExpressions and Value.
     *
     * @private
     */


    var DefaultMember = function DefaultMember(env, members, def) {
      if (members[def]) {
        return members[def];
      }

      var errors = env.errors;

      errors.push(new RangeError('No default'));
      return new FTLNone();
    };

    /**
     * Resolve a reference to an entity to the entity object.
     *
     * @private
     */


    var EntityReference = function EntityReference(env, _ref11) {
      var name = _ref11.name;
      var ctx = env.ctx,
          errors = env.errors;

      var entity = ctx.messages.get(name);

      if (!entity) {
        errors.push(new ReferenceError('Unknown entity: ' + name));
        return new FTLNone(name);
      }

      return entity;
    };

    /**
     * Resolve a member expression to the member object.
     *
     * @private
     */


    var MemberExpression = function MemberExpression(env, _ref12) {
      var obj = _ref12.obj,
          key = _ref12.key;

      var entity = EntityReference(env, obj);
      if (entity instanceof FTLNone) {
        return entity;
      }

      var ctx = env.ctx,
          errors = env.errors;

      var keyword = Value(env, key);

      if (entity.traits) {
        // Match the specified key against keys of each trait, in order.
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = entity.traits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var member = _step2.value;

            var memberKey = Value(env, member.key);
            if (keyword.match(ctx, memberKey)) {
              return member;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      errors.push(new ReferenceError('Unknown trait: ' + keyword.toString(ctx)));
      return Value(env, entity);
    };

    /**
     * Resolve a select expression to the member object.
     *
     * @private
     */


    var SelectExpression = function SelectExpression(env, _ref13) {
      var exp = _ref13.exp,
          vars = _ref13.vars,
          def = _ref13.def;

      var selector = Value(env, exp);
      if (selector instanceof FTLNone) {
        return DefaultMember(env, vars, def);
      }

      // Match the selector against keys of each variant, in order.
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = vars[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var variant = _step3.value;

          var key = Value(env, variant.key);

          // XXX A special case of numbers to avoid code repetition in types.js.
          if (key instanceof FTLNumber && selector instanceof FTLNumber && key.valueOf() === selector.valueOf()) {
            return variant;
          }

          var ctx = env.ctx;


          if (key instanceof FTLKeyword && key.match(ctx, selector)) {
            return variant;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return DefaultMember(env, vars, def);
    };

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


    var Value = function Value(env, expr) {
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
        case 'ref':
          {
            var entity = EntityReference(env, expr);
            return Value(env, entity);
          }
        case 'mem':
          {
            var member = MemberExpression(env, expr);
            return Value(env, member);
          }
        case 'sel':
          {
            var _member = SelectExpression(env, expr);
            return Value(env, _member);
          }
        case undefined:
          {
            // If it's a node with a value, resolve the value.
            if (expr.val !== undefined) {
              return Value(env, expr.val);
            }

            var def = DefaultMember(env, expr.traits, expr.def);
            return Value(env, def);
          }
        default:
          return new FTLNone();
      }
    };

    /**
     * Resolve a reference to an external argument.
     *
     * @private
     */


    var ExternalArgument = function ExternalArgument(env, _ref14) {
      var name = _ref14.name;
      var args = env.args,
          errors = env.errors;


      if (!args || !args.hasOwnProperty(name)) {
        errors.push(new ReferenceError('Unknown external: ' + name));
        return new FTLNone(name);
      }

      var arg = args[name];

      if (arg instanceof FTLType) {
        return arg;
      }

      // Convert the argument to an FTL type.
      switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
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
          errors.push(new TypeError('Unsupported external type: ' + name + ', ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg))));
          return new FTLNone(name);
      }
    };

    /**
     * Resolve a reference to a function.
     *
     * @private
     */


    var FunctionReference = function FunctionReference(env, _ref15) {
      var name = _ref15.name;

      // Some functions are built-in.  Others may be provided by the runtime via
      // the `MessageContext` constructor.
      var functions = env.ctx.functions,
          errors = env.errors;

      var func = functions[name] || builtins[name];

      if (!func) {
        errors.push(new ReferenceError('Unknown function: ' + name + '()'));
        return new FTLNone(name + '()');
      }

      if (typeof func !== 'function') {
        errors.push(new TypeError('Function ' + name + '() is not callable'));
        return new FTLNone(name + '()');
      }

      return func;
    };

    /**
     * Resolve a call to a Function with positional and key-value arguments.
     *
     * @private
     */


    var CallExpression = function CallExpression(env, _ref16) {
      var name = _ref16.name,
          args = _ref16.args;

      var callee = FunctionReference(env, name);

      if (callee instanceof FTLNone) {
        return callee;
      }

      var posargs = [];
      var keyargs = [];

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = args[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var arg = _step4.value;

          if (arg.type === 'kv') {
            keyargs[arg.name] = Value(env, arg.val);
          } else {
            posargs.push(Value(env, arg));
          }
        }

        // XXX functions should also report errors
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return callee(posargs, keyargs);
    };

    /**
     * Resolve a pattern (a complex string with placeables).
     *
     * @private
     */


    var Pattern = function Pattern(env, ptn) {
      var ctx = env.ctx,
          dirty = env.dirty,
          errors = env.errors;


      if (dirty.has(ptn)) {
        errors.push(new RangeError('Cyclic reference'));
        return new FTLNone();
      }

      // Tag the pattern as dirty for the purpose of the current resolution.
      dirty.add(ptn);
      var result = '';

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = ptn[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var part = _step5.value;

          if (typeof part === 'string') {
            result += part;
          } else {
            // Optimize the most common case: the placeable only has one expression.
            // Otherwise map its expressions to Values.
            var value = part.length === 1 ? Value(env, part[0]) : mapValues(env, part);

            var str = value.toString(ctx);

            if (str.length > MAX_PLACEABLE_LENGTH) {
              errors.push(new RangeError('Too many characters in placeable ' + ('(' + str.length + ', max allowed is ' + MAX_PLACEABLE_LENGTH + ')')));
              str = str.substr(0, MAX_PLACEABLE_LENGTH);
            }

            if (ctx.useIsolating) {
              result += '' + FSI + str + PDI;
            } else {
              result += str;
            }
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      dirty.delete(ptn);
      return result;
    };

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


    var resolve = function resolve(ctx, args, entity) {
      var errors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

      var env = {
        ctx: ctx, args: args, errors: errors, dirty: new WeakSet()
      };
      return Value(env, entity);
    };

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


    var prioritizeLocales = function prioritizeLocales(def, availableLangs, requested) {
      var supportedLocales = new Set();
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = requested[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var lang = _step6.value;

          if (availableLangs.has(lang)) {
            supportedLocales.add(lang);
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
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

    /**
     * Create a `MessageContext` for the first bundle in the fallback chain.
     *
     * Fetches the bundle's resources and creates a context from them.
     *
     * @param   {Array<ResourceBundle>} bundle
     * @param   {Function}              createContext
     * @returns {Promise<MessageContext>}
     * @private
     */
    var createHeadContextWith = function createHeadContextWith(createContext, bundles) {
      var _bundles = _slicedToArray(bundles, 1),
          bundle = _bundles[0];

      if (!bundle) {
        return Promise.resolve(null);
      }

      return bundle.fetch().then(function (resources) {
        var ctx = createContext(bundle.lang);
        resources
        // Filter out resources which failed to load correctly (e.g. 404).
        .filter(function (res) {
          return res !== null;
        }).forEach(function (res) {
          return ctx.addMessages(res);
        });
        // Save the reference to the context.
        contexts.set(bundle, ctx);
        return ctx;
      });
    };

    /**
     *
     * Test if two fallback chains are functionally the same.
     *
     * @param   {Array<ResourceBundle>} bundles1
     * @param   {Array<ResourceBundle>} bundles2
     * @returns {boolean}
     * @private
     */


    var equal = function equal(bundles1, bundles2) {
      return bundles1.length === bundles2.length && bundles1.every(function (_ref22, i) {
        var lang = _ref22.lang;
        return lang === bundles2[i].lang;
      });
    };

    /**
     * @private
     *
     * This function is an inner function for `Localization.formatWithFallback`.
     *
     * It takes a `MessageContext`, list of l10n-ids and a method to be used for
     * key resolution (either `valueFromContext` or `entityFromContext`) and
     * optionally a value returned from `keysFromContext` executed against
     * another `MessageContext`.
     *
     * The idea here is that if the previous `MessageContext` did not resolve
     * all keys, we're calling this function with the next context to resolve
     * the remaining ones.
     *
     * In the function, we loop oer `keys` and check if we have the `prev`
     * passed and if it has an error entry for the position we're in.
     *
     * If it doesn't, it means that we have a good translation for this key and
     * we return it. If it does, we'll try to resolve the key using the passed
     * `MessageContext`.
     *
     * In the end, we return an Object with resolved translations, errors and
     * a boolean indicating if there were any errors found.
     *
     * The translations are either strings, if the method is `valueFromContext`
     * or objects with value and attributes if the method is `entityFromContext`.
     *
     * See `Localization.formatWithFallback` for more info on how this is used.
     *
     * @param {MessageContext} ctx
     * @param {Array<string>}  keys
     * @param {Function}       method
     * @param {{
     *   errors: Array<Error>,
     *   withoutFatal: Array<boolean>,
     *   hasFatalErrors: boolean,
     *   translations: Array<string>|Array<{value: string, attrs: Object}>}} prev
     *
     * @returns {{
     *   errors: Array<Error>,
     *   withoutFatal: Array<boolean>,
     *   hasFatalErrors: boolean,
     *   translations: Array<string>|Array<{value: string, attrs: Object}>}}
     */


    var keysFromContext = function keysFromContext(method, sanitizeArgs, ctx, keys, prev) {
      var entityErrors = [];
      var result = {
        errors: new Array(keys.length),
        withoutFatal: new Array(keys.length),
        hasFatalErrors: false
      };

      result.translations = keys.map(function (key, i) {
        // Use a previously formatted good value if it had no errors.
        if (prev && !prev.errors[i]) {
          return prev.translations[i];
        }

        // Clear last entity's errors.
        entityErrors.length = 0;
        var args = sanitizeArgs(key[1]);
        var translation = method(ctx, entityErrors, key[0], args);

        // No errors still? Use this translation as fallback to the previous one
        // which had errors.
        if (entityErrors.length === 0) {
          return translation;
        }

        // The rest of this function handles the scenario in which the translation
        // was formatted with errors.  Copy the errors to the result object so that
        // the Localization can handle them (e.g. console.warn about them).
        result.errors[i] = entityErrors.slice();

        // Formatting errors are not fatal and the translations are usually still
        // usable and can be good fallback values.  Fatal errors should signal to
        // the Localization that another fallback should be loaded.
        if (!entityErrors.some(isL10nError)) {
          result.withoutFatal[i] = true;
        } else if (!result.hasFatalErrors) {
          result.hasFatalErrors = true;
        }

        // Use the previous translation for this `key` even if it had formatting
        // errors.  This is usually closer the user's preferred language anyways.
        if (prev && prev.withoutFatal[i]) {
          // Mark this previous translation as a good potential fallback value in
          // case of further fallbacks.
          result.withoutFatal[i] = true;
          return prev.translations[i];
        }

        // If no good or almost good previous translation is available, return the
        // current translation.  In case of minor errors it's a partially
        // formatted translation.  In the worst-case scenario it an identifier of
        // the requested entity.
        return translation;
      });

      return result;
    };

    /**
     * @private
     *
     * Test if an error is an instance of L10nError.
     *
     * @param   {Error}   error
     * @returns {boolean}
     */


    var isL10nError = function isL10nError(error) {
      return error instanceof L10nError;
    };

    // Match the opening angle bracket (<) in HTML tags, and HTML entities like
    // &amp;, &#0038;, &#x0026;.


    /**
     * Overlay translation onto a DOM element.
     *
     * @param   {Element}      element
     * @param   {string}       translation
     * @private
     */
    var overlayElement = function overlayElement(element, translation) {
      var value = translation.value;

      if (typeof value === 'string') {
        if (!reOverlay.test(value)) {
          // If the translation doesn't contain any markup skip the overlay logic.
          element.textContent = value;
        } else {
          // Else start with an inert template element and move its children into
          // `element` but such that `element`'s own children are not replaced.
          var tmpl = element.ownerDocument.createElementNS('http://www.w3.org/1999/xhtml', 'template');
          tmpl.innerHTML = value;
          // Overlay the node with the DocumentFragment.
          overlay(element, tmpl.content);
        }
      }

      if (translation.attrs === null) {
        return;
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = translation.attrs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 3),
              ns = _step7$value[0],
              name = _step7$value[1],
              val = _step7$value[2];

          if (DOM_NAMESPACES[ns] === element.namespaceURI && isAttrAllowed({ name: name }, element)) {
            element.setAttribute(name, val);
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


    var overlay = function overlay(sourceElement, translationElement) {
      var result = translationElement.ownerDocument.createDocumentFragment();
      var k = void 0,
          attr = void 0;

      // Take one node from translationElement at a time and check it against
      // the allowed list or try to match it with a corresponding element
      // in the source.
      var childElement = void 0;
      while (childElement = translationElement.childNodes[0]) {
        translationElement.removeChild(childElement);

        if (childElement.nodeType === childElement.TEXT_NODE) {
          result.appendChild(childElement);
          continue;
        }

        var index = getIndexOfType(childElement);
        var sourceChild = getNthElementOfType(sourceElement, childElement, index);
        if (sourceChild) {
          // There is a corresponding element in the source, let's use it.
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

        // Otherwise just take this child's textContent.
        result.appendChild(translationElement.ownerDocument.createTextNode(childElement.textContent));
      }

      // Clear `sourceElement` and append `result` which by this time contains
      // `sourceElement`'s original children, overlayed with translation.
      sourceElement.textContent = '';
      sourceElement.appendChild(result);

      // If we're overlaying a nested element, translate the allowed
      // attributes; top-level attributes are handled in `overlayElement`.
      // XXX Attributes previously set here for another language should be
      // cleared if a new language doesn't use them; https://bugzil.la/922577
      if (translationElement.attributes) {
        for (k = 0, attr; attr = translationElement.attributes[k]; k++) {
          if (isAttrAllowed(attr, sourceElement)) {
            sourceElement.setAttribute(attr.name, attr.value);
          }
        }
      }
    };

    /**
     * Check if element is allowed in the translation.
     *
     * This method is used by the sanitizer when the translation markup contains
     * an element which is not present in the source code.
     *
     * @param   {Element} element
     * @returns {boolean}
     * @private
     */


    var isElementAllowed = function isElementAllowed(element) {
      var allowed = ALLOWED_ELEMENTS[element.namespaceURI];
      if (!allowed) {
        return false;
      }

      return allowed.indexOf(element.tagName.toLowerCase()) !== -1;
    };

    /**
     * Check if attribute is allowed for the given element.
     *
     * This method is used by the sanitizer when the translation markup contains
     * DOM attributes, or when the translation has traits which map to DOM
     * attributes.
     *
     * @param   {{name: string}} attr
     * @param   {Element}        element
     * @returns {boolean}
     * @private
     */


    var isAttrAllowed = function isAttrAllowed(attr, element) {
      var allowed = ALLOWED_ATTRIBUTES[element.namespaceURI];
      if (!allowed) {
        return false;
      }

      var attrName = attr.name.toLowerCase();
      var elemName = element.tagName.toLowerCase();

      // Is it a globally safe attribute?
      if (allowed.global.indexOf(attrName) !== -1) {
        return true;
      }

      // Are there no allowed attributes for this element?
      if (!allowed[elemName]) {
        return false;
      }

      // Is it allowed on this element?
      if (allowed[elemName].indexOf(attrName) !== -1) {
        return true;
      }

      // Special case for value on HTML inputs with type button, reset, submit
      if (element.namespaceURI === 'http://www.w3.org/1999/xhtml' && elemName === 'input' && attrName === 'value') {
        var type = element.type.toLowerCase();
        if (type === 'submit' || type === 'button' || type === 'reset') {
          return true;
        }
      }

      return false;
    };

    // Get n-th immediate child of context that is of the same type as element.
    // XXX Use querySelector(':scope > ELEMENT:nth-of-type(index)'), when:
    // 1) :scope is widely supported in more browsers and 2) it works with
    // DocumentFragments.


    var getNthElementOfType = function getNthElementOfType(context, element, index) {
      var nthOfType = 0;
      for (var i = 0, child; child = context.children[i]; i++) {
        if (child.nodeType === child.ELEMENT_NODE && child.tagName.toLowerCase() === element.tagName.toLowerCase()) {
          if (nthOfType === index) {
            return child;
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

    // A regexp to sanitize HTML tags and entities.


    var load = function load(url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        if (xhr.overrideMimeType) {
          xhr.overrideMimeType('text/plain');
        }

        xhr.open('GET', url, true);

        xhr.addEventListener('load', function (e) {
          if (e.target.status === HTTP_STATUS_CODE_OK || e.target.status === 0) {
            resolve(e.target.responseText);
          } else {
            reject(new Error(url + ' not found'));
          }
        });

        xhr.addEventListener('error', function () {
          return reject(new Error(url + ' failed to load'));
        });
        xhr.addEventListener('timeout', function () {
          return reject(new Error(url + ' timed out'));
        });

        xhr.send(null);
      });
    };

    var fetchResource = function fetchResource(res, lang) {
      var url = res.replace('{locale}', lang);
      return load(url).catch(function () {
        return null;
      });
    };

    // A document.ready shim
    // https://github.com/whatwg/html/issues/127
    var documentReady = function documentReady() {
      var rs = document.readyState;
      if (rs === 'interactive' || rs === 'completed') {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        return document.addEventListener('readystatechange', resolve, { once: true });
      });
    };

    var getResourceLinks = function getResourceLinks(elem) {
      return Array.prototype.map.call(elem.querySelectorAll('link[rel="localization"]'), function (el) {
        return [el.getAttribute('href'), el.getAttribute('name') || 'main'];
      }).reduce(function (seq, _ref23) {
        var _ref24 = _slicedToArray(_ref23, 2),
            href = _ref24[0],
            name = _ref24[1];

        return seq.set(name, (seq.get(name) || []).concat(href));
      }, new Map());
    };

    var getMeta = function getMeta(head) {
      var availableLangs = new Set();
      var defaultLang = null;
      var appVersion = null;

      // XXX take last found instead of first?
      var metas = Array.from(head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]'));
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = metas[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var meta = _step11.value;

          var name = meta.getAttribute('name');
          var content = meta.getAttribute('content').trim();
          switch (name) {
            case 'availableLanguages':
              availableLangs = new Set(content.split(',').map(function (lang) {
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

      return {
        defaultLang: defaultLang,
        availableLangs: availableLangs,
        appVersion: appVersion
      };
    };

    // This function is provided to the constructor of `Localization` object and is
    // used to create new `MessageContext` objects for a given `lang` with selected
    // builtin functions.


    var createContext = function createContext(lang) {
      return new Intl.MessageContext(lang);
    };

    // Called for every named Localization declared via <link name=…> elements.


    var createLocalization = function createLocalization(defaultLang, availableLangs, resIds, name) {
      // This function is called by `Localization` class to retrieve an array of
      // `ResourceBundle`s.
      function requestBundles() {
        var requestedLangs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set(navigator.languages);

        var newLangs = prioritizeLocales(defaultLang, availableLangs, requestedLangs);

        var bundles = Array.from(newLangs, function (lang) {
          return new ResourceBundle(lang, resIds);
        });

        return Promise.resolve(bundles);
      }

      if (name === 'main') {
        document.l10n = new DocumentLocalization(requestBundles, createContext);
        document.l10n.ready = documentReady().then(function () {
          document.l10n.connectRoot(document.documentElement);
          return document.l10n.translateDocument();
        }).then(function () {
          window.addEventListener('languagechange', document.l10n);
        });
      } else {
        // Pass the main Localization, `document.l10n`, as the observer.
        var l10n = new DOMLocalization(requestBundles, createContext, name, document.l10n);
        // Add this Localization as a delegate of the main one.
        document.l10n.delegates.set(name, l10n);
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

    /*  eslint no-magic-numbers: [0]  */

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
        if (n % 1 !== 0) {
          return 'other';
        }
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

        var _this = _possibleConstructorReturn(this, (L10nError.__proto__ || Object.getPrototypeOf(L10nError)).call(this));

        _this.name = 'L10nError';
        _this.message = message;
        _this.id = id;
        _this.lang = lang;
        return _this;
      }

      return L10nError;
    }(Error);

    /*  eslint no-magic-numbers: [0]  */

    var MAX_PLACEABLES = 100;

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

    var EntriesParser = function () {
      function EntriesParser() {
        _classCallCheck(this, EntriesParser);
      }

      _createClass(EntriesParser, [{
        key: 'getResource',

        /**
         * @param {string} string
         * @returns {{}, []]}
         */
        value: function getResource(string) {
          this._source = string;
          this._index = 0;
          this._length = string.length;

          // This variable is used for error recovery and reporting.
          this._lastGoodEntryEnd = 0;

          var entries = {};
          var errors = [];

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
      }, {
        key: 'getEntry',
        value: function getEntry(entries) {
          // The pointer here should either be at the beginning of the file
          // or right after new line.
          if (this._index !== 0 && this._source[this._index - 1] !== '\n') {
            throw this.error('Expected new line and a new entry');
          }

          var ch = this._source[this._index];

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
        value: function getEntity(entries) {
          var id = this.getIdentifier();

          this.getLineWS();

          var ch = this._source[this._index];

          if (ch !== '=') {
            throw this.error('Expected "=" after Entity ID');
          }

          this._index++;

          this.getLineWS();

          var val = this.getPattern();

          ch = this._source[this._index];

          // In the scenario when the pattern is quote-delimited
          // the pattern ends with the closing quote.
          if (ch === '\n') {
            this._index++;
            this.getLineWS();
            ch = this._source[this._index];
          }

          if (ch === '[' && this._source[this._index + 1] !== '[' || ch === '*') {

            var members = this.getMembers();
            entries[id] = {
              traits: members[0],
              def: members[1],
              val: val
            };
          } else if (typeof val === 'string') {
            entries[id] = val;
          } else if (val === undefined) {
            throw this.error('Expected a value (like: " = value") or a trait (like: "[key] value")');
          } else {
            entries[id] = {
              val: val
            };
          }
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
          var start = this._index;
          var cc = this._source.charCodeAt(this._index);

          if (cc >= 97 && cc <= 122 || // a-z
          cc >= 65 && cc <= 90 || // A-Z
          cc === 95) {
            // _
            cc = this._source.charCodeAt(++this._index);
          } else {
            throw this.error('Expected an identifier (starting with [a-zA-Z_])');
          }

          while (cc >= 97 && cc <= 122 || // a-z
          cc >= 65 && cc <= 90 || // A-Z
          cc >= 48 && cc <= 57 || // 0-9
          cc === 95 || cc === 45) {
            // _-
            cc = this._source.charCodeAt(++this._index);
          }

          return this._source.slice(start, this._index);
        }
      }, {
        key: 'getKeyword',
        value: function getKeyword() {
          var name = '';
          var namespace = this.getIdentifier();

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

          // If we encountered the end of name, we want to test is the last
          // collected character is a space.
          // If it is, we will backtrack to the last non-space character because
          // the keyword cannot end with a space character.
          while (this._source.charCodeAt(this._index - 1) === 32) {
            this._index--;
          }

          name += this._source.slice(start, this._index);

          return namespace ? { type: 'kw', ns: namespace, name: name } : { type: 'kw', name: name };
        }

        // We're going to first try to see if the pattern is simple.
        // If it is a simple, not quote-delimited string,
        // we can just look for the end of the line and read the string.
        //
        // Then, if either the line contains a placeable opening `{` or the
        // next line starts with a pipe `|`, we switch to complex pattern.

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

          var line = start !== eol ? this._source.slice(start, eol) : undefined;

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

      }, {
        key: 'getComplexPattern',
        value: function getComplexPattern() {
          var buffer = '';
          var content = [];
          var placeables = 0;

          // We actually use all three possible states of this variable:
          // true and false indicate if we're within a quote-delimited string
          // null indicates that the string is not quote-delimited
          var quoteDelimited = null;
          var firstLine = true;

          var ch = this._source[this._index];

          // If the string starts with \", \{ or \\ skip the first `\` and add the
          // following character to the buffer without interpreting it.
          if (ch === '\\' && (this._source[this._index + 1] === '"' || this._source[this._index + 1] === '{' || this._source[this._index + 1] === '\\')) {
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
              // Push the buffer to content array right before placeable
              if (buffer.length) {
                content.push(buffer);
              }
              if (placeables > MAX_PLACEABLES - 1) {
                throw this.error('Too many placeables, maximum allowed is ' + MAX_PLACEABLES);
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

      }, {
        key: 'getPlaceable',
        value: function getPlaceable() {
          this._index++;

          var expressions = [];

          this.getLineWS();

          while (this._index < this._length) {
            var start = this._index;
            try {
              expressions.push(this.getPlaceableExpression());
            } catch (e) {
              throw this.error(e.description, start);
            }
            var ch = this._source[this._index];
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
      }, {
        key: 'getPlaceableExpression',
        value: function getPlaceableExpression() {
          var selector = this.getCallExpression();
          var members = void 0;

          this.getWS();

          var ch = this._source[this._index];

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

          if (exp.type === 'ref') {
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

            var exp = this.getCallExpression();

            // EntityReference in this place may be an entity reference, like:
            // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
            if (exp.type !== 'ref' || exp.namespace !== undefined) {
              args.push(exp);
            } else {
              this.getLineWS();

              if (this._source[this._index] === ':') {
                this._index++;
                this.getLineWS();

                var val = this.getCallExpression();

                // If the expression returned as a value of the argument
                // is not a quote delimited string, number or
                // external argument, throw an error.
                //
                // We don't have to check here if the pattern is quote delimited
                // because that's the only type of string allowed in expressions.
                if (typeof val === 'string' || Array.isArray(val) || val.type === 'num' || val.type === 'ext') {
                  args.push({
                    type: 'kv',
                    name: exp.name,
                    val: val
                  });
                } else {
                  this._index = this._source.lastIndexOf(':', this._index) + 1;
                  throw this.error('Expected string in quotes, number or external argument');
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
      }, {
        key: 'getNumber',
        value: function getNumber() {
          var num = '';
          var cc = this._source.charCodeAt(this._index);

          // The number literal may start with negative sign `-`.
          if (cc === 45) {
            num += '-';
            cc = this._source.charCodeAt(++this._index);
          }

          // next, we expect at least one digit
          if (cc < 48 || cc > 57) {
            throw this.error('Unknown literal "' + num + '"');
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
              throw this.error('Unknown literal "' + num + '"');
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
      }, {
        key: 'getMemberExpression',
        value: function getMemberExpression() {
          var exp = this.getLiteral();

          // the obj element of the member expression
          // must be either an entity reference or another member expression.
          while (['ref', 'mem'].includes(exp.type) && this._source[this._index] === '[') {
            var keyword = this.getMemberKey();
            exp = {
              type: 'mem',
              key: keyword,
              obj: exp
            };
          }

          return exp;
        }
      }, {
        key: 'getMembers',
        value: function getMembers() {
          var members = [];
          var index = 0;
          var defaultIndex = void 0;

          while (this._index < this._length) {
            var ch = this._source[this._index];

            if ((ch !== '[' || this._source[this._index + 1] === '[') && ch !== '*') {
              break;
            }
            if (ch === '*') {
              this._index++;
              defaultIndex = index;
            }

            if (this._source[this._index] !== '[') {
              throw this.error('Expected "["');
            }

            var key = this.getMemberKey();

            this.getLineWS();

            var member = {
              key: key,
              val: this.getPattern()
            };
            members[index++] = member;

            this.getWS();
          }

          return [members, defaultIndex];
        }

        // MemberKey may be a Keyword or Number

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

        // At runtime, we don't care about comments so we just have
        // to parse them properly and skip their content.

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
          var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          var pos = this._index;

          if (start === null) {
            start = pos;
          }
          start = this._findEntityStart(start);

          var context = this._source.slice(start, pos + 10);

          var msg = '\n\n  ' + message + '\nat pos ' + pos + ':\n------\n\u2026' + context + '\n------';
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
            var cc = this._source.charCodeAt(start + 1);

            if (cc >= 97 && cc <= 122 || // a-z
            cc >= 65 && cc <= 90 || // A-Z
            cc === 95) {
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
              var cc = this._source.charCodeAt(start);

              if (cc >= 97 && cc <= 122 || // a-z
              cc >= 65 && cc <= 90 || // A-Z
              cc === 95 || cc === 35 || cc === 91) {
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

      return EntriesParser;
    }();

    var FTLRuntimeParser = {
      parseResource: function parseResource(string) {
        var parser = new EntriesParser();
        return parser.getResource(string);
      }
    };

    /**
     * The `FTLType` class is the base of FTL's type system.
     *
     * FTL types wrap JavaScript values and store additional configuration for
     * them, which can then be used in the `toString` method together with a proper
     * `Intl` formatter.
     */

    var FTLType = function () {

      /**
       * Create an `FTLType` instance.
       *
       * @param   {Any}    value - JavaScript value to wrap.
       * @param   {Object} opts  - Configuration.
       * @returns {FTLType}
       */
      function FTLType(value, opts) {
        _classCallCheck(this, FTLType);

        this.value = value;
        this.opts = opts;
      }

      /**
       * Get the JavaScript value wrapped by this `FTLType` instance.
       *
       * @returns {Any}
       */


      _createClass(FTLType, [{
        key: 'valueOf',
        value: function valueOf() {
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

      }, {
        key: 'toString',
        value: function toString(ctx) {
          return this.value.toString(ctx);
        }
      }]);

      return FTLType;
    }();

    var FTLNone = function (_FTLType) {
      _inherits(FTLNone, _FTLType);

      function FTLNone() {
        _classCallCheck(this, FTLNone);

        return _possibleConstructorReturn(this, (FTLNone.__proto__ || Object.getPrototypeOf(FTLNone)).apply(this, arguments));
      }

      _createClass(FTLNone, [{
        key: 'toString',
        value: function toString() {
          return this.value || '???';
        }
      }]);

      return FTLNone;
    }(FTLType);

    var FTLNumber = function (_FTLType2) {
      _inherits(FTLNumber, _FTLType2);

      function FTLNumber(value, opts) {
        _classCallCheck(this, FTLNumber);

        return _possibleConstructorReturn(this, (FTLNumber.__proto__ || Object.getPrototypeOf(FTLNumber)).call(this, parseFloat(value), opts));
      }

      _createClass(FTLNumber, [{
        key: 'toString',
        value: function toString(ctx) {
          var nf = ctx._memoizeIntlObject(Intl.NumberFormat, this.opts);
          return nf.format(this.value);
        }
      }]);

      return FTLNumber;
    }(FTLType);

    var FTLDateTime = function (_FTLType3) {
      _inherits(FTLDateTime, _FTLType3);

      function FTLDateTime(value, opts) {
        _classCallCheck(this, FTLDateTime);

        return _possibleConstructorReturn(this, (FTLDateTime.__proto__ || Object.getPrototypeOf(FTLDateTime)).call(this, new Date(value), opts));
      }

      _createClass(FTLDateTime, [{
        key: 'toString',
        value: function toString(ctx) {
          var dtf = ctx._memoizeIntlObject(Intl.DateTimeFormat, this.opts);
          return dtf.format(this.value);
        }
      }]);

      return FTLDateTime;
    }(FTLType);

    var FTLKeyword = function (_FTLType4) {
      _inherits(FTLKeyword, _FTLType4);

      function FTLKeyword() {
        _classCallCheck(this, FTLKeyword);

        return _possibleConstructorReturn(this, (FTLKeyword.__proto__ || Object.getPrototypeOf(FTLKeyword)).apply(this, arguments));
      }

      _createClass(FTLKeyword, [{
        key: 'toString',
        value: function toString() {
          var _value = this.value,
              name = _value.name,
              namespace = _value.namespace;

          return namespace ? namespace + ':' + name : name;
        }
      }, {
        key: 'match',
        value: function match(ctx, other) {
          var _value2 = this.value,
              name = _value2.name,
              namespace = _value2.namespace;

          if (other instanceof FTLKeyword) {
            return name === other.value.name && namespace === other.value.namespace;
          } else if (namespace) {
            return false;
          } else if (typeof other === 'string') {
            return name === other;
          } else if (other instanceof FTLNumber) {
            var pr = ctx._memoizeIntlObject(Intl.PluralRules, other.opts);
            return name === pr.select(other.valueOf());
          }
          return false;
        }
      }]);

      return FTLKeyword;
    }(FTLType);

    var FTLList = function (_Array) {
      _inherits(FTLList, _Array);

      function FTLList() {
        _classCallCheck(this, FTLList);

        return _possibleConstructorReturn(this, (FTLList.__proto__ || Object.getPrototypeOf(FTLList)).apply(this, arguments));
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
      'NUMBER': function NUMBER(_ref, opts) {
        var _ref2 = _slicedToArray(_ref, 1),
            arg = _ref2[0];

        return new FTLNumber(arg.valueOf(), merge(arg.opts, opts));
      },
      'DATETIME': function DATETIME(_ref3, opts) {
        var _ref4 = _slicedToArray(_ref3, 1),
            arg = _ref4[0];

        return new FTLDateTime(arg.valueOf(), merge(arg.opts, opts));
      },
      'LIST': function LIST(args) {
        return FTLList.from(args);
      },
      'LEN': function LEN(_ref5) {
        var _ref6 = _slicedToArray(_ref5, 1),
            arg = _ref6[0];

        return new FTLNumber(arg.valueOf().length);
      },
      'TAKE': function TAKE(_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            num = _ref8[0],
            arg = _ref8[1];

        return FTLList.from(arg.valueOf().slice(0, num.value));
      },
      'DROP': function DROP(_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            num = _ref10[0],
            arg = _ref10[1];

        return FTLList.from(arg.valueOf().slice(num.value));
      }
    };

    var MAX_PLACEABLE_LENGTH = 2500;

    // Unicode bidi isolation characters.
    var FSI = '\u2068';
    var PDI = '\u2069';
    var MessageContext = function () {

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
      function MessageContext(lang) {
        var _ref17 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref17$functions = _ref17.functions,
            functions = _ref17$functions === undefined ? {} : _ref17$functions,
            _ref17$useIsolating = _ref17.useIsolating,
            useIsolating = _ref17$useIsolating === undefined ? true : _ref17$useIsolating;

        _classCallCheck(this, MessageContext);

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


      _createClass(MessageContext, [{
        key: 'addMessages',
        value: function addMessages(source) {
          var _FTLRuntimeParser$par = FTLRuntimeParser.parseResource(source),
              _FTLRuntimeParser$par2 = _slicedToArray(_FTLRuntimeParser$par, 2),
              entries = _FTLRuntimeParser$par2[0],
              errors = _FTLRuntimeParser$par2[1];

          for (var id in entries) {
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

      }, {
        key: 'format',
        value: function format(entity, args, errors) {
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

          var result = resolve(this, args, entity, errors);
          return result instanceof FTLNone ? null : result;
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

    var properties = new WeakMap();
    var contexts = new WeakMap();

    /**
     * The `Localization` class is responsible for fetching resources and
     * formatting translations.
     *
     * It implements the fallback strategy in case of errors encountered during the
     * formatting of translations.
     *
     * In HTML and XUL, l20n.js will create an instance of `Localization` for the
     * default set of `<link rel="localization">` elements.  You can get
     * a reference to it via:
     *
     *     const localization = document.l10n.get('main');
     *
     * Different names can be specified via the `name` attribute on the `<link>`
     * elements.  One `document` can have more than one `Localization` instance,
     * but one `Localization` instance can only be assigned to a single `document`.
     */

    var Localization = function () {

      /**
       * Create an instance of the `Localization` class.
       *
       * The instance's configuration is provided by two runtime-dependent
       * functions passed to the constructor.
       *
       * The `requestBundles` function takes an array of language codes and returns
       * a Promise of an array of lazy `ResourceBundle` instances.  The
       * `Localization` instance will imediately call the `fetch` method of the
       * first bundle returned by `requestBundles` and may call `fetch` on
       * subsequent bundles in fallback scenarios.
       *
       * The array of bundles is the de-facto current fallback chain of languages
       * and fetch locations.
       *
       * The `createContext` function takes a language code and returns an instance
       * of `Intl.MessageContext`.  Since it's also provided to the constructor by
       * the runtime it may pass runtime-specific `functions` to the
       * `MessageContext` instances it creates.
       *
       * @param   {Function}     requestBundles
       * @param   {Function}     createContext
       * @returns {Localization}
       */
      function Localization(requestBundles, createContext) {
        _classCallCheck(this, Localization);

        var createHeadContext = function createHeadContext(bundles) {
          return createHeadContextWith(createContext, bundles);
        };

        // Keep `requestBundles` and `createHeadContext` private.
        properties.set(this, {
          requestBundles: requestBundles, createHeadContext: createHeadContext
        });

        /**
         * A Promise which resolves when the `Localization` instance has fetched
         * and parsed all localization resources in the user's first preferred
         * language (if available).
         *
         *     localization.interactive.then(callback);
         */
        this.interactive = requestBundles().then(
        // Create a `MessageContext` for the first bundle right away.
        function (bundles) {
          return createHeadContext(bundles).then(
          // Force `this.interactive` to resolve to the list of bundles.
          function () {
            return bundles;
          });
        });
      }

      /**
       * Initiate the change of the currently negotiated languages.
       *
       * `requestLanguages` takes an array of language codes representing user's
       * updated language preferences.
       *
       * @param   {Array<string>}     requestedLangs
       * @returns {Promise<Array<ResourceBundle>>}
       */


      _createClass(Localization, [{
        key: 'requestLanguages',
        value: function requestLanguages(requestedLangs) {
          var _properties$get = properties.get(this),
              requestBundles = _properties$get.requestBundles,
              createHeadContext = _properties$get.createHeadContext;

          // Assign to `this.interactive` to make all translations requested after
          // the language change request come from the new fallback chain.


          return this.interactive = Promise.all(
          // Get the current bundles to be able to compare them to the new result
          // of the language negotiation.
          [this.interactive, requestBundles(requestedLangs)]).then(function (_ref18) {
            var _ref19 = _slicedToArray(_ref18, 2),
                oldBundles = _ref19[0],
                newBundles = _ref19[1];

            if (equal(oldBundles, newBundles)) {
              return oldBundles;
            }

            return createHeadContext(newBundles).then(function () {
              return newBundles;
            });
          });
        }

        /**
         * Format translations and handle fallback if needed.
         *
         * Format translations for `keys` from `MessageContext` instances
         * corresponding to the current bundles.  In case of errors, fetch the next
         * bundle in the fallback chain, create a context for it, and recursively
         * call `formatWithFallback` again.
         *
         * @param   {Array<ResourceBundle>} bundles - Current bundles.
         * @param   {Array<Array>}          keys    - Translation keys to format.
         * @param   {Function}              method  - Formatting function.
         * @param   {Array<string>}         [prev]  - Previous translations.
         * @returns {Array<string> | Promise<Array<string>>}
         * @private
         */

      }, {
        key: 'formatWithFallback',
        value: function formatWithFallback(bundles, ctx, keys, method, prev) {
          var _this7 = this;

          // If a context for the head bundle doesn't exist we've reached the last
          // bundle in the fallback chain.  This is the end condition which returns
          // the translations formatted during the previous (recursive) calls to
          // `formatWithFallback`.
          if (!ctx) {
            return prev.translations;
          }

          var current = keysFromContext(method, this.sanitizeArgs, ctx, keys, prev);

          // In Gecko `console` needs to imported explicitly.
          if (typeof console !== 'undefined') {
            // The `errors` property is an array of arrays, each containing all
            // errors encountered for the translation at the same position in `keys`.
            // If there were no errors for a given translation, `errors` will contain
            // an `undefined` instead of the array of errors.  Most translations are
            // simple string which don't produce errors.
            current.errors.forEach(function (errs) {
              return errs ? errs.forEach(function (e) {
                return console.warn(e);
              } // eslint-disable-line no-console
              ) : null;
            });
          }

          // `hasFatalErrors` is a flag set by `keysFromContext` to notify about
          // errors during the formatting.  We can't just check the `length` of the
          // `errors` property because it is fixed and equal to the length of `keys`.
          if (!current.hasFatalErrors) {
            return current.translations;
          }

          // At this point we need to fetch the next bundle in the fallback chain and
          // create a `MessageContext` instance for it.
          var tailBundles = bundles.slice(1);

          var _properties$get2 = properties.get(this),
              createHeadContext = _properties$get2.createHeadContext;

          return createHeadContext(tailBundles).then(function (next) {
            return _this7.formatWithFallback(tailBundles, next, keys, method, current);
          });
        }

        /**
         * Format translations into {value, attrs} objects.
         *
         * This is an internal method used by `LocalizationObserver` instances.  The
         * fallback logic is the same as in `formatValues` but the argument type is
         * stricter (an array of arrays) and it returns {value, attrs} objects which
         * are suitable for the translation of DOM elements.
         *
         *     document.l10n.formatEntities([j
         *       ['hello', { who: 'Mary' }],
         *       ['welcome', undefined]
         *     ]).then(console.log);
         *
         *     // [
         *     //   { value: 'Hello, Mary!', attrs: null },
         *     //   { value: 'Welcome!', attrs: { title: 'Hello' } }
         *     // ]
         *
         * Returns a Promise resolving to an array of the translation strings.
         *
         * @param   {Array<Array>} keys
         * @returns {Promise<Array<{value: string, attrs: Object}>>}
         * @private
         */

      }, {
        key: 'formatEntities',
        value: function formatEntities(keys) {
          var _this8 = this;

          return this.interactive.then(function (bundles) {
            return _this8.formatWithFallback(bundles, contexts.get(bundles[0]), keys, _this8.entityFromContext);
          });
        }

        /**
         * Retrieve translations corresponding to the passed keys.
         *
         * A generalized version of `Localization.formatValue`.  Keys can either be
         * simple string identifiers or `[id, args]` arrays.
         *
         *     document.l10n.formatValues(
         *       ['hello', { who: 'Mary' }],
         *       ['hello', { who: 'John' }],
         *       'welcome'
         *     ).then(console.log);
         *
         *     // ['Hello, Mary!', 'Hello, John!', 'Welcome!']
         *
         * Returns a Promise resolving to an array of the translation strings.
         *
         * @param   {...(Array | string)} keys
         * @returns {Promise<Array<string>>}
         */

      }, {
        key: 'formatValues',
        value: function formatValues() {
          var _this9 = this;

          for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
            keys[_key] = arguments[_key];
          }

          // Convert string keys into arrays that `formatWithFallback` expects.
          var keyTuples = keys.map(function (key) {
            return Array.isArray(key) ? key : [key, null];
          });
          return this.interactive.then(function (bundles) {
            return _this9.formatWithFallback(bundles, contexts.get(bundles[0]), keyTuples, _this9.valueFromContext);
          });
        }

        /**
         * Retrieve the translation corresponding to the `id` identifier.
         *
         * If passed, `args` is a simple hash object with a list of variables that
         * will be interpolated in the value of the translation.
         *
         *     localization.formatValue(
         *       'hello', { who: 'world' }
         *     ).then(console.log);
         *
         *     // 'Hello, world!'
         *
         * Returns a Promise resolving to the translation string.
         *
         * Use this sparingly for one-off messages which don't need to be
         * retranslated when the user changes their language preferences, e.g. in
         * notifications.
         *
         * @param   {string}  id     - Identifier of the translation to format
         * @param   {Object}  [args] - Optional external arguments
         * @returns {Promise<string>}
         */

      }, {
        key: 'formatValue',
        value: function formatValue(id, args) {
          return this.formatValues([id, args]).then(function (_ref20) {
            var _ref21 = _slicedToArray(_ref20, 1),
                val = _ref21[0];

            return val;
          });
        }

        /**
         * Sanitize external arguments.
         *
         * Subclasses of `Localization` can override this method to provide
         * environment-specific sanitization of arguments passed into translations.
         *
         * @param   {Object} args
         * @returns {Object}
         * @private
         */

      }, {
        key: 'sanitizeArgs',
        value: function sanitizeArgs(args) {
          return args;
        }

        /**
         * Format all public values of a message into a { value, attrs } object.
         *
         * This function is passed as a method to `keysFromContext` and resolve
         * a single L10n Entity using provided `MessageContext`.
         *
         * The function will return an object with a value and attributes of the
         * entity.
         *
         * If the function fails to retrieve the entity, the value is set to the ID of
         * an entity, and attrs to `null`. If formatting fails, it will return
         * a partially resolved value and attributes.
         *
         * In both cases, an error is being added to the errors array.
         *
         * Subclasses of `Localization` can override this method to provide
         * environment-specific formatting behavior.
         *
         * @param   {MessageContext} ctx
         * @param   {Array<Error>}   errors
         * @param   {String}         id
         * @param   {Object}         args
         * @returns {Object}
         * @private
         */

      }, {
        key: 'entityFromContext',
        value: function entityFromContext(ctx, errors, id, args) {
          var entity = ctx.messages.get(id);

          if (entity === undefined) {
            errors.push(new L10nError('Unknown entity: ' + id));
            return { value: id, attrs: null };
          }

          var formatted = {
            value: ctx.format(entity, args, errors),
            attrs: null
          };

          if (entity.traits) {
            formatted.attrs = [];
            for (var i = 0, trait; trait = entity.traits[i]; i++) {
              if (!trait.key.hasOwnProperty('ns')) {
                continue;
              }
              var attr = ctx.format(trait, args, errors);
              if (attr !== null) {
                formatted.attrs.push([trait.key.ns, trait.key.name, attr]);
              }
            }
          }

          return formatted;
        }

        /**
         * Format the value of a message into a string.
         *
         * This function is passed as a method to `keysFromContext` and resolve
         * a value of a single L10n Entity using provided `MessageContext`.
         *
         * If the function fails to retrieve the entity, it will return an ID of it.
         * If formatting fails, it will return a partially resolved entity.
         *
         * In both cases, an error is being added to the errors array.
         *
         * Subclasses of `Localization` can override this method to provide
         * environment-specific formatting behavior.
         *
         * @param   {MessageContext} ctx
         * @param   {Array<Error>}   errors
         * @param   {string}         id
         * @param   {Object}         args
         * @returns {string}
         * @private
         */

      }, {
        key: 'valueFromContext',
        value: function valueFromContext(ctx, errors, id, args) {
          var entity = ctx.messages.get(id);

          if (entity === undefined) {
            errors.push(new L10nError('Unknown entity: ' + id));
            return id;
          }

          return ctx.format(entity, args, errors);
        }
      }]);

      return Localization;
    }();

    var reOverlay = /<|&#?\w+;/;

    // XXX The allowed list should be amendable; https://bugzil.la/922573.
    var ALLOWED_ELEMENTS = {
      'http://www.w3.org/1999/xhtml': ['a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr']
    };

    var ALLOWED_ATTRIBUTES = {
      'http://www.w3.org/1999/xhtml': {
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
      },
      'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul': {
        global: ['accesskey', 'aria-label', 'aria-valuetext', 'aria-moz-hint', 'label'],
        key: ['key', 'keycode'],
        textbox: ['placeholder'],
        toolbarbutton: ['tooltiptext']
      }
    };

    var DOM_NAMESPACES = {
      'html': 'http://www.w3.org/1999/xhtml',
      'xul': 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    };var reHtml = /[&<>]/g;
    var htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    /**
     * The `DOMLocalization` class localizes DOM trees.
     */

    var DOMLocalization = function (_Localization) {
      _inherits(DOMLocalization, _Localization);

      /**
       * @param   {Function}             requestBundles
       * @param   {Function}             createContext
       * @param   {string}               name
       * @param   {DocumentLocalization} [observer]
       * @returns {DOMLocalization}
       */
      function DOMLocalization(requestBundles, createContext, name, observer) {
        _classCallCheck(this, DOMLocalization);

        var _this10 = _possibleConstructorReturn(this, (DOMLocalization.__proto__ || Object.getPrototypeOf(DOMLocalization)).call(this, requestBundles, createContext));

        _this10.name = name;
        _this10.query = '[data-l10n-with=' + name + ']';
        _this10.roots = new Set();
        _this10.observer = observer;
        return _this10;
      }

      _createClass(DOMLocalization, [{
        key: 'handleEvent',
        value: function handleEvent() {
          return this.requestLanguages();
        }

        /**
         * Trigger the language negotation process with an array of language codes.
         * Returns a promise with the negotiated array of language objects as above.
         *
         * ```javascript
         * localization.requestLanguages(['de-DE', 'de', 'en-US']);
         * ```
         *
         * @param   {Array<string>} requestedLangs - array of requested languages
         * @returns {Promise<Array<string>>}
         */

      }, {
        key: 'requestLanguages',
        value: function requestLanguages(requestedLangs) {
          var _this11 = this;

          _get(DOMLocalization.prototype.__proto__ || Object.getPrototypeOf(DOMLocalization.prototype), 'requestLanguages', this).call(this, requestedLangs).then(function () {
            return _this11.translateRoots();
          });
        }

        /**
         * Set the `data-l10n-id` and `data-l10n-args` attributes on DOM elements.
         * L20n makes use of mutation observers to detect changes to `data-l10n-*`
         * attributes and translate elements asynchronously.  `setAttributes` is
         * a convenience method which allows to translate DOM elements declaratively.
         *
         * You should always prefer to use `data-l10n-id` on elements (statically in
         * HTML or dynamically via `setAttributes`) over manually retrieving
         * translations with `format`.  The use of attributes ensures that the
         * elements can be retranslated when the user changes their language
         * preferences.
         *
         * ```javascript
         * localization.setAttributes(
         *   document.querySelector('#welcome'), 'hello', { who: 'world' }
         * );
         * ```
         *
         * This will set the following attributes on the `#welcome` element.  L20n's
         * MutationObserver will pick up this change and will localize the element
         * asynchronously.
         *
         * ```html
         * <p id='welcome'
         *   data-l10n-id='hello'
         *   data-l10n-args='{"who": "world"}'>
         * </p>
         *
         * @param {Element}             element - Element to set attributes on
         * @param {string}                  id      - l10n-id string
         * @param {Object<string, string>} args    - KVP list of l10n arguments
         * ```
         */

      }, {
        key: 'setAttributes',
        value: function setAttributes(element, id, args) {
          element.setAttribute('data-l10n-id', id);
          if (args) {
            element.setAttribute('data-l10n-args', JSON.stringify(args));
          }
          return element;
        }

        /**
         * Get the `data-l10n-*` attributes from DOM elements.
         *
         * ```javascript
         * localization.getAttributes(
         *   document.querySelector('#welcome')
         * );
         * // -> { id: 'hello', args: { who: 'world' } }
         * ```
         *
         * @param   {Element}  element - HTML element
         * @returns {{id: string, args: Object}}
         */

      }, {
        key: 'getAttributes',
        value: function getAttributes(element) {
          return {
            id: element.getAttribute('data-l10n-id'),
            args: JSON.parse(element.getAttribute('data-l10n-args'))
          };
        }

        /**
         * Add `root` to the list of roots managed by this `DOMLocalization`.
         *
         * Additionally, if this `DOMLocalization` has an observer, start observing
         * `root` in order to translate mutations in it.
         *
         * @param {Element}      root - Root to observe.
         */

      }, {
        key: 'connectRoot',
        value: function connectRoot(root) {
          this.roots.add(root);

          if (this.observer) {
            this.observer.observeRoot(root);
          }
        }

        /**
         * Remove `root` from the list of roots managed by this `DOMLocalization`.
         *
         * Additionally, if this `DOMLocalization` has an observer, stop observing
         * `root`.
         *
         * Returns `true` if the root was the last one managed by this
         * `DOMLocalization`.
         *
         * @param   {Element} root - Root to disconnect.
         * @returns {boolean}
         */

      }, {
        key: 'disconnectRoot',
        value: function disconnectRoot(root) {
          this.roots.delete(root);

          if (this.observer) {
            this.observer.unobserveRoot(root);
          }

          return this.roots.size === 0;
        }

        /**
         * Translate all roots associated with this `DOMLocalization`.
         *
         * @returns {Promise}
         */

      }, {
        key: 'translateRoots',
        value: function translateRoots() {
          var _this12 = this;

          var roots = Array.from(this.roots);
          return Promise.all(roots.map(function (root) {
            return _this12.translateRoot(root);
          }));
        }

        /**
         * Translate `root`.
         *
         * This is similar to `translateFragment` but it will also set the `lang` and
         * `dir` attribute on `root`.  In XUL documents, the anonymous content
         * attached to `root` will also be translated.
         *
         * @returns {Promise}
         */

      }, {
        key: 'translateRoot',
        value: function translateRoot(root) {
          var _this13 = this;

          return this.translateRootContent(root).then(function () {
            return _this13.interactive;
          }).then(function (bundles) {
            var langs = bundles.map(function (bundle) {
              return bundle.lang;
            });
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
          });
        }
      }, {
        key: 'translateRootContent',
        value: function translateRootContent(root) {
          var _this14 = this;

          var anonChildren = document.getAnonymousNodes ? document.getAnonymousNodes(root) : null;
          if (!anonChildren) {
            return this.translateFragment(root);
          }

          return Promise.all([root].concat(_toConsumableArray(anonChildren)).map(function (node) {
            return _this14.translateFragment(node);
          }));
        }

        /**
         * Translate a DOM element or fragment asynchronously.
         *
         * Manually trigger the translation (or re-translation) of a DOM fragment.
         * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
         * with information about which translations to use.  Only elements with
         * `data-l10n-with` attribute matching this `DOMLocalization`'s name will be
         * translated.
         *
         * Returns a `Promise` that gets resolved once the translation is complete.
         *
         * @param   {DOMFragment} frag - DOMFragment to be translated
         * @returns {Promise}
         */

      }, {
        key: 'translateFragment',
        value: function translateFragment(frag) {
          return this.translateElements(this.getTranslatables(frag));
        }
      }, {
        key: 'translateElements',
        value: function translateElements(elements) {
          var _this15 = this;

          if (!elements.length) {
            return Promise.resolve([]);
          }

          var keys = elements.map(this.getKeysForElement);
          return this.formatEntities(keys).then(function (translations) {
            return _this15.applyTranslations(elements, translations);
          });
        }

        /**
         * Translate a single DOM element asynchronously.
         *
         * The element's `data-l10n-with` must match this `DOMLocalization`'s name.
         *
         * Returns a `Promise` that gets resolved once the translation is complete.
         *
         * @param   {Element} element - HTML element to be translated
         * @returns {Promise}
         */

      }, {
        key: 'translateElement',
        value: function translateElement(element) {
          var _this16 = this;

          return this.formatEntities([this.getKeysForElement(element)]).then(function (translations) {
            return _this16.applyTranslations([element], translations);
          });
        }
      }, {
        key: 'applyTranslations',
        value: function applyTranslations(elements, translations) {
          if (this.observer) {
            this.observer.pauseObserving();
          }

          for (var i = 0; i < elements.length; i++) {
            overlayElement(elements[i], translations[i]);
          }

          if (this.observer) {
            this.observer.resumeObserving();
          }
        }
      }, {
        key: 'getTranslatables',
        value: function getTranslatables(element) {
          var nodes = Array.from(element.querySelectorAll(this.query));

          if (typeof element.hasAttribute === 'function' && element.hasAttribute('data-l10n-id')) {
            var elemBundleName = element.getAttribute('data-l10n-with');
            if (elemBundleName === this.name) {
              nodes.push(element);
            }
          }

          return nodes;
        }
      }, {
        key: 'getKeysForElement',
        value: function getKeysForElement(element) {
          return [element.getAttribute('data-l10n-id'),
          // In XUL documents missing attributes return `''` here which breaks
          // JSON.parse.  HTML documents return `null`.
          JSON.parse(element.getAttribute('data-l10n-args') || null)];
        }

        /**
         * Sanitize arguments.
         *
         * Escape HTML tags and entities in string-typed arguments.
         *
         * @param   {Object} args
         * @returns {Object}
         * @private
         */

      }, {
        key: 'sanitizeArgs',
        value: function sanitizeArgs(args) {
          for (var name in args) {
            var arg = args[name];
            if (typeof arg === 'string') {
              args[name] = arg.replace(reHtml, function (match) {
                return htmlEntities[match];
              });
            }
          }
          return args;
        }
      }]);

      return DOMLocalization;
    }(Localization);

    /**
     * The `DocumentLocalization` class localizes DOM documents.
     *
     * A sublcass of `DOMLocalization`, it implements methods for observing DOM
     * trees with a `MutationObserver`.  It can delegate the translation of DOM
     * elements marked with `data-l10n-with` to other named `DOMLocalizations`.
     *
     * Each `document` will have its corresponding `DocumentLocalization` instance
     * created automatically on startup, as `document.l10n`.
     */


    var DocumentLocalization = function (_DOMLocalization) {
      _inherits(DocumentLocalization, _DOMLocalization);

      /**
       * @returns {DocumentLocalization}
       */
      function DocumentLocalization(requestBundles, createContext) {
        _classCallCheck(this, DocumentLocalization);

        // Localize elements with no explicit `data-l10n-with` too.
        var _this17 = _possibleConstructorReturn(this, (DocumentLocalization.__proto__ || Object.getPrototypeOf(DocumentLocalization)).call(this, requestBundles, createContext, 'main'));
        // There can be only one `DocumentLocalization` per document and it's
        // always called 'main'.


        _this17.query = '[data-l10n-with="main"], [data-l10n-id]:not([data-l10n-with])';

        // A map of named delegate `DOMLocalization` objects.
        _this17.delegates = new Map();

        // Used by `DOMLocalization` when connecting/disconnecting roots and for
        // pausing the `MutationObserver` when translations are applied to the DOM.
        // `DocumentLocalization` is its own observer because it implements
        // `observeRoot`, `unobserveRoot`, `pauseObserving` and `resumeObserving`.
        _this17.observer = _this17;

        // A Set of DOM trees observed by the `MutationObserver`.
        _this17.observedRoots = new Set();
        _this17.mutationObserver = new MutationObserver(function (mutations) {
          return _this17.translateMutations(mutations);
        });

        _this17.observerConfig = {
          attributes: true,
          characterData: false,
          childList: true,
          subtree: true,
          attributeFilter: ['data-l10n-id', 'data-l10n-args', 'data-l10n-with']
        };
        return _this17;
      }

      /**
       * Trigger the language negotation process for this `DocumentLocalization`
       * and any `DOMLocalization` objects which it can delegate to.
       *
       * Returns a promise which resolves to an array of arrays of negotiated
       * languages for each `Localization` available in the current document.
       *
       * ```javascript
       * document.l10n.requestLanguages(['de-DE', 'de', 'en-US']);
       * ```
       *
       * @param   {Array<string>} requestedLangs - array of requested languages
       * @returns {Promise<Array<Array<string>>>}
       */


      _createClass(DocumentLocalization, [{
        key: 'requestLanguages',
        value: function requestLanguages(requestedLangs) {
          var _this18 = this;

          var requests = [_get(DocumentLocalization.prototype.__proto__ || Object.getPrototypeOf(DocumentLocalization.prototype), 'requestLanguages', this).call(this, requestedLangs)].concat(Array.from(this.delegates.values(), function (delegate) {
            return delegate.requestLanguages(requestedLangs);
          }));

          return Promise.all(requests).then(function () {
            return _this18.translateDocument();
          });
        }

        /**
         * Starting observing `root` with the `MutationObserver`.
         *
         * @private
         */

      }, {
        key: 'observeRoot',
        value: function observeRoot(root) {
          this.observedRoots.add(root);
          this.mutationObserver.observe(root, this.observerConfig);
        }

        /**
         * Stop observing `root` with the `MutationObserver`.
         *
         * @private
         */

      }, {
        key: 'unobserveRoot',
        value: function unobserveRoot(root) {
          this.observedRoots.delete(root);
          // Pause and resume the mutation observer to stop observing `root`.
          this.pauseObserving();
          this.resumeObserving();
        }

        /**
         * Pauses the `MutationObserver`.
         *
         * @private
         */

      }, {
        key: 'pauseObserving',
        value: function pauseObserving() {
          this.mutationObserver.disconnect();
        }

        /**
         * Resumes the `MutationObserver`.
         *
         * @private
         */

      }, {
        key: 'resumeObserving',
        value: function resumeObserving() {
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = this.observedRoots[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var root = _step8.value;

              this.mutationObserver.observe(root, this.observerConfig);
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
        }

        /**
         * Translate mutations detected by the `MutationObserver`.
         *
         * The elements in the mutations can use `data-l10n-with` to specify which
         * `DOMLocalization` should be used for translating them.
         *
         * @private
         */

      }, {
        key: 'translateMutations',
        value: function translateMutations(mutations) {
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = mutations[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var mutation = _step9.value;

              switch (mutation.type) {
                case 'attributes':
                  this.translateElement(mutation.target);
                  break;
                case 'childList':
                  var _iteratorNormalCompletion10 = true;
                  var _didIteratorError10 = false;
                  var _iteratorError10 = undefined;

                  try {
                    for (var _iterator10 = mutation.addedNodes[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                      var addedNode = _step10.value;

                      if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
                        if (addedNode.childElementCount) {
                          this.translateFragment(addedNode);
                        } else if (addedNode.hasAttribute('data-l10n-id')) {
                          this.translateElement(addedNode);
                        }
                      }
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

                  break;
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

        /**
         * Triggers translation of all roots associated with this
         * `DocumentLocalization` and any `DOMLocalization` objects which it can
         * delegate to.
         *
         * Returns a `Promise` which is resolved once all translations are
         * completed.
         *
         * @returns {Promise}
         */

      }, {
        key: 'translateDocument',
        value: function translateDocument() {
          var localizations = [this].concat(_toConsumableArray(this.delegates.values()));
          return Promise.all(localizations.map(function (l10n) {
            return l10n.translateRoots();
          }));
        }

        /**
         * Translate a DOM element or fragment asynchronously using this
         * `DocumentLocalization` and any `DOMLocalization` objects which it can
         * delegate to.
         *
         * Manually trigger the translation (or re-translation) of a DOM fragment.
         * Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
         * with information about which translations to use.  Only elements with
         * `data-l10n-with` attribute matching this `DOMLocalization`'s name will be
         * translated.
         *
         * If `frag` or its descendants use `data-l10n-with`, the specific named
         * `DOMLocalization` will be used to translate it.  As a special case,
         * elements without `data-l10n-with` will be localized using this
         * `DocumentLocalization` (as if they had `data-l10n-with="main"`).
         *
         * Returns a `Promise` that gets resolved once the translation is complete.
         *
         * @param   {DOMFragment} frag - Element or DocumentFragment to be translated
         * @returns {Promise}
         */

      }, {
        key: 'translateFragment',
        value: function translateFragment(frag) {
          var requests = [_get(DocumentLocalization.prototype.__proto__ || Object.getPrototypeOf(DocumentLocalization.prototype), 'translateFragment', this).call(this, frag)].concat(Array.from(this.delegates.values(), function (delegate) {
            return delegate.translateFragment(frag);
          }));

          return Promise.all(requests);
        }

        /**
         * Translate a single DOM element asynchronously using this
         * `DocumentLocalization` or any `DOMLocalization` objects which it can
         * delegate to.
         *
         * If `element` uses `data-l10n-with`, the specific named `DOMLocalization`
         * will be used to translate it.  As a special case, an element without
         * `data-l10n-with` will be localized using this `DocumentLocalization` (as
         * if it had `data-l10n-with="main"`).
         *
         * Returns a `Promise` that gets resolved once the translation is complete.
         *
         * @param   {Element} element - HTML element to be translated
         * @returns {Promise}
         */

      }, {
        key: 'translateElement',
        value: function translateElement(element) {
          var name = element.getAttribute('data-l10n-with');

          var l10n = void 0;
          if (!name || name === 'main') {
            l10n = this;
          } else if (this.delegates.has(name)) {
            l10n = this.delegates.get(name);
          } else {
            var err = new L10nError('Unknown Localization: ' + name + '.');
            return Promise.reject(err);
          }

          return l10n.formatEntities([l10n.getKeysForElement(element)]).then(function (translations) {
            return l10n.applyTranslations([element], translations);
          });
        }
      }, {
        key: 'getTranslatables',
        value: function getTranslatables(element) {
          var nodes = Array.from(element.querySelectorAll(this.query));

          if (typeof element.hasAttribute === 'function' && element.hasAttribute('data-l10n-id')) {
            var elemBundleName = element.getAttribute('data-l10n-with');
            if (!elemBundleName || elemBundleName === this.name) {
              nodes.push(element);
            }
          }

          return nodes;
        }
      }]);

      return DocumentLocalization;
    }(DOMLocalization);

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
          var _this19 = this;

          if (!this.loaded) {
            this.loaded = Promise.all(this.resIds.map(function (resId) {
              return fetchResource(resId, _this19.lang);
            }));
          }

          return this.loaded;
        }
      }]);

      return ResourceBundle;
    }();

    var _getMeta = getMeta(document.head),
        defaultLang = _getMeta.defaultLang,
        availableLangs = _getMeta.availableLangs;

    // Collect all l10n resource links and create `Localization` objects. The
    // 'main' Localization must be declared as the first one.


    getResourceLinks(document.head).forEach(function (resIds, name) {
      return createLocalization(defaultLang, availableLangs, resIds, name);
    });
  })();
}