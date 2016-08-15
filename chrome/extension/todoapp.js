import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import createStore from '../../app/store/configureStore';
import { loadState, saveState }  from '../../app/utils/localStorage';


import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for onTouchTap  (responsive tap events on iOS)
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin

injectTapEventPlugin();

const persisted = loadState();

const store = createStore(persisted);

store.subscribe(() => {
  console.log("persisting state to localStorage", store.getState());
  saveState(store.getState());
});

ReactDOM.render(
    <Root store={ store } />,
  document.querySelector('#root')
);
