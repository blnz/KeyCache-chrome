import * as ActionTypes from '../constants/ActionTypes';
import { hashPassword } from '../utils/kcCrypto';

// wherein we store data, both persistable and non about
// the user's credentials

const initialState = {

};

const actionsMap = {
  // the live, unwrapped symmetric key for card data
  [ActionTypes.SET_MASTERKEY](state, action) {
    return Object.assign({}, { masterkey: action.masterkey }, state);
  },

  [ActionTypes.DELETE_ALL](state, action) {
    return {};
  },

  [ActionTypes.REGISTER_USER](state, action) {
    console.log("registerUser reducer");
    return Object.assign({}, { user: action.userData }, state);
  }
};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
