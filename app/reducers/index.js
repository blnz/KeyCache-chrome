import { combineReducers } from 'redux';
import todos from './todos';
import cards from './cards';
import user from './user';
import temps from './temps';

export default combineReducers({
  user,
  todos,
  temps,
  cards
});
