/* global __webpack_public_path__ __HOST__ __PORT__ */
/* eslint no-native-reassign: 0 camelcase: 0 */

if (process.env.NODE_ENV === 'production')  {
  __webpack_public_path__ = chrome.extension.getURL('/js/');
} else if (process.env.NODE_ENV === 'pwa') {
  __webpack_public_path__ = 'js/';
} else {
  // In development mode,
  // the iframe of injectpage cannot get correct path,
  // it needs to get the parent page protocol.
  const path = `//${__HOST__}:${__PORT__}/js/`;
  if (location.protocol === 'https:' || location.search.indexOf('protocol=https') !== -1) {
    __webpack_public_path__ = `https:${path}`;
  } else {
    __webpack_public_path__ = `http:${path}`;
  }
}
