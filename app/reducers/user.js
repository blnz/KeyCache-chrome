import * as ActionTypes from '../constants/ActionTypes';
import { hashPassword } from '../utils/kcCrypto';

const initialState = {

};

const actionsMap = {

  [ActionTypes.SET_MASTERKEY](state, action) {
    return Object.assign({}, { masterkey: action.masterkey }, state);
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
