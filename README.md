L20n: Localization 2.0 (Deprecated)
===================================

__L20n.js has been deprecated and is no longer maintained. Please use
[Fluent][], the successor to L20n developed by the same team at Mozilla.
Fluent is a mature localization system currently used in Firefox and in many
other Mozilla projects.__

---

L20n is an opinionated localization library for the Web. It builds on top of
[Fluent][] which was designed to unleash the expressive power of the natural
language.

L20n.js is a good choice for websites which want to offer a best-in-class
translation experience for their users.  L20n takes advantage of modern web
technologies to offer a fast and lean localization of HTML and JavaScript.

[Fluent]: http://projectfluent.org


How to use L20n
---------------

Include the following code in the `<head>` section of your HTML:

```html
<meta name="defaultLanguage" content="en-US">
<meta name="availableLanguages" content="de, en-US, fr, pl">
<link rel="localization" href="locales/myApp.{locale}.ftl">
<script defer src="dist/web/l20n.js"></script>
```
Use the `data-l10n-id` attribute on an HTML element to mark it as localizable.

```html
<p data-l10n-id="about"></p>
```

That's it!  L20n will set up a `MutationObserver` and will make sure the
element is localized even if the DOM changes.  See [docs/html][] for more
information.

[docs/html]: https://github.com/l20n/l20n.js/blob/master/docs/html.md

It is also possible to use L20n programmatically, for instance in order to 
localize dynamic content.  The API is exposed under `document.l10n`.  Refer to
the [docs/][] directory for more details.

[docs/]: https://github.com/l20n/l20n.js/blob/master/docs/


Learn the FTL syntax
--------------------

L20n uses Project Fluent under the hood.  FTL is a localization file format
used for describing translation resources.  FTL stands for _Fluent Translation
List_.

FTL is designed to be simple to read, but at the same time allows to represent
complex concepts from natural languages like gender, plurals, conjugations,
and others.

    hello-user = Hello, { $username }!

[Read the Fluent Syntax Guide][] in order to learn more about the syntax.  If
you're a tool author you may be interested in the formal [EBNF grammar][].

[Read the Fluent Syntax Guide]: http://projectfluent.org/fluent/guide/
[EBNF grammar]: https://github.com/projectfluent/fluent/tree/master/spec
