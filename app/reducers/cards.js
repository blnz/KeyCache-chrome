import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

const actionsMap = {

  // cards are reflected in localStorage, so we'll strip the clear portion before saving
  [ActionTypes.ADD_CARD](state, action) {
    const { clear, encrypted, id } = action.cardData
    return [{
      id,
      version: 0,
      clear,
      encrypted 
    }, ...state];
  },

  [ActionTypes.UPDATE_DECRYPTED](state, action) {
    const { clear, encrypted } = action.cardData
    return [ action.cardData, ...state.filter( (card) =>  card.id != action.cardData.id ) ]
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
