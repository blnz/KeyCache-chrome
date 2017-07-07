let windowId = 0;
const CONTEXT_MENU_ID = 'KeyCache_context_menu';

function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId);
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(type) {
  closeIfExist();
  const options = {
    type: 'popup',
    left: 100,
    top: 100,
    width: 800,
    height: 475
  };
  if (type === 'open') {
    options.url = 'window.html';
    chrome.windows.create(options, (win) => {
      windowId = win.id;
    });
  }
}

// FIXME: we might wanna do this only after we determine the page has an interesting form
chrome.contextMenus.create({
  id: CONTEXT_MENU_ID,
  title: 'KeyCache',
  contexts: ['all'],
  documentUrlPatterns: [
    'https://*/*'
  ]
});

chrome.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId === CONTEXT_MENU_ID) {
    popWindow('open');
  }
});
