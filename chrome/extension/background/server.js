import createStore from '../../../app/store/configureStore';
import { loadState, saveState }  from '../../../app/utils/localStorage';

import { wrappedKey,
         unWrappedKey,
         encryptStringToSerialized,
         decryptSerializedToString } from '../../../app/utils/kcCrypto';

import  * as myActions  from './actions'

const persisted = loadState();
const store = createStore(persisted);

store.subscribe(() => {
  console.log("persisting state to localStorage", store.getState());
  saveState(store.getState());
});

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
    const { hostname } = new URL(sender.url)
    
    const hits = store.getState().cards.filter( ( card ) => {
        return card.clear && (card.clear.type === "web") && (hostname === card.clear.url)
    })

    if (hits.length == 1) {
      chrome.tabs.sendMessage(sender.tab.id, {subject: "fillForm",
                                              username: hits[0].clear.username,
                                              password: hits[0].clear.password
                                             }, function(response) {
                                               console.log(response)
                                             });
    } 

    chrome.tabs.sendMessage(sender.tab.id, {subject: "placeInjector",
                                           }, function(response) {
                                             console.log(response)
                                           });
    
  }
});
