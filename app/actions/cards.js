const bluebird = require('bluebird');
global.Promise = bluebird;
import 'isomorphic-fetch'

import * as types from '../constants/ActionTypes'
import { CALL_API } from '../middleware/api'

import { wrappedKey,
         unWrappedKey,
         deriveBits,
         encryptStringToSerialized,
         decryptSerializedToString } from '../utils/kcCrypto';

import { sendMessage } from '../utils/messaging'

export function useSyncServerToggleData() {
  return { type: types.USE_SYNC_SERVER_TOGGLE };
}

export function useSyncServerToggle() {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "useSyncServerToggle"})
}  

export function setSyncServerHostData(host) {
  return { type: types.SERVER_HOST_SET,
           syncServerHost: host};
}


export function setSyncServerHost(host) {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "setSyncServerHost",
                              syncServerHost: host})
}  

export function addCardData(cardData) {
  return { type: types.ADD_CARD, cardData };
}

export function deleteCardData(cardData) {
  return { type: types.DELETE_CARD, id: cardData.id };
}

export function deleteCard(cardData) {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "cardDelete",
                              cardData: cardData }, function (resp) {
                                console.log("got response", resp)
                              })
  
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

      const newCard = {
        id: require('node-uuid').v4(),
        clear: cardData,
        encrypted }
      
      /*chrome.runtime.*/ sendMessage({from: "app",
                                  subject: "cardCreate",
                                  cardData: newCard }, function (resp) {
                                    console.log("got response", resp)
                                  })
      

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

      const updatedCard = {
        id: card.id,
        version: -1,
        clear: card.clear,
        encrypted
      }
      
      /*chrome.runtime.*/ sendMessage({from: "app",
                                  subject: "cardUpdate",
                                  cardData: updatedCard }, function (resp) {
                                    console.log("got response", resp)
                                  })

      // we'll get the data back from background server && do the insert then

    })
  }
}

export function registerUser(userData) {
  return function (dispatch, getState) {
    console.log("registerUser got dispatch");

    if (window.crypto && !window.crypto.subtle && window.crypto.webkitSubtle) {
      window.crypto.subtle = window.crypto.webkitSubtle;
    }
    
    // generate a new, random masterkey
    var keyPromise = window.crypto.subtle.generateKey(
      {name: "AES-CBC", length: 256}, // Algorithm the key will be used with
      true,                           // Can extract key value to binary string
      ["encrypt", "decrypt"]          // Use for these operations
    );
    
    keyPromise.then( masterKey => {
      dispatch(setClearMasterKey(masterKey))
      return wrappedKey(userData.passphrase, masterKey)
    }).then (function(wrappedKey) {

      const newUserData = Object.assign({}, userData, { wrappedKey })
      /*chrome.runtime.*/ sendMessage({from: "app",
                                  subject: "registration",
                                  user: newUserData }, function(response) {
                                    console.log("got response", response);
                                  });
      
      return  dispatch(registerUserData(newUserData))
    }).catch( err => {
      console.log("caught:", err)
    })

      keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});
  };
}

export function registerUserData(userData) {
  console.log("registerUSerData with:", userData)
  return { type: types.USER_REGISTER, userData };
}

// given user's secret, use it to open masterKey, then decrypt stuff 
export function authenticateUser(userAuthData) {
  return function (dispatch, getState) {

    const { wrappedKey } = getState().user
    const { passphrase } = userAuthData
    console.log('gonna unwrap', wrappedKey);
    return unWrappedKey(passphrase, wrappedKey).then( masterKey => {

     console.log('with master', masterKey);
      /*chrome.runtime.*/ sendMessage({from: "app",
                                  subject: "authentication",
                                  userAuthData }, function(response) {
                                  //  console.log("got response", response);
                                  });
      dispatch( { type: types.SET_CLEAR_MASTERKEY, masterKey } )
    }).then( () => {

      // decrypt all the cards
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

// given user's secret, use it to open masterKey, then decrypt stuff 
export function bgAuthenticateUser(userAuthData) {
  return function (dispatch, getState) {

    const { wrappedKey } = getState().user
    const { username, passphrase } = userAuthData
    
    return unWrappedKey(passphrase, wrappedKey).then( masterKey => {
      console.log("got unwrapped master, here in background", masterKey);
      dispatch( registerUserData({ username, passphrase, wrappedKey } ))
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


// given user's secret, use it to open masterKey, then decrypt stuff 
export function authenticateUserLocal(userAuthData) {
  return function (dispatch, getState) {
    // console.log("authenticateUser on dispatch userData:", userData);
    // console.log("authenticateUser on dispatch getState() returns:", getState());
    const { wrappedKey } = getState().user
    const { passphrase } = userAuthData
    
    return unWrappedKey(passphrase, wrappedKey).then( masterKey => {
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


export function restoreBackupData(data) {
  return { type: types.RESTORE_BACKUP , data};
}


export function restoreBackup(data) {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "restoreBackup",
                              data})
}


// wipes out all data!!!
export function wipeAllData() {
  return { type: types.DELETE_ALL };
}

// wipes out all data!!!
export function deleteAll() {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "deleteAll" })
  return wipeAllData()
}


export function importCardsData(cards) {
  return { type: types.IMPORT_CARDS, cards }
}

export function importCards(cards) {
  /*chrome.runtime.*/ sendMessage({from: "app",
                              subject: "importCards",
                              cards})
  return importCardsData(cards)
}




const postEndpoint = (body, state, route, session) => {
  const host = state.settings.syncServerHost
  return ({
    url: session ? `${host}/api/${route}?session=${session}` : `${host}/api/${route}`,
    opts: {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  })
}

const putEndpoint = (body, state, route, session) => {
  const host = state.settings.syncServerHost
  return ({
    url: session ? `${host}/api/${route}?session=${session}` : `${host}/api/${route}`,
    opts: {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  })
}

const deleteEndpoint = (state, route, session) => {
  const host = state.settings.syncServerHost
  return ({
    url: session ? `${host}/api/${route}?session=${session}` : `${host}/api/${route}`,
    opts: {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    }
  })
}

const getEndpoint = (state, route, session) => {
  const host = state.settings.syncServerHost
  return ({
    url: session ? `${host}/api/${route}?session=${session}` : `${host}/api/${route}`,
    opts: {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }
  })
}


const registerUserCallAPI = (user) => {
  return {
    [CALL_API]: {
      types: [ types.USER_REGISTER_REQUEST, types.USER_REGISTER_SUCCESS, types.USER_REGISTER_FAILURE ],
      endpoint: ( state ) => postEndpoint(user, state, "register")
    }
  }
}

export function registerUserRemote(user) {

  return function (dispatch, getState) {
    deriveBits(user.passphrase, 'sample-salt', 100000).then( bits => {
      var userReq = { secret: bits.toString('hex'),
                      username: user.username,
                      wrapped_master: user.wrappedKey
                    }
      dispatch(registerUserCallAPI(userReq))
    })
  }
}

// use middleware fetcher, just name some reducers
export function sessionOpenRemote(user) {
  console.log("sessionOpenRemote building a CALL_API action for user:", user)
  return function (dispatch, getState) {
    deriveBits(user.passphrase, 'sample-salt', 100000).then( bits => {
      
      let userReq = { secret: bits.toString('hex'),
                      username: user.username
                    }
      let endpoint = (state) => postEndpoint(userReq, state, "authenticate")
      
      dispatch( () => {
        return {
          [CALL_API]: {
            types: [ types.SESSION_OPEN_REQUEST, types.SESSION_OPEN_SUCCESS, types.SESSION_OPEN_FAILURE ],
            endpoint
          }
        }
      })
    })
  }
}

// use middleware fetcher, just name some reducers
export function sessionCloseRemote(user) {
  console.log("sessionCloseRemote building a CALL_API action for user:", user)
  return {
    [CALL_API]: {
      types: [ types.SESSION_CLOSE_REQUEST, types.SESSION_CLOSE_SUCCESS, types.SESSION_CLOSE_FAILURE ],
      endpoint: (state) =>  {
        return postEndpoint({}, state, "logout", state.temps.user.session)
      }
    }
  }
}

export function secretChangeRemote(user) {
  console.log("secretChangeRemote building a CALL_API action for user:", user)
  return function (dispatch, getState) {
    deriveBits(user.passphrase, 'sample-salt', 100000).then( bits => {
      
      let userReq = { secret: bits.toString('hex'),
                      username: user.username,
                      wrapped_master: user.wrappedKey
                    }
      let endpoint = (state) => postEndpoint(userReq, state, "changeSecret",
                                             state.temps.user.session)
      
      dispatch( () => {
        return {
          [CALL_API]: {
            types: [ types.SECRET_CHANGE_REQUEST, types.SECRET_CHANGE_SUCCESS, types.SECRET_CHANGE_FAILURE ],
            endpoint
          }
        }
      })
    })
  }
}

export function cardAddRemote(user, card) {
  console.log("cardAddRemote building a CALL_API action for card:", card)
  let cardReq = { encrypted: card.encrypted,
                  id: card.id
                }

  let endpoint = (state) => putEndpoint(cardReq, state, `u/${user.user_id}/c/{card.id}`,
                                        state.temps.user.session)
  
  return {
    [CALL_API]: {
      types: [ types.CARD_ADD_REQUEST, types.CARD_ADD_SUCCESS, types.CARD_ADD_FAILURE ],
      endpoint
    }
  }
}

export function cardUpdateRemote(user, card) {
  console.log("cardAddRemote building a CALL_API action for user,card:", user, card)
  let cardReq = { encrypted: card.encrypted,
                  id: card.id,
                  version: card.version
                }

  let endpoint = (state) => postEndpoint(cardReq, state, `u/${user.user_id}/c/${card.id}`,
                                         state.temps.user.session)
  
  return {
    [CALL_API]: {
      types: [ types.CARD_UPDATE_REQUEST, types.CARD_UPDATE_SUCCESS, types.CARD_UPDATE_FAILURE ],
      endpoint
    }
  }
}


export function cardDeleteRemote(user, card) {
  console.log("cardDeleteRemote building a CALL_API action for user:", user, card)

  let endpoint = (state) => deleteEndpoint(state, `u/${user.user_id}/c/${card.id}`,
                                           state.temps.user.session)
  
  return {
    [CALL_API]: {
      types: [ types.CARD_DELETE_REQUEST, types.CARD_DELETE_SUCCESS, types.CARD_DELETE_FAILURE ],
      endpoint
    }
  }
}

export function cardFetchRemote(user) {
  console.log("cardFetchRemote building a CALL_API action for user:", user)
  
  let endpoint = (state) => getEndpoint(state, `u/${user.user_id}/c/${card.id}`,
                                        state.temps.user.session)
  
  return {
    [CALL_API]: {
      types: [ types.CARD_FETCH_REQUEST, types.CARD_FETCH_SUCCESS, types.CARD_FETCH_FAILURE ],
      endpoint
    }
  }
}

export function cardsListRemote(user, since) {
  console.log("cardsListRemote building a CALL_API action for user:", user)

  if (since) {
    console.log("hey", since)
  }

  let endpoint = (state) => getEndpoint(state, `u/${user.user_id}/c/`,
                                        state.temps.user.session)
  

  return {
    [CALL_API]: {
      types: [ types.CARDS_LIST_REQUEST, types.CARDS_LIST_SUCCESS, types.CARDS_LIST_FAILURE ],
      endpoint
    }
  }
}


export function wkeyFetchRemote(user) {
  console.log("registerUserRemote building a CALL_API action for user:", user)
  return {
    [CALL_API]: {
      types: [ types.WKEY_FETCH_REQUEST, types.WKEY_FETCH_SUCCESS, types.WKEY_FETCH_FAILURE ],
      endpoint: {
        url: "http://localhost:8000/api/register",
        opts: {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        }
      }
    }
  }
}
