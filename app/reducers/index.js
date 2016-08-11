import { combineReducers } from 'redux';
import todos from './todos';
import cards from './cards';
import user from './user';

export default combineReducers({
  user,
  todos,
  cards
});
