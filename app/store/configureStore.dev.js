import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import api from '../middleware/api'
import thunk from 'redux-thunk';
import storage from '../utils/storage';

const enhancer = compose(
  applyMiddleware(thunk, api),
  storage(),
  window.devToolsExtension ? window.devToolsExtension() : nope => nope
);

export default function (initialState) {
  console.log("gonna create store with initial state:", initialState);
  
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
