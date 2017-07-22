import 'isomorphic-fetch';

function callApi(endpoint) {
  console.log('callApi for:', endpoint);
  const { url, opts } = endpoint;

  /***
      we fetch a url, when we recieve a response, we have a function
      then1: which takes a response, grabs the json and passes the json to a unction
      then2: which accepts the json as a param passes the json and respinse to a function
      then3: which check for a bad HTTP status code 
  **/

  return fetch(url, opts)
    .then(response => response.json()
      .then(json => ({ json, response })))
    .then(({ json, response }) => { // then3
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    });
}


// Action key that carries API call info interpreted by this Redux middleware.
// the API call info consists of an 'endpoint' and 3 'types' 
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.

// calling this with a 'store' yields a function which takes a 'next' which
// returns a function that accepts an 'action' which we define, here

export default store => next => (action) => {
  // the action contains an object bound to the CALL_API token
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined' || !store.getState().settings.useSyncServer) {
    // no-op if we're set for offline
    return next(action);
  }

  // this callAPI object contains an 'endpoint' and 'types'
  // dunno who creates the endpoint, but it's either a function or string
  // if it's a function, we call it and replace it with its return value
  // which must be a string

  let { endpoint } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (!endpoint.url) {
    throw new Error('Specify a string endpoint URL.');
  }

  // 'types' must be an array of 3 strings representing
  // 'request', 'success' and 'failure' actions
  const { types } = callAPI;

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};
