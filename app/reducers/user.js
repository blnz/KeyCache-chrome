import * as ActionTypes from '../constants/ActionTypes';
import { hashPassword } from '../utils/kcCrypto';

// wherein we store data, both persistable and non about
// the user's credentials

const initialState = { }

const actionsMap = {
  [ActionTypes.DELETE_ALL](state, action) {
    return {}
  },

  [ActionTypes.REGISTER_USER](state, action) {
    //    console.log("registerUser reducer with action:", action);
    const {username, wrapped} = action.userData
    const returnable = Object.assign({}, state, {username,  wrappedKey: wrapped} );
    // console.log("should be mutating to:", returnable)
    return returnable
  }
};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
