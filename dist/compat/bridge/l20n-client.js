'use strict';

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
    var _getModule = getModule('bindings/html/overlay');

    var overlayElement = _getModule.overlayElement;

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

      for (var _iterator = mutations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var mutation = _ref;

        switch (mutation.type) {
          case 'attributes':
            targets.add(mutation.target);
            break;

          case 'childList':
            for (var _iterator2 = mutation.addedNodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
              var _ref2;

              if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
              } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
              }

              var addedNode = _ref2;

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

    function getDirection(code) {
      return ['ar', 'he', 'fa', 'ps', 'qps-plocm', 'ur'].indexOf(code) >= 0 ? 'rtl' : 'ltr';
    }

    return { documentReady: documentReady, getDirection: getDirection };
  });
  modules.set('bindings/html/view', function () {
    var _getModule2 = getModule('bindings/html/shims');

    var documentReady = _getModule2.documentReady;
    var getDirection = _getModule2.getDirection;

    var _getModule3 = getModule('bindings/html/dom');

    var setAttributes = _getModule3.setAttributes;
    var getAttributes = _getModule3.getAttributes;
    var _translateFragment = _getModule3.translateFragment;
    var translateMutations = _getModule3.translateMutations;
    var getResourceLinks = _getModule3.getResourceLinks;

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
        var _this = this;

        _classCallCheck(this, View);

        this._doc = doc;
        this.pseudo = {
          'qps-ploc': createPseudo(this, 'qps-ploc'),
          'qps-plocm': createPseudo(this, 'qps-plocm')
        };
        this._interactive = documentReady().then(function () {
          return init(_this, client);
        });
        var observer = new MutationObserver(onMutations.bind(this));

        this._observe = function () {
          return observer.observe(doc, observerConfig);
        };

        this._disconnect = function () {
          return observer.disconnect();
        };

        var translateView = function (langs) {
          return translateDocument(_this, langs);
        };

        client.on('translateDocument', translateView);
        this.ready = this._interactive.then(function (client) {
          return client.method('resolvedLanguages');
        }).then(translateView);
      }

      View.prototype.requestLanguages = function requestLanguages(langs, global) {
        return this._interactive.then(function (client) {
          return client.method('requestLanguages', langs, global);
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
        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        return this._interactive.then(function (client) {
          return client.method('formatValues', client.id, keys);
        });
      };

      View.prototype.translateFragment = function translateFragment(frag) {
        var _this2 = this;

        return this._interactive.then(function (client) {
          return client.method('resolvedLanguages');
        }).then(function (langs) {
          return _translateFragment(_this2, langs, frag);
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
      var _this3 = this;

      return this.resolvedLanguages().then(function (langs) {
        return translateMutations(_this3, langs, mutations);
      });
    }

    function translateDocument(view, langs) {
      var html = view._doc.documentElement;

      if (readiness.has(html)) {
        return _translateFragment(view, langs, html).then(function () {
          return setDOMAttrsAndEmit(html, langs);
        });
      }

      var translated = langs[0].code === html.getAttribute('lang') ? Promise.resolve() : _translateFragment(view, langs, html).then(function () {
        return setDOMAttrs(html, langs);
      });
      return translated.then(function () {
        return readiness.set(html, true);
      });
    }

    function setDOMAttrsAndEmit(html, langs) {
      setDOMAttrs(html, langs);
      html.parentNode.dispatchEvent(new CustomEvent('DOMRetranslated', {
        bubbles: false,
        cancelable: false
      }));
    }

    function setDOMAttrs(html, langs) {
      var codes = langs.map(function (lang) {
        return lang.code;
      });
      html.setAttribute('langs', codes.join(' '));
      html.setAttribute('lang', codes[0]);
      html.setAttribute('dir', getDirection(codes[0]));
    }

    return { View: View, translateDocument: translateDocument };
  });
  modules.set('runtime/bridge/bridge', function () {
    var Client = bridge.client;
    var Service = bridge.service;
    var channel = new BroadcastChannel('l20n-channel');

    function broadcast(type, data) {
      return this.service.broadcast(type, data);
    }

    return { Client: Client, Service: Service, channel: channel, broadcast: broadcast };
  });
  modules.set('runtime/bridge/client', function () {
    var _getModule4 = getModule('runtime/bridge/bridge');

    var Client = _getModule4.Client;
    var channel = _getModule4.channel;

    var _getModule5 = getModule('bindings/html/view');

    var View = _getModule5.View;

    var client = new Client({
      service: 'l20n',
      endpoint: channel,
      timeout: false
    });

    window.addEventListener('pageshow', function () {
      return client.connect();
    });
    window.addEventListener('pagehide', function () {
      return client.disconnect();
    });

    document.l10n = new View(client, document);

    navigator.mozL10n = {
      setAttributes: document.l10n.setAttributes,
      getAttributes: document.l10n.getAttributes,
      formatValue: function () {
        var _document$l10n;

        return (_document$l10n = document.l10n).formatValue.apply(_document$l10n, arguments);
      },
      translateFragment: function () {
        var _document$l10n2;

        return (_document$l10n2 = document.l10n).translateFragment.apply(_document$l10n2, arguments);
      },
      once: function (cb) {
        return document.l10n.ready.then(cb);
      },
      ready: function (cb) {
        return document.l10n.ready.then(function () {
          document.addEventListener('DOMRetranslated', cb);
          cb();
        });
      }
    };
  });
  getModule('runtime/bridge/client');
})(undefined);