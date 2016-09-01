import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import createStore from '../../app/store/configureStore';

import * as actions from '../../app/actions/cards'

// fixme: load initial state from bakground page instead of local storage
import { loadState }  from '../../app/utils/localStorage';

//
// Loads the single page app into its HTML doc container
//

window.React = React;

import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for onTouchTap  (responsive tap events on iOS)
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin

injectTapEventPlugin();

const persisted = loadState();
const store = createStore(persisted);

chrome.runtime.sendMessage({from: "app",
                            subject: "getCredentials"} , function (resp) {
                              if (resp.from === "background" &&
                                  resp.user &&
                                  resp.user.passphrase) {
                                store.dispatch(actions.authenticateUserLocal(resp.user))
                              }
                            })

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (msg.from === 'background') {
      console.log("got something from background", msg, sender);
      if (msg.subject === "authentication") {
        store.dispatch(actions.authenticateUserLocal(msg.userAuthData))
      } else if (msg.subject === "cardUpdate") {
        store.dispatch(actions.updateCardData(msg.cardData))
      } else if (msg.subject === "cardCreate") {
        store.dispatch(actions.addCardData(msg.cardData))
      } else if (msg.subject === "cardDelete") {
        store.dispatch(actions.deleteCardData(msg.cardData))
      }
    }
  });


ReactDOM.render(
    <Root store={ store } />,
  document.querySelector('#root')
)
