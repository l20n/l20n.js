'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  'use strict';

  var Client = bridge.client;
  var channel = new BroadcastChannel('l20n-channel');

  var observerConfig = {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true,
    attributeFilter: ['data-l10n-id', 'data-l10n-args']
  };

  var observers = new WeakMap();

  function initMutationObserver(view) {
    observers.set(view, {
      roots: new Set(),
      observer: new MutationObserver(function (mutations) {
        return translateMutations(view, mutations);
      })
    });
  }

  function translateRoots(view) {
    var roots = Array.from(observers.get(view).roots);
    return Promise.all(roots.map(function (root) {
      return _translateFragment(view, root);
    }));
  }

  function observe(view, root) {
    var obs = observers.get(view);
    if (obs) {
      obs.roots.add(root);
      obs.observer.observe(root, observerConfig);
    }
  }

  function disconnect(view, root, allRoots) {
    var obs = observers.get(view);
    if (obs) {
      obs.observer.disconnect();
      if (allRoots) {
        return;
      }
      obs.roots.delete(root);
      obs.roots.forEach(function (other) {
        return obs.observer.observe(other, observerConfig);
      });
    }
  }

  function reconnect(view) {
    var obs = observers.get(view);
    if (obs) {
      obs.roots.forEach(function (root) {
        return obs.observer.observe(root, observerConfig);
      });
    }
  }

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
      if (isAttrAllowed({ name: attrName }, element)) {
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

  var reHtml = /[&<>]/g;
  var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

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

  function translateMutations(view, mutations) {
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

    translateElements(view, Array.from(targets));
  }

  function _translateFragment(view, frag) {
    return translateElements(view, getTranslatables(frag));
  }

  function getElementsTranslation(view, elems) {
    var keys = elems.map(function (elem) {
      var id = elem.getAttribute('data-l10n-id');
      var args = elem.getAttribute('data-l10n-args');
      return args ? [id, JSON.parse(args.replace(reHtml, function (match) {
        return htmlEntities[match];
      }))] : id;
    });

    return view.formatEntities.apply(view, keys);
  }

  function translateElements(view, elements) {
    return getElementsTranslation(view, elements).then(function (translations) {
      return applyTranslations(view, elements, translations);
    });
  }

  function applyTranslations(view, elems, translations) {
    disconnect(view, null, true);
    for (var i = 0; i < elems.length; i++) {
      overlayElement(elems[i], translations[i]);
    }
    reconnect(view);
  }

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
    var tag = code.split('-')[0];
    return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(tag) >= 0 ? 'rtl' : 'ltr';
  }

  if (navigator.languages === undefined) {
    navigator.languages = [navigator.language];
  }

  function getResourceLinks(head) {
    return Array.prototype.map.call(head.querySelectorAll('link[rel="localization"]'), function (el) {
      return el.getAttribute('href');
    });
  }

  function getMeta(head) {
    var availableLangs = Object.create(null);
    var defaultLang = null;
    var appVersion = null;

    var metas = Array.from(head.querySelectorAll('meta[name="availableLanguages"],' + 'meta[name="defaultLanguage"],' + 'meta[name="appVersion"]'));
    for (var _iterator3 = metas, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var meta = _ref3;

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
    return str.split(',').reduce(function (prevSeq, cur) {
      var _getLangRevisionTuple2 = getLangRevisionTuple(cur);

      var lang = _getLangRevisionTuple2[0];
      var rev = _getLangRevisionTuple2[1];

      prevSeq[lang] = rev;
      return prevSeq;
    }, seq);
  }

  function getLangRevisionTuple(str) {
    var _str$trim$split = str.trim().split(':');

    var lang = _str$trim$split[0];
    var rev = _str$trim$split[1];

    return [lang, parseInt(rev)];
  }

  var viewProps = new WeakMap();

  var View = (function () {
    function View(client, doc) {
      var _this = this;

      _classCallCheck(this, View);

      this.pseudo = {
        'fr-x-psaccent': createPseudo(this, 'fr-x-psaccent'),
        'ar-x-psbidi': createPseudo(this, 'ar-x-psbidi')
      };

      var initialized = documentReady().then(function () {
        return init(_this, client);
      });
      this._interactive = initialized.then(function () {
        return client;
      });
      this.ready = initialized.then(function (langs) {
        return translateView(_this, langs);
      });
      initMutationObserver(this);

      viewProps.set(this, {
        doc: doc,
        ready: false
      });

      client.on('languageschangerequest', function (requestedLangs) {
        return _this.requestLanguages(requestedLangs);
      });
    }

    View.prototype.requestLanguages = function requestLanguages(requestedLangs, isGlobal) {
      var _this2 = this;

      var method = isGlobal ? function (client) {
        return client.method('requestLanguages', requestedLangs);
      } : function (client) {
        return changeLanguages(_this2, client, requestedLangs);
      };
      return this._interactive.then(method);
    };

    View.prototype.handleEvent = function handleEvent() {
      return this.requestLanguages(navigator.languages);
    };

    View.prototype.formatEntities = function formatEntities() {
      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      return this._interactive.then(function (client) {
        return client.method('formatEntities', client.id, keys);
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
      return _translateFragment(this, frag);
    };

    View.prototype.observeRoot = function observeRoot(root) {
      observe(this, root);
    };

    View.prototype.disconnectRoot = function disconnectRoot(root) {
      disconnect(this, root);
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
    var doc = viewProps.get(view).doc;
    var resources = getResourceLinks(doc.head);
    var meta = getMeta(doc.head);
    view.observeRoot(doc.documentElement);
    return getAdditionalLanguages().then(function (additionalLangs) {
      return client.method('registerView', client.id, resources, meta, additionalLangs, navigator.languages);
    });
  }

  function changeLanguages(view, client, requestedLangs) {
    var doc = viewProps.get(view).doc;
    var meta = getMeta(doc.head);
    return getAdditionalLanguages().then(function (additionalLangs) {
      return client.method('changeLanguages', client.id, meta, additionalLangs, requestedLangs);
    }).then(function (_ref4) {
      var langs = _ref4.langs;
      var haveChanged = _ref4.haveChanged;
      return haveChanged ? translateView(view, langs) : undefined;
    });
  }

  function getAdditionalLanguages() {
    if (navigator.mozApps && navigator.mozApps.getAdditionalLanguages) {
      return navigator.mozApps.getAdditionalLanguages().catch(function () {
        return Object.create(null);
      });
    }

    return Promise.resolve(Object.create(null));
  }

  function translateView(view, langs) {
    var props = viewProps.get(view);
    var html = props.doc.documentElement;

    if (props.ready) {
      return translateRoots(view).then(function () {
        return setAllAndEmit(html, langs);
      });
    }

    var translated = langs[0].code === html.getAttribute('lang') ? Promise.resolve() : translateRoots(view).then(function () {
      return setLangDir(html, langs);
    });

    return translated.then(function () {
      setLangs(html, langs);
      props.ready = true;
    });
  }

  function setLangs(html, langs) {
    var codes = langs.map(function (lang) {
      return lang.code;
    });
    html.setAttribute('langs', codes.join(' '));
  }

  function setLangDir(html, langs) {
    var code = langs[0].code;
    html.setAttribute('lang', code);
    html.setAttribute('dir', getDirection(code));
  }

  function setAllAndEmit(html, langs) {
    setLangDir(html, langs);
    setLangs(html, langs);
    html.parentNode.dispatchEvent(new CustomEvent('DOMRetranslated', {
      bubbles: false,
      cancelable: false
    }));
  }

  var client = new Client({
    service: 'l20n',
    endpoint: channel,
    timeout: false
  });

  document.l10n = new View(client, document);

  window.addEventListener('pageshow', function () {
    return client.connect();
  });
  window.addEventListener('pagehide', function () {
    return client.disconnect();
  });
  window.addEventListener('languagechange', document.l10n);
  document.addEventListener('additionallanguageschange', document.l10n);

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
})();