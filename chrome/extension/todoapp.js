import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './todoapp.css';

// here's where we get the persisted state from local storage


import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for onTouchTap  (responsive tap events on iOS)
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


chrome.storage.local.get('state', obj => {
  const { state } = obj;

  console.log("obj", obj, "state", state);
  
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');
  const store = createStore(initialState);
  
  ReactDOM.render(
    <Root store={ store } />,
    document.querySelector('#root')
  );
});
