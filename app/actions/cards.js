const bluebird = require('bluebird');
global.Promise = bluebird;

import * as types from '../constants/ActionTypes';
import { wrappedKey, unWrappedKey } from '../utils/kcCrypto';

export function addCard(cardData) {
  return { type: types.ADD_CARD, cardData };
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
    
    keyPromise.then(function(key) {
        console.log("got a new AES-KEY:", key)
        // dispatch(registerUserData(userData));
        return key;
      }).then(function(masterKey) {
        console.log("proceeding with masterKey:", masterKey)
        dispatch(setClearMasterKey(masterKey))
        return wrappedKey(userData.passphrase, masterKey)
      }).then (function(wrapped) {
        console.log("got wrapped and serialized masterkey", wrapped)
        return  dispatch(registerUserData(Object.assign({}, userData, { wrapped })))
      }).then( () => {
        console.log("we've dispatched userData")
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

export function authenticateUser(userData) {
  return function (dispatch, getState) {
    console.log("authenticateUser on dispatch userData:", userData);
    console.log("authenticateUser on dispatch getState() returns:", getState());
    const { wrappedKey } = getState().user
    const { passphrase } = userData

    return unWrappedKey(passphrase, wrappedKey).then( masterKey => {
      return dispatch( { type: types.SET_CLEAR_MASTERKEY, masterKey } )
    })
  }
}

export function setClearMasterKey(masterKey) {
  return { type: types.SET_CLEAR_MASTERKEY, masterKey };
}

export function logoutUser() {
  return { type: types.REMOVE_CLEAR_MASTERKEY };
}

// wipes out all data!
export function deleteAll() {
  return { type: types.DELETE_ALL };
}

