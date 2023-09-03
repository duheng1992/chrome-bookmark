// 当用户添加标签时，使用chrome.storage保存标签信息
export const saveTagForBookmark = (bookmarkId, tags) => {
  chrome.storage.sync.set({ 'chrome-bookmark': { [bookmarkId]: tags } }, function () {
    chrome.runtime.sendMessage({
      addTag: { bookmarkId, tags }
    });
  });
}

// 当用户删除标签时，使用chrome.storage从存储中删除标签信息
export const removeTagForBookmark = (bookmarkId) => {
  chrome.storage.sync.remove([bookmarkId], function () {
    console.log('Tag removed for bookmark: ', bookmarkId);
  });
}

export const getTagForBookmark = (callback) => {
  chrome.storage.sync.get(null, function (items) {
    // items 包含了所有存储在storage中的键值对
    chrome.runtime.sendMessage({
      getTags: { ...items }
    });

    callback(items);
  });
}