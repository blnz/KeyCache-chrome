import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import api from '../middleware/api';
import mySaga from '../middleware/saga';
import storage from '../utils/storage';

const middlewares = applyMiddleware(thunk, api);

const sagaMiddleware = createSagaMiddleware();

const sagaMiddlewares = applyMiddleware(sagaMiddleware);

const enhancer = compose(
  middlewares,
  sagaMiddlewares,
  storage()
);

sagaMiddleware.run(mySaga);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer );
}
