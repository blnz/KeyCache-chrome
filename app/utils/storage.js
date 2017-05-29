
function setBadge(todos) {
  console.log("setBadge in storage");
  if (chrome.browserAction) {
    // const count = todos.filter((todo) => !todo.marked).length;
    // chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
  }
}

export default function () {

  return next => (reducer, initialState) => {

    const store = next(reducer, initialState);
    let chrome = Object.assign( {}, chrome );
      if (chrome.tabs) {
        
        store.subscribe(() => {
          const state = store.getState();
          //        saveState(state);
        });
      }
   
    return store;
  };
}
