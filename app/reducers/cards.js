import * as ActionTypes from '../constants/ActionTypes';

const initialState = [{
  id: 7,
  version: 23,
  encrypted: 'A43BHK',
  clear: {
    name: 'yabba',
    url: 'craigslist.org',
    username: 'beel',
    password: 'blah'
  }
}];


const actionsMap = {

  // cards are reflected in localStorage, so we should avoid saving the clear version
  // of the data
  [ActionTypes.ADD_CARD](state, action) {
    const { clear, encrypted } = action.cardData
    console.log("adding card:", action, state)
    return [{
      id: state.reduce((maxId, card) => Math.max(card.id, maxId), -1) + 1,
      version: 0,
      clear,
      encrypted 
    }, ...state];
  },

  [ActionTypes.UPDATE_DECRYPTED](state, action) {
    const { clear, encrypted } = action.cardData
    console.log("updating card:", action, state)
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
  console.log("cards action:", action);
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
