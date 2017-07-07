//
// the bbackground runs as a server, allowing our extension code
// running in individual tabs or windows to get and send state
// updates to a single repository for this browser

import createStore from '../../../app/store/configureStore';
import { loadState, saveState } from '../../../app/utils/localStorage';

// import {
//   wrappedKey,
//   unWrappedKey,
//   deriveBits,
//   encryptStringToSerialized,
//   decryptSerializedToString } from '../../../app/utils/kcCrypto';

import * as myActions from '../../../app/actions/cards';

const persisted = loadState();
const store = createStore(persisted);

store.subscribe(() => {
  //  console.log('persisting state to localStorage', store.getState());
  saveState(store.getState());
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('server got message', msg);
  if (msg.from === 'app') {
    if (msg.subject === 'authentication') {
      //  console.log('authentication', msg)
      store.dispatch(myActions.bgAuthenticateUser(msg.userAuthData));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'authentication',
        userAuthData: msg.userAuthData
      });
    }

    if (msg.subject === 'logoutUser') {
      //      console.log('logout', msg);
      store.dispatch(myActions.logoutUser());
      // forward to any popup that's listening
      chrome.runtime.sendMessage({ from: 'background', subject: 'logoutUser' });
    }

    if (msg.subject === 'registration') {
      store.dispatch(myActions.registerUserData(msg.user));
      store.dispatch(myActions.registerUserRemote(msg.user));
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'registration',
        user: msg.user
      });

      store.dispatch(myActions.bgAuthenticateUser(msg.user));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'authentication',
        userAuthData: msg.userAuthData
      });
    }

    if (msg.subject === 'cardUpdate') {
      store.dispatch(myActions.updateCardData(msg.cardData));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'cardUpdate',
        cardData: msg.cardData
      });
    }

    if (msg.subject === 'cardCreate') {
      store.dispatch(myActions.addCardData(msg.cardData));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'cardCreate',
        cardData: msg.cardData
      });
    }

    if (msg.subject === 'cardDelete') {
      store.dispatch(myActions.deleteCardData(msg.cardData));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'cardDelete',
        cardData: msg.cardData });
    }

    // when a new window pups uup, it can come here to see if user is already
    // authenticated
    if (msg.subject === 'getCredentials') {
      sendResponse({
        from: 'background',
        user: store.getState().temps.user
      });
    }

    if (msg.subject === 'deleteAll') {
      store.dispatch(myActions.wipeAllData());
    }

    if (msg.subject === 'restoreBackup') {
      store.dispatch(myActions.restoreBackupData(msg.data));
    }


    if (msg.subject === 'importCards') {
      store.dispatch(myActions.importCardsData(msg.cards));
    }

    if (msg.subject === 'useSyncServerToggle') {
      store.dispatch(myActions.useSyncServerToggleData());
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background', subject: 'useSyncServerToggle' });
    }

    if (msg.subject === 'setSyncServerHost') {
      store.dispatch(myActions.setSyncServerHostData(msg.syncServerHost));
      // forward to any popup that's listening
      chrome.runtime.sendMessage({
        from: 'background',
        subject: 'setSyncServerHost',
        syncServerHost: msg.syncServerHost
      });
    }
  }

  if ((msg.from === 'content') && (msg.subject === 'foundForm')) {
    const { hostname } = new URL(sender.url);

    const hits = store.getState().cards.filter(
      card => card.clear && (card.clear.type === 'web') && (hostname === card.clear.url)
    );

    if (hits.length === 1) {
      chrome.tabs.sendMessage(sender.tab.id, {
        subject: 'fillForm',
        username: hits[0].clear.username,
        password: hits[0].clear.password
      });
    }

    chrome.tabs.sendMessage(sender.tab.id, { subject: 'placeInjector' });
  }
});
