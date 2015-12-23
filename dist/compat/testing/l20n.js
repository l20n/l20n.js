'use strict';

(function () {
  'use strict';

  var observerConfig = {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true,
    attributeFilter: ['data-l10n-id', 'data-l10n-args']
  };

  var observers = new WeakMap();

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

  function translateFragment(view, frag) {
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

  var dom = {
    setAttributes: setAttributes,
    getAttributes: getAttributes,
    translateMutations: translateMutations,
    translateFragment: translateFragment
  };

  window.L20n = {
    dom: dom
  };
})();