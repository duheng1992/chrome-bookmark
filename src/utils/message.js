export const sendMessageToBackground = message => {
  chrome.runtime.sendMessage({
    ...message
  });
}