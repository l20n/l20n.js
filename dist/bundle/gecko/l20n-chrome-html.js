{

function getDirection(code) {
  const tag = code.split('-')[0];
  return ['ar', 'he', 'fa', 'ps', 'ur'].indexOf(tag) >= 0 ?
    'rtl' : 'ltr';
}

const reHtml = /[&<>]/g;
const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

const observerConfig = {
  attributes: true,
  characterData: false,
  childList: true,
  subtree: true,
  attributeFilter: ['data-l10n-id', 'data-l10n-args', 'data-l10n-bundle']
};

class LocalizationObserver extends Map {
  constructor() {
    super();
    this.rootsByLocalization = new WeakMap();
    this.localizationsByRoot = new WeakMap();
    this.observer = new MutationObserver(
      mutations => this.translateMutations(mutations)
    );
  }

  handleEvent() {
    return this.requestLanguages();
  }

  requestLanguages(requestedLangs) {
    const localizations = Array.from(this.values());
    return Promise.all(
      localizations.map(l10n => l10n.requestLanguages(requestedLangs))
    ).then(
      () => this.translateAllRoots()
    )
  }

  setAttributes(element, id, args) {
    element.setAttribute('data-l10n-id', id);
    if (args) {
      element.setAttribute('data-l10n-args', JSON.stringify(args));
    }
    return element;
  }

  getAttributes(element) {
    return {
      id: element.getAttribute('data-l10n-id'),
      args: JSON.parse(element.getAttribute('data-l10n-args'))
    };
  }

  observeRoot(root, l10n = this.get('main')) {
    this.localizationsByRoot.set(root, l10n);
    if (!this.rootsByLocalization.has(l10n)) {
      this.rootsByLocalization.set(l10n, new Set());
    }
    this.rootsByLocalization.get(l10n).add(root);
    this.observer.observe(root, observerConfig);
  }

  disconnectRoot(root) {
    this.pause();
    this.localizationsByRoot.delete(root);
    for (let [name, l10n] of this) {
      const roots = this.rootsByLocalization.get(l10n);
      if (roots && roots.has(root)) {
        roots.delete(root);
        if (roots.size === 0) {
          this.delete(name);
          this.rootsByLocalization.delete(l10n);
        }
      }
    }
    this.resume();
  }

  pause() {
    this.observer.disconnect();
  }

  resume() {
    for (let l10n of this.values()) {
      if (this.rootsByLocalization.has(l10n)) {
        for (let root of this.rootsByLocalization.get(l10n)) {
          this.observer.observe(root, observerConfig)
        }
      }
    }
  }

  translateAllRoots() {
    const localizations = Array.from(this.values());
    return Promise.all(
      localizations.map(
        l10n => this.translateRoots(l10n)
      )
    );
  }

  translateRoots(l10n) {
    if (!this.rootsByLocalization.has(l10n)) {
      return Promise.resolve();
    }

    const roots = Array.from(this.rootsByLocalization.get(l10n));
    return Promise.all(
      roots.map(root => this.translateRoot(root, l10n))
    );
  }

  translateRoot(root, l10n = this.localizationsByRoot.get(root)) {
    return l10n.interactive.then(bundles => {
      const langs = bundles.map(bundle => bundle.lang);

      function setLangs() {
        const wasLocalizedBefore = root.hasAttribute('langs');

        root.setAttribute('langs', langs.join(' '));
        root.setAttribute('lang', langs[0]);
        root.setAttribute('dir', getDirection(langs[0]));

        if (wasLocalizedBefore) {
          root.dispatchEvent(new CustomEvent('DOMRetranslated', {
            bubbles: false,
            cancelable: false,
          }));
        }
      }

      return this.translateRootContent(root).then(setLangs);
    });
  }

  translateMutations(mutations) {
    const targets = new Set();

    for (let mutation of mutations) {
      switch (mutation.type) {
        case 'attributes':
          targets.add(mutation.target);
          break;
        case 'childList':
          for (let addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                this.getTranslatables(addedNode).forEach(
                  targets.add.bind(targets)
                );
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
  }

  translateFragment(frag) {
    return this.translateElements(this.getTranslatables(frag));
  }

  translateElements(elements) {
    const elemsByL10n = this.groupElementsByLocalization(elements);
    return this.getElementsTranslation(elemsByL10n).then(
      translations => this.applyTranslations(elemsByL10n, translations)
    );
  }

  applyTranslations(elemsByL10n, translationsByL10n) {
    this.pause();
    for (let [l10n, elems] of elemsByL10n) {
      const translations = translationsByL10n.get(l10n);
      for (let i = 0; i < elems.length; i++) {
        l10n.overlayElement(elems[i], translations[i]);
      }
    }
    this.resume();
  }

  groupElementsByLocalization(elements) {
    return Array.from(elements).reduce(
      (seq, elem) => {
        const l10n = this.getLocalizationForElement(elem);
        const group = (seq.get(l10n) || []).concat(elem);
        return seq.set(l10n, group);
      }, new Map()
    );
  }

  getTranslatables(element) {
    const nodes = Array.from(element.querySelectorAll('[data-l10n-id]'));

    if (typeof element.hasAttribute === 'function' &&
        element.hasAttribute('data-l10n-id')) {
      nodes.push(element);
    }

    return nodes;
  }

  getLocalizationForElement(elem) {
    return this.get(elem.getAttribute('data-l10n-bundle') || 'main');
  }

  getKeysForElements(elems) {
    return elems.map(elem => {
      const id = elem.getAttribute('data-l10n-id');
      const args = elem.getAttribute('data-l10n-args');

      return args ?
        [id, JSON.parse(args.replace(reHtml, match => htmlEntities[match]))] :
        id;
    });
  }

  getElementsTranslation(elemsByL10n) {
    return Promise.all(
      Array.from(elemsByL10n).map(
        ([l10n, elems]) => l10n.formatEntities(this.getKeysForElements(elems))
      )
    ).then(
      translationsList => Array.from(elemsByL10n.keys()).reduce(
        (seq, cur, idx) => seq.set(cur, translationsList[idx]),
        new Map()
      )
    );
  }

}

class ChromeLocalizationObserver extends LocalizationObserver {
  translateRootContent(root) {
    const anonChildren = document.getAnonymousNodes(root);
    if (!anonChildren) {
      return this.translateFragment(root);
    }

    return Promise.all(
      [root, ...anonChildren].map(node => this.translateFragment(node))
    );
  }
}

class L10nError extends Error {
  constructor(message, id, lang) {
    super();
    this.name = 'L10nError';
    this.message = message;
    this.id = id;
    this.lang = lang;
  }
}

function keysFromContext(ctx, keys, method, prev) {
  const errors = [];
  const translations = keys.map((key, i) => {
    if (prev && prev[i] && prev[i][1].length === 0) {
      // Use a previously formatted good value if there were no errors
      return prev[i];
    }

    const [id, args] = Array.isArray(key) ?
      key : [key, undefined];

    const result = method.call(this, ctx, id, args);
    errors.push(...result[1]);
    // XXX Depending on the kind of errors it might be better to return prev[i] 
    // here;  for instance, when the current translation is completely missing
    return result;
  });

  return [translations, errors];
}

function valueFromContext(ctx, id, args) {
  const entity = ctx.messages.get(id);

  if (entity === undefined) {
    return [id, [new L10nError(`Unknown entity: ${id}`)]];
  }

  return ctx.format(entity, args);
}

function entityFromContext(ctx, id, args) {
  const entity = ctx.messages.get(id);

  if (entity === undefined) {
    return [
      { value: id, attrs: null },
      [new L10nError(`Unknown entity: ${id}`)]
    ];
  }

  const [value, errors] = ctx.formatToPrimitive(entity, args);

  const formatted = {
    value,
    attrs: null,
  };

  if (entity.traits) {
    formatted.attrs = Object.create(null);
    for (let trait of entity.traits) {
      const [attrValue, attrErrors] = ctx.format(trait, args);
      errors.push(...attrErrors);
      formatted.attrs[trait.key.name] = attrValue;
    }
  }

  return [formatted, errors];
}

const properties = new WeakMap();
const contexts = new WeakMap();

class Localization {
  constructor(requestBundles, createContext) {
    this.interactive = requestBundles().then(
      bundles => fetchFirstBundle(bundles, createContext)
    );

    properties.set(this, {
      requestBundles, createContext
    });
  }

  requestLanguages(requestedLangs) {
    return this.interactive.then(
      bundles => changeLanguages(this, bundles, requestedLangs)
    );
  }

  formatWithFallback(bundles, keys, method, prev) {
    const ctx = contexts.get(bundles[0]);

    if (!ctx) {
      return prev.map(tuple => tuple[0]);
    }

    const [translations, errors] = keysFromContext(ctx, keys, method, prev);

    if (errors.length === 0) {
      return translations.map(tuple => tuple[0]);
    }

    // XXX report/emit errors?
    // errors.forEach(e => console.warn(e));

    const { createContext } = properties.get(this);
    return fetchFirstBundle(bundles.slice(1), createContext).then(
      bundles => this.formatWithFallback(bundles, keys, method, translations)
    );
  }

  formatEntities(keys) {
    return this.interactive.then(
      bundles => this.formatWithFallback(bundles, keys, entityFromContext)
    );
  }

  formatValues(...keys) {
    return this.interactive.then(
      bundles => this.formatWithFallback(bundles, keys, valueFromContext)
    );
  }

  formatValue(id, args) {
    return this.formatValues([id, args]).then(
      ([val]) => val
    );
  }

}

function createContextFromBundle(bundle, createContext) {
  return bundle.fetch().then(resources => {
    const ctx = createContext(bundle.lang);
    resources
      .filter(res => !(res instanceof Error))
      .forEach(res => ctx.addMessages(res));
    contexts.set(bundle, ctx);
    return ctx;
  });
}

function fetchFirstBundle(bundles, createContext) {
  const [bundle] = bundles;

  if (!bundle) {
    return Promise.resolve(bundles);
  }

  return createContextFromBundle(bundle, createContext).then(
    () => bundles
  );
}

function changeLanguages(l10n, oldBundles, requestedLangs) {
  const { requestBundles, createContext } = properties.get(l10n);

  return l10n.interactive = requestBundles(requestedLangs).then(
    newBundles => equal(oldBundles, newBundles) ?
      oldBundles : fetchFirstBundle(newBundles, createContext)
  );
}

function equal(bundles1, bundles2) {
  return bundles1.length === bundles2.length &&
    bundles1.every(({lang}, i) => lang === bundles2[i].lang);
}

// match the opening angle bracket (<) in HTML tags, and HTML entities like
// &amp;, &#0038;, &#x0026;.
const reOverlay = /<|&#?\w+;/;

function overlayElement(l10n, element, translation) {
  const value = translation.value;

  if (typeof value === 'string') {
    if (!reOverlay.test(value)) {
      element.textContent = value;
    } else {
      // start with an inert template element and move its children into
      // `element` but such that `element`'s own children are not replaced
      const tmpl = element.ownerDocument.createElementNS(
        'http://www.w3.org/1999/xhtml', 'template');
      tmpl.innerHTML = value;
      // overlay the node with the DocumentFragment
      overlay(l10n, element, tmpl.content);
    }
  }

  for (let key in translation.attrs) {
    if (l10n.isAttrAllowed({ name: key }, element)) {
      element.setAttribute(key, translation.attrs[key]);
    }
  }
}

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
function overlay(l10n, sourceElement, translationElement) {
  const result = translationElement.ownerDocument.createDocumentFragment();
  let k, attr;

  // take one node from translationElement at a time and check it against
  // the allowed list or try to match it with a corresponding element
  // in the source
  let childElement;
  while ((childElement = translationElement.childNodes[0])) {
    translationElement.removeChild(childElement);

    if (childElement.nodeType === childElement.TEXT_NODE) {
      result.appendChild(childElement);
      continue;
    }

    const index = getIndexOfType(childElement);
    const sourceChild = getNthElementOfType(sourceElement, childElement, index);
    if (sourceChild) {
      // there is a corresponding element in the source, let's use it
      overlay(l10n, sourceChild, childElement);
      result.appendChild(sourceChild);
      continue;
    }

    if (l10n.isElementAllowed(childElement)) {
      const sanitizedChild = childElement.ownerDocument.createElement(
        childElement.nodeName);
      overlay(l10n, sanitizedChild, childElement);
      result.appendChild(sanitizedChild);
      continue;
    }

    // otherwise just take this child's textContent
    result.appendChild(
      translationElement.ownerDocument.createTextNode(
        childElement.textContent));
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
    for (k = 0, attr; (attr = translationElement.attributes[k]); k++) {
      if (l10n.isAttrAllowed(attr, sourceElement)) {
        sourceElement.setAttribute(attr.name, attr.value);
      }
    }
  }
}

// Get n-th immediate child of context that is of the same type as element.
// XXX Use querySelector(':scope > ELEMENT:nth-of-type(index)'), when:
// 1) :scope is widely supported in more browsers and 2) it works with
// DocumentFragments.
function getNthElementOfType(context, element, index) {
  /* jshint boss:true */
  let nthOfType = 0;
  for (let i = 0, child; child = context.children[i]; i++) {
    if (child.nodeType === child.ELEMENT_NODE &&
        child.tagName.toLowerCase() === element.tagName.toLowerCase()) {
      if (nthOfType === index) {
        return child;
      }
      nthOfType++;
    }
  }
  return null;
}

// Get the index of the element among siblings of the same type.
function getIndexOfType(element) {
  let index = 0;
  let child;
  while ((child = element.previousElementSibling)) {
    if (child.tagName === element.tagName) {
      index++;
    }
  }
  return index;
}

const allowed = {
  elements: [
    'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'data',
    'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u',
    'mark', 'ruby', 'rt', 'rp', 'bdi', 'bdo', 'span', 'br', 'wbr'
  ],
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

class HTMLLocalization extends Localization {
  overlayElement(element, translation) {
    return overlayElement(this, element, translation);
  }

  // XXX the allowed list should be amendable; https://bugzil.la/922573
  isElementAllowed(element) {
    return allowed.elements.indexOf(element.tagName.toLowerCase()) !== -1;
  }

  isAttrAllowed(attr, element) {
    const attrName = attr.name.toLowerCase();
    const tagName = element.tagName.toLowerCase();
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
      const type = element.type.toLowerCase();
      if (type === 'submit' || type === 'button' || type === 'reset') {
        return true;
      }
    }
    return false;
  }

}

// A document.ready shim
// https://github.com/whatwg/html/issues/127
function documentReady() {
  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    document.addEventListener('readystatechange', function onrsc() {
      document.removeEventListener('readystatechange', onrsc);
      resolve();
    });
  });
}

function getResourceLinks(head) {
  return Array.prototype.map.call(
    head.querySelectorAll('link[rel="localization"]'),
    el => [el.getAttribute('href'), el.getAttribute('name') || 'main']
  ).reduce(
    (seq, [href, name]) => seq.set(name, (seq.get(name) || []).concat(href)),
    new Map()
  );
}

function createGetValue(bundles) {
  return function (id, args) {
    const ctx = contexts.get(bundles[0]);
    const [value] = valueFromContext(ctx, id, args);
    return value;
  };
}

// create nsIObserver's observe method bound to a LocalizationObserver obs
function createObserve(obs) {
  return function observe(subject, topic, data) {
    switch (topic) {
      case 'language-registry-update': {
        const { requestBundles, createContext } = properties.get(this);
        this.interactive = requestBundles().then(
          bundles => fetchFirstBundle(bundles, createContext)
        );
        return obs.translateRoots(this);
      }
      case 'language-registry-incremental': {
        const { resId, lang, messages } = JSON.parse(data);
        return this.interactive.then(bundles => {
          const bundle = bundles[0];
          if (bundle.resIds.includes(resId) && bundle.lang === lang) {
            // just overwrite any existing messages in the first bundle
            const ctx = contexts.get(bundles[0]);
            ctx.addMessages(messages);
            return obs.translateRoots(this);
          }
        });
      }
      default: {
        throw new Error(`Unknown topic: ${topic}`);
      }
    }
  }
}

Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('resource://gre/modules/L10nService.jsm');
Components.utils.import('resource://gre/modules/IntlMessageContext.jsm');

const functions = {
  OS: function() {
    switch (Services.appinfo.OS) {
      case 'WINNT':
        return 'win';
      case 'Linux':
        return 'lin';
      case 'Darwin':
        return 'mac';
      case 'Android':
        return 'android';
      default:
        return 'other';
    }
  }
};

function createContext(lang) {
  return new MessageContext(lang, { functions });
}

document.l10n = new ChromeLocalizationObserver();
window.addEventListener('languagechange', document.l10n);

documentReady().then(() => {
  for (let [name, resIds] of getResourceLinks(document.head)) {
    if (!document.l10n.has(name)) {
      createLocalization(name, resIds);
    }
  }
});

function createLocalization(name, resIds) {
  function requestBundles(requestedLangs = navigator.languages) {
    const { resBundles } = L10nService.getResources(requestedLangs, resIds);
    return Promise.resolve(resBundles);
  }

  const l10n = new HTMLLocalization(requestBundles, createContext);
  l10n.observe = createObserve(document.l10n);
  Services.obs.addObserver(l10n, 'language-registry-update', false);
  Services.obs.addObserver(l10n, 'language-registry-incremental', false);

  // XXX this is currently used by about:support; it doesn't support language 
  // changes nor live updates
  document.l10n.ready = l10n.interactive;
  document.l10n.ready.then(
    bundles => document.l10n.getValue = createGetValue(bundles)
  );
  document.l10n.set(name, l10n);

  if (name === 'main') {
    const rootElem = document.documentElement;
    document.l10n.observeRoot(rootElem, document.l10n.get(name));
    document.l10n.translateRoot(rootElem);
  }
}

}