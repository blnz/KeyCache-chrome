import * as ActionTypes from '../constants/ActionTypes';

// wherein we store non-persistable data in its own space
// the user's credentials

const initialState = {

};

const actionsMap = {
  // the live, unwrapped symmetric key for card data
  [ActionTypes.SET_CLEAR_MASTERKEY](state, action) {
    const { masterKey } = action
    return Object.assign({}, state, { masterKey });
  },

  [ActionTypes.REMOVE_CLEAR_MASTERKEY](state, action) {
    const masterKey = undefined
    return Object.assign({}, state, { masterKey });
  },

  [ActionTypes.DELETE_ALL](state, action) {
    return {};
  },

  [ActionTypes.REGISTER_USER](state, action) {
    console.log("temp: registerUser reducer with action:", action);
    const returnable = Object.assign({}, state, { user: action.userData });
    console.log("temp: should be mutating to:", returnable)
    return returnable
  }
};

export default function temps(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
