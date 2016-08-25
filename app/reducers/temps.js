import * as ActionTypes from '../constants/ActionTypes';

// wherein we store non-persistable data in its own space
// the user's credentials

const initialState = {
  cards: []
};

const actionsMap = {
  // the live, unwrapped symmetric key for card data
  [ActionTypes.SET_CLEAR_MASTERKEY](state, action) {
    const { masterKey } = action
    return Object.assign({}, state, { masterKey });
  },

  [ActionTypes.REMOVE_CLEAR_MASTERKEY](state, action) {
    const masterKey = undefined
    const user = undefined
    return Object.assign({}, state, { masterKey, user });
  },

  [ActionTypes.DELETE_ALL](state, action) {
    return {};
  },

  [ActionTypes.REGISTER_USER](state, action) {
    const { username, passphrase, wrappedKey } = action.userData
    return Object.assign({}, state, { user: { username, passphrase, wrappedKey } });
  }
};

export default function temps(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
