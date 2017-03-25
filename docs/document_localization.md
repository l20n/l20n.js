# document_localization

**Extends DOMLocalization**

The `DocumentLocalization` class localizes DOM documents.

A sublcass of `DOMLocalization`, it implements methods for observing DOM
trees with a `MutationObserver`.  It can delegate the translation of DOM
elements marked with `data-l10n-with` to other named `DOMLocalizations`.

Each `document` will have its corresponding `DocumentLocalization` instance
created automatically on startup, as `document.l10n`.

# constructor

**Parameters**

-   `requestBundles`  
-   `createContext`  

Returns **DocumentLocalization** 

# requestLanguages

Trigger the language negotation process for this `DocumentLocalization`
and any `DOMLocalization` objects which it can delegate to.

Returns a promise which resolves to an array of arrays of negotiated
languages for each `Localization` available in the current document.

```javascript
document.l10n.requestLanguages(['de-DE', 'de', 'en-US']);
```

**Parameters**

-   `requestedLangs` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** array of requested languages

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>>>** 

# translateDocument

Triggers translation of all roots associated with this
`DocumentLocalization` and any `DOMLocalization` objects which it can
delegate to.

Returns a `Promise` which is resolved once all translations are
completed.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# translateFragment

Translate a DOM element or fragment asynchronously using this
`DocumentLocalization` and any `DOMLocalization` objects which it can
delegate to.

Manually trigger the translation (or re-translation) of a DOM fragment.
Use the `data-l10n-id` and `data-l10n-args` attributes to mark up the DOM
with information about which translations to use.  Only elements with
`data-l10n-with` attribute matching this `DOMLocalization`'s name will be
translated.

If `frag` or its descendants use `data-l10n-with`, the specific named
`DOMLocalization` will be used to translate it.  As a special case,
elements without `data-l10n-with` will be localized using this
`DocumentLocalization` (as if they had `data-l10n-with="main"`).

Returns a `Promise` that gets resolved once the translation is complete.

**Parameters**

-   `frag` **DOMFragment** Element or DocumentFragment to be translated

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

# translateElement

Translate a single DOM element asynchronously using this
`DocumentLocalization` or any `DOMLocalization` objects which it can
delegate to.

If `element` uses `data-l10n-with`, the specific named `DOMLocalization`
will be used to translate it.  As a special case, an element without
`data-l10n-with` will be localized using this `DocumentLocalization` (as
if it had `data-l10n-with="main"`).

Returns a `Promise` that gets resolved once the translation is complete.

**Parameters**

-   `element` **[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)** HTML element to be translated

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 
