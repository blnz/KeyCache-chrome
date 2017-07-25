import { combineReducers } from 'redux';

import cards from './cards';
import user from './user';
import temps from './temps';
import settings from './settings';


export default combineReducers({
  user,
  temps,
  cards,
  settings
});
