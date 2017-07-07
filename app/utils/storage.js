
// function setBadge(todos) {

//   if (chrome.browserAction) {
//     // const count = todos.filter((todo) => !todo.marked).length;
//     // chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : '' });
//   }
// }

export default () => {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    const chrome = Object.assign({}, chrome);
      if (chrome.tabs) {
        store.subscribe( () => {
          const state = store.getState();
        });
      }
    return store;
  };
}
