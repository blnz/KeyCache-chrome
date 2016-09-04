import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  syncServerHost: "http://localhost:8000"
};

const actionsMap = {

  [ActionTypes.SERVER_HOST_SET](state, action) {
    const { syncServerHost } = action
    return Object.assign({}, state, { syncServerHost });
  }
}

export default function temps(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
