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
