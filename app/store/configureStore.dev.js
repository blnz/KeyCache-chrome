import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import api from '../middleware/api';
import mySaga from '../middleware/saga';
import storage from '../utils/storage';

const sagaMiddleware = createSagaMiddleware();

const sagaMiddlewares = applyMiddleware(sagaMiddleware);


const enhancer = compose(
  applyMiddleware(thunk, api),
  sagaMiddlewares,
  storage(),
  window.devToolsExtension ? window.devToolsExtension() : nope => nope
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(mySaga);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
