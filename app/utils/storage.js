function saveState(state) {
  chrome.storage.local.set({ state: JSON.stringify(state) });
}

// todos unmarked count
function setBadge(todos) {
  console.log("setBadge in storage");
  if (chrome.browserAction) {
    const count = todos.filter((todo) => !todo.marked).length;
    chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {
  // we export a middleware function that returns
  //   a function taking one arg: (a function called "next") and  returns
  //     a function that takes  two args: ( a reducer and initial state )
  //        it invokes the "next" function with the reducer and initial state to obtain a store
  //        gets the state from the store
  //        persists the store
  //        updates the badge from the store
  //        then returns the store
  return next => (reducer, initialState) => {
    console.log("about to get store after reducer");
    const store = next(reducer, initialState);
    console.log("got store, gonna subscribe")
    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      setBadge(state.todos);
    });
    return store;
  };
}
