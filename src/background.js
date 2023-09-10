chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 处理接收到的消息和数据
    console.log('调试数据:', message, sender);

    // 可选：发送响应消息
    // sendResponse({ response: '已收到数据' });
  });
});
