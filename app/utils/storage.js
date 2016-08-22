// function saveState(state) {
//  chrome.storage.local.set({ state: JSON.stringify(state) });
// }

// todos unmarked count
function setBadge(todos) {
  console.log("setBadge in storage");
  if (chrome.browserAction) {
    // const count = todos.filter((todo) => !todo.marked).length;
    // chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {

  return next => (reducer, initialState) => {
    console.log("about to get store after reducer");
    const store = next(reducer, initialState);
    if (chrome.tabs) {
      console.log("we're background, got store, gonna subscribe and persist")
      store.subscribe(() => {
        const state = store.getState();
//        saveState(state);
      });
    }
    return store;
  };
}
