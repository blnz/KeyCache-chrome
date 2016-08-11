import * as ActionTypes from '../constants/ActionTypes';

const initialState = {

};

const actionsMap = {

  [ActionTypes.SET_MASTERKEY](state, action) {
    return Object.merge({}, { masterkey: action.masterkey }, state);
  }
};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
