import * as ActionTypes from '../constants/ActionTypes';

const initialState = [{
  id: 7,
  version: 23,
  ciphertext: 'A43BHK',
  clear: {
    name: 'yabba',
    url: 'craigslist.org',
    username: 'beel',
    password: 'blah'
  }
}];

const actionsMap = {

  [ActionTypes.ADD_CARD](state, action) {
    return [{
      id: state.reduce((maxId, card) => Math.max(card.id, maxId), -1) + 1,
      version: 1,
      clear: action.cardData
    }, ...state];
  },

  [ActionTypes.DELETE_ALL](state, action) {
    return [];
  },

  [ActionTypes.DELETE_CARD](state, action) {
    return state.filter(card =>
      card.id !== action.id
    );
  },

  [ActionTypes.EDIT_CARD](state, action) {
    return state.map(card =>
      (card.id === action.id ?
        Object.assign({}, card, { clear: action.cardData }) :
        card)
    );
  },
};

export default function cards(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
