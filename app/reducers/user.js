import * as ActionTypes from '../constants/ActionTypes';
import { hashPassword } from '../utils/kcCrypto';

// wherein we keep persistable data regarding user

const initialState = { }

const actionsMap = {
  [ActionTypes.DELETE_ALL](state, action) {
    return {}
  },

  [ActionTypes.USER_REGISTER](state, action) {
    const {username, wrappedKey} = action.userData
    const returnable = Object.assign({}, state, {username,  wrappedKey} );
    return returnable
  },
  
  [ActionTypes.USER_REGISTER_SUCCESS](state, action) {
    console.log("USER_REGISTER_SUCCESS", action)
    const { user_id } = action.response
    return Object.assign({}, state, { user_id });
  },


};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
