import * as ActionTypes from '../constants/ActionTypes';
import { hashPassword } from '../utils/kcCrypto';

// wherein we keep persistable data regarding user

const initialState = { }

const actionsMap = {
  [ActionTypes.DELETE_ALL](state, action) {
    return {}
  },

  [ActionTypes.REGISTER_USER](state, action) {
    const {username, wrappedKey} = action.userData
    const returnable = Object.assign({}, state, {username,  wrappedKey} );
    return returnable
  }
};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
