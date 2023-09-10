import { Badge } from 'antd';

import MenuItem from '../components/MenuItem';
import { sendMessageToBackground } from './message';

// 当用户添加标签时，使用chrome.storage保存标签信息
export const saveTagForBookmark = (bookmarkId, tags) => {
  getStorageTagForBookmark(exists => {
    const newTags = Object.assign({}, exists, { [bookmarkId]: tags });
    chrome.storage.sync.set({ 'chrome-bookmark': newTags }, function () {
      sendMessageToBackground({
        action: 'saveTagForBookmark',
        addTag: { bookmarkId, newTags }
      });
    });
  });
}

// 当用户删除标签时，使用chrome.storage从存储中删除标签信息
export const removeTagForBookmark = () => {
  chrome.storage.sync.remove(['chrome-bookmark'], function () {
  });
}

export const getStorageTagForBookmark = callback => {
  chrome.storage.sync.get(null, function (items) {
    // items 包含了所有存储在storage中的键值对
    sendMessageToBackground({
      action: 'getStorageTagForBookmark',
      getTags: { ...items }
    });

    callback && callback(items['chrome-bookmark'] || {});
  });
}

export const handleRedirect = url => {
  // 获取当前活动的标签页
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      const currentTab = tabs[0];

      // 使用chrome.tabs.update方法更新标签页的URL
      chrome.tabs.update(currentTab.id, { url }, function (updatedTab) {
        if (chrome.runtime.lastError) {
          // 处理更新标签页失败的情况
          console.error(chrome.runtime.lastError);
        } else {
          // 标签页已成功更新到新的URL
          console.log("标签页已重定向到新的URL: " + updatedTab.url);
        }
      });
    }
  });
}

export const getBookmarkList = (callback) => {
  chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
    sendMessageToBackground({
      action: 'getBookmarkList',
      bookmarkTreeNodes
    });

    const root = (bookmarkTreeNodes || []).find(node => node.id === '0')?.children || (bookmarkTreeNodes || [])[0] || [];

    callback && callback(root);
  });
}

export const getSegmentedOptions = root => {
  if (Array.isArray(root)) {
    return root.map(item => {
      return {
        label: <div>
          <Badge count={item?.children?.length || 0} size="small">
            {item.title}
          </Badge>
        </div>,
        value: item.id,
        children: item.children
      }
    });
  }

  return [];
}

// callback 返回打标签后事件
export const buildMenuItem = (option, tagStoreMap, callback) => {
  const getItem = (label, id, url, icon, children, type) => {
    return {
      key: id,
      icon,
      children,
      name: label,
      label: <MenuItem id={id} label={label} isDir={children && children.length} tagStoreMap={tagStoreMap || {}} callback={() => callback && callback()} />,
      type,
      url
    };
  }

  // 递归实现标签树
  return option.map(item => {
    return getItem(item.title, item.id, item.url, null, item.children && item.children.length ? buildMenuItem(item.children, tagStoreMap, callback) : null);
  })
}