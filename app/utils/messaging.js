
var listener = function() {}

if (process.env.NODE_ENV === 'production') {
  module.exports.sendMessage = chrome.runtime.sendMessage;
  module.exports.addListener = (func) => { chrome.runtime.onMessage.addListener(func) }
} if (process.env.NODE_ENV === 'pwa') {
  module.exports.sendMessage = (msg, resp) => {
    console.log("pwa:: calling listener for", msg);
    listener(msg, "self", resp);
  }
  module.exports.addListener = (func) => { listener = func }
} else {
  module.exports.sendMessage = chrome.runtime.sendMessage;
  module.exports.addListener = (func) => { chrome.runtime.onMessage.addListener(func) }
}
