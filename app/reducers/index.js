import { combineReducers } from 'redux';

import cards from './cards';
import user from './user';
import temps from './temps';

export default combineReducers({
  user,
  temps,
  cards
});
