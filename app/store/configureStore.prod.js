import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import api from '../middleware/api'
import thunk from 'redux-thunk';
import storage from '../utils/storage';

const middlewares = applyMiddleware(thunk, api);
const enhancer = compose(
  middlewares,
  storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
