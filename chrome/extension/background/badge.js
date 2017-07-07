// show a count
chrome.storage.local.get('updates', (obj) => {
  //  console.log("running badge");
  let updates = obj.updates;
  if (updates) {
    updates = JSON.parse(updates);
    const len = updates.filter(todo => !todo.marked).length;
    if (len > 0) {
      chrome.browserAction.setBadgeText({ text: len.toString() });
    }
  } else {
    // Initial
    // chrome.browserAction.setBadgeText({ text: '1' });
  }
});
