const bluebird = require('bluebird');
global.Promise = bluebird;
import * as types from '../constants/ActionTypes';
import { testKeyWrapper, wrappedKey, testWrapping } from '../utils/kcCrypto';

export function addCard(cardData) {
  return { type: types.ADD_CARD, cardData };
}

export function registerUser(userData) {
  return function (dispatch) {
    console.log("generateAESKey got dispatch");
    var keyPromise = window.crypto.subtle.generateKey(
      {name: "AES-CBC", length: 256}, // Algorithm the key will be used with
      true,                           // Can extract key value to binary string
      ["encrypt", "decrypt"]          // Use for these operations
    );
    //This will try to create a new, random key, and pass it to the promise’s then method. We will just save it for now:

    keyPromise.then(function(key) {
      console.log("got AES-KEY:", key)
      dispatch(registerUserData(userData));
      return key;
    }).then(function(something) {
      console.log("proceeding", something)
//return wrappedKey('foobar', something);
      return testWrapping('foobar')
    }).then (function(more){
      console.log("got more", more)
    })
    keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});

  };

  return { type: types.REGISTER_USER, userData };
}

export function registerUserData(userData) {
  return { type: types.REGISTER_USER, userData };
}

export function setClearMasterKey(masterKey) {
  return { type: types.SET_CLEAR_MASTERKEY, msterKey };
}

export function addTodo(text) {
  return { type: types.ADD_TODO, text };
}

export function deleteTodo(id) {
  return { type: types.DELETE_TODO, id };
}

export function editTodo(id, text) {
  return { type: types.EDIT_TODO, id, text };
}

export function completeTodo(id) {
  return { type: types.COMPLETE_TODO, id };
}

export function completeAll() {
  return { type: types.COMPLETE_ALL };
}

export function clearCompleted() {
  return { type: types.CLEAR_COMPLETED };
}



export function fetchSecretSauce() {
  return fetch('https://localhost:3000/js/inject.bundle.js');
}

// export fetchSecretSauce;
// These are the normal action creators you have seen so far.
// The actions they return can be dispatched without any middleware.
// However, they only express “facts” and not the “async flow”.

function makeASandwich(forPerson, secretSauce) {
  console.log("making sandwich for:", forPerson);
  return {
    type: 'MAKE_SANDWICH',
    forPerson,
    secretSauce
  };
}

function apologize(fromPerson, toPerson, error) {
  console.log("apologizing:", fromPerson, toPerson, error);
  return {
    type: 'APOLOGIZE',
    fromPerson,
    toPerson,
    error
  };
}

function withdrawMoney(amount) {
  return {
    type: 'WITHDRAW',
    amount
  };
}


function generateAESKey() {
  return function (dispatch) {
    console.log("generateAESKey got dispatch");
    var keyPromise = window.crypto.subtle.generateKey(
      {name: "AES-CBC", length: 128}, // Algorithm the key will be used with
      true,                           // Can extract key value to binary string
      ["encrypt", "decrypt"]          // Use for these operations
    );
    //This will try to create a new, random key, and pass it to the promise’s then method. We will just save it for now:


    keyPromise.then(function(key) {
      console.log("got AES-KEY:", key)
    });
    keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});

  };

}

// Even without middleware, you can dispatch an action:
// store.dispatch(withdrawMoney(100));

// But what do you do when you need to start an asynchronous action,
// such as an API call, or a router transition?

// Meet thunks.
// A thunk is a function that returns a function.
// This is a thunk.

export function makeASandwichWithSecretSauce(forPerson) {

  // Invert control!
  // Return a function that accepts `dispatch` so we can dispatch later.
  // Thunk middleware knows how to turn thunk async actions into actions.

  return function (dispatch) {
    return fetchSecretSauce().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize('The Sandwich Shop', forPerson, error))
    );
  };
}

// Thunk middleware lets me dispatch thunk async actions
// as if they were actions!

// store.dispatch(
//   makeASandwichWithSecretSauce('Me')
// );

// It even takes care to return the thunk’s return value
// from the dispatch, so I can chain Promises as long as I return them.

// store.dispatch(
//   makeASandwichWithSecretSauce('My wife')
// ).then(() => {
//   console.log('Done!');
// });

// In fact I can write action creators that dispatch
// actions and async actions from other action creators,
// and I can build my control flow with Promises.

export function makeSandwichesForEverybody() {
  return function (dispatch, getState) {
    console.log("makeSandwichesForEverybody function called by thunker");
    //if (!getState().sandwiches.isShopOpen) {

      // You don’t have to return Promises, but it’s a handy convention
      // so the caller can always call .then() on async dispatch result.

    //  return Promise.resolve();
    // }

    // We can dispatch both plain object actions and other thunks,
    // which lets us compose the asynchronous actions in a single flow.

    return dispatch(
      makeASandwichWithSecretSauce('My Grandma')
    ).then(() =>
      Promise.all([
        dispatch(makeASandwichWithSecretSauce('Me')),
        dispatch(makeASandwichWithSecretSauce('My wife'))
      ])
    ).then(() =>
      dispatch(makeASandwichWithSecretSauce('Our kids'))
    ).then(() =>
      dispatch(getState().myMoney > 42 ?
        withdrawMoney(42) :
        apologize('Me', 'The Sandwich Shop')
      )
    );
  };
}
