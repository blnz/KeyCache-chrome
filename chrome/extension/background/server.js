import createStore from '../../../app/store/configureStore';
import { loadState, saveState }  from '../../../app/utils/localStorage';

import { wrappedKey,
         unWrappedKey,
         encryptStringToSerialized,
         decryptSerializedToString } from '../../../app/utils/kcCrypto';

import  * as myActions  from '../../../app/actions/cards'

const persisted = loadState();
const store = createStore(persisted);

store.subscribe(() => {
  console.log("persisting state to localStorage", store.getState());
  saveState(store.getState());
});

chrome.runtime.onMessage.addListener(function (msg, sender) {
  console.log("got message from sender", msg, sender);
  
  // First, validate the message's structure
  if ((msg.from === 'app') && (msg.subject === 'authentication')) {
    console.log("authentication", msg)
    store.dispatch(myActions.bgAuthenticateUser(msg.userAuthData))
    // forward to any popup that's listening
    chrome.runtime.sendMessage({from: "background",
                                subject: "authentication",
                                userAuthData: msg.userAuthData }, function (resp) {
                                  console.log("got response", resp)
                                })
  }

  if ((msg.from === 'app') && (msg.subject === 'cardUpdate')) {
    console.log("cardUpdate", msg)
    store.dispatch(myActions.updateCardData(msg.cardData))
    // forward to any popup that's listening
    chrome.runtime.sendMessage({from: "background",
                                subject: "cardUpdate",
                                cardData: msg.cardData }, function (resp) {
                                  console.log("got response", resp)
                                })
  }

  if ((msg.from === 'app') && (msg.subject === 'cardCreate')) {
    console.log("cardCreate", msg)
    store.dispatch(myActions.addCardData(msg.cardData))
    // forward to any popup that's listening
    chrome.runtime.sendMessage({from: "background",
                                subject: "cardCreate",
                                cardData: msg.cardData }, function (resp) {
                                  console.log("got response", resp)
                                })
  }

  // when a new window pups uup, it can come here to ee if user is already
  // authenticated
  if ((msg.from === 'app') && (msg.subject === 'getCredentials')) {
    console.log("getCredentials", msg, JSON.serialize(store.getState().user))

  }

  if ((msg.from === 'app') && (msg.subject === 'deleteAll')) {
    store.dispatch(myActions.wipeAllData())
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
