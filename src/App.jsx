import { useEffect, useState } from 'react'

import { Layout, Segmented } from 'antd';

import './App.css';

import BookmarkMenu from './components/Menu';
import ToolBar from './components/ToolBar';

import { getBookmarkList, getSegmentedOptions, getStorageTagForBookmark, buildMenuItem, removeTagForBookmark } from './utils';

function App() {
  const [bookmarkList, setBookmarkList] = useState([]);
  const [currentMenuList, setCurrentMenuList] = useState([]);
  const [segmentedOptions, setSegmentedOptions] = useState([]);
  const [storageTagForBookmark, setStorageTagForBookmark] = useState({});
  const [search, setSearch] = useState();
  const [searchTag, setSearchTag] = useState([]);
  const [segmentedValue, setSegmentedValue] = useState();

  const getMenuItems = value => {
    return buildMenuItem((value ? bookmarkList.find(item => +item.id === +value)?.children : bookmarkList[0]?.children) || [], storageTagForBookmark, onAfterAddTags);
  }

  const onAfterAddTags = () => {
    // 刷新列表
    initList();
  }

  const onSegmentChange = value => {
    setSegmentedValue(value);

    // 在书签列表里通过id反查对应的列表
    setCurrentMenuList(getMenuItems(value));

    chrome.runtime.sendMessage({
      currentSegment: value,
      options: segmentedOptions
    });
  }

  const initList = () => {
    // 1. 获取书签列表
    getBookmarkList((root) => {
      setBookmarkList(root);
      // 2. 设置分段器参数
      const options = getSegmentedOptions(root) || [];
      setSegmentedOptions(options);
      setSegmentedValue(segmentedValue || options[0]?.value || {});
    });

    // 3. 获取本地存储标签
    getStorageTagForBookmark(root => {
      setStorageTagForBookmark(root || {});
    });
  }

  useEffect(() => {
    setCurrentMenuList(getMenuItems());
  }, [bookmarkList, storageTagForBookmark]);

  useEffect(() => {
    // removeTagForBookmark()
    initList();
  }, []);

  return (
    <>
      <Layout className="container">
        <ToolBar onSearch={setSearch} onTagSearch={setSearchTag} />
        <Segmented className="segmented" options={segmentedOptions} value={segmentedValue} onChange={onSegmentChange} />

        <BookmarkMenu list={currentMenuList} search={search} searchTag={searchTag} tagStoreMap={storageTagForBookmark} />
      </Layout>
    </>
  )
}

export default App
