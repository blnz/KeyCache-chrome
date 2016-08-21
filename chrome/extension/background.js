const bluebird = require('bluebird');
global.Promise = bluebird;

import createStore from '../../app/store/configureStore';
import { loadState, saveState }  from '../../app/utils/localStorage';

import { wrappedKey,
         unWrappedKey,
         encryptStringToSerialized,
         decryptSerializedToString } from '../../app/utils/kcCrypto';

import  * as myActions  from './background/actions'

const persisted = loadState();
const store = createStore(persisted);

store.subscribe(() => {
  console.log("persisting state to localStorage", store.getState());
  saveState(store.getState());
});


function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise(resolve => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);

promisifyAll(chrome.storage, [
  'local',
]);

require('./background/contextMenus');
                // require('./background/inject');
require('./background/badge');

chrome.runtime.onMessage.addListener(function (msg, sender) {
  console.log("got message from sender", msg, sender);
  
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }

  // First, validate the message's structure
  if ((msg.from === 'app') && (msg.subject === 'authentication')) {
    console.log("authentication", msg)
    store.dispatch(myActions.authenticateUser(msg.userAuthData))
  }

  if ((msg.from === 'content') && (msg.subject === 'foundForm')) {
    chrome.tabs.sendMessage(sender.tab.id, {subject: "fillForm",
                                            username: "willy",
                                            password: "bopper"
                                           }, function(response) {
                                             console.log(response)
                                           });
    chrome.tabs.sendMessage(sender.tab.id, {subject: "placeInjector",
                                           }, function(response) {
                                             console.log(response)
                                           });
    
  }
});
