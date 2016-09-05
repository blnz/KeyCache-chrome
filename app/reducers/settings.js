import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  syncServerHost: "http://localhost:8000",
  useSyncServer: false
};

const actionsMap = {
  
  [ActionTypes.SERVER_HOST_SET](state, action) {
    const { syncServerHost } = action
    return Object.assign({}, state, { syncServerHost });
  },
  [ActionTypes.USE_SYNC_SERVER_TOGGLE](state, action) {
    return Object.assign({}, state, { useSyncServer: (!state.useSyncServer) });
  }
  
}

export default function temps(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
