const bluebird = require('bluebird');
global.Promise = bluebird;

import * as types from '../../../app/constants/ActionTypes';
import { wrappedKey,
         unWrappedKey,
         encryptStringToSerialized,
         decryptSerializedToString } from '../../../app/utils/kcCrypto';

export function addCardData(cardData) {
  return { type: types.ADD_CARD, cardData };
}

export function deleteCard(cardData) {
  return { type: types.DELETE_CARD, id: cardData.id };
}

export function updateCardData(cardData) {
  return { type: types.UPDATE_CARD, cardData };
}

// a new card has been created, we encrypt the data for storage, and keep the clear
// data for usage, for now
export function addCard(cardData) {
  return function (dispatch, getState) {

    const key = getState().temps.masterKey
    const clear = JSON.stringify(cardData)

    encryptStringToSerialized(key, clear).then( encrypted => {
      //      console.log("gonna add CardData ", { clear: cardData, encrypted })
      return dispatch(addCardData({
        id: require('node-uuid').v4(),
        clear: cardData,
        encrypted }))
    })
  }
}


// updated, we encrypt the data for storage, and keep the clear
// data for usage, for now
export function updateCard(card) {
  return function (dispatch, getState) {

    const key = getState().temps.masterKey
    const clear = JSON.stringify(card.clear)

    encryptStringToSerialized(key, clear).then( encrypted => {
      //      console.log("gonna add CardData ", { clear: cardData, encrypted })
      return dispatch(updateCardData({
        id: card.id,
        version: -1,
        clear: card.clear,
        encrypted }))
    })
  }
}

export function registerUser(userData) {
  return function (dispatch, getState) {
    console.log("registerUser got dispatch");

    // generate a new, random masterkey
    var keyPromise = window.crypto.subtle.generateKey(
      {name: "AES-CBC", length: 256}, // Algorithm the key will be used with
      true,                           // Can extract key value to binary string
      ["encrypt", "decrypt"]          // Use for these operations
    );
    
    keyPromise.then( masterKey => {
      //      console.log("proceeding with new MasterKey:", masterKey)
      dispatch(setClearMasterKey(masterKey))
      return wrappedKey(userData.passphrase, masterKey)
    }).then (function(wrapped) {
      //      console.log("got wrapped and serialized masterkey", wrapped)
      return  dispatch(registerUserData(Object.assign({}, userData, { wrapped })))
    }).catch( err => {
      console.log("caught:", err)
    })

    keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});
  };
}

export function registerUserData(userData) {
  console.log("registerUSerData with:", userData)
  return { type: types.REGISTER_USER, userData };
}

// given user's secret, use it to open masterKey, then decrypt stuff 
export function authenticateUser(userAuthData) {
  return function (dispatch, getState) {
    // console.log("authenticateUser on dispatch userData:", userData);
    // console.log("authenticateUser on dispatch getState() returns:", getState());
    const { wrappedKey } = getState().user
    const { passphrase } = userAuthData
    
    return unWrappedKey(passphrase, wrappedKey).then( masterKey => {
      console.log("got unwrapped master, send to background", masterKey);
      // chrome.runtime.sendMessage({authentice: userAuthData}, function(response) {
      //   console.log("got response", response);
      // });
      dispatch( { type: types.SET_CLEAR_MASTERKEY, masterKey } )
    }).then( () => {

      const key = getState().temps.masterKey
      const cards = getState().cards
      cards.map( (card) => {
        if (!card.clear && card.encrypted) {
          decryptSerializedToString(key, card.encrypted).then( (json) => {
            const clear = JSON.parse(json)
            dispatch( { type: types.UPDATE_CARD, cardData: Object.assign({}, card, { clear }) })
          })
        }
      })
    }).catch( (err) => {
      console.log(err)
    });
  }
}


export function setClearMasterKey(masterKey) {
  return { type: types.SET_CLEAR_MASTERKEY, masterKey };
}

export function logoutUser() {
  return { type: types.REMOVE_CLEAR_MASTERKEY };
}

// wipes out all data!!!
export function deleteAll() {
  return { type: types.DELETE_ALL };
}

