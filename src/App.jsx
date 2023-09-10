import { useEffect, useState, useCallback } from 'react'

import { Layout, Segmented, ConfigProvider, theme } from 'antd';

import './App.css';

import BookmarkMenu from './components/Menu';
import ToolBar from './components/ToolBar';

import { getBookmarkList, getSegmentedOptions, getStorageTagForBookmark, buildMenuItem, removeTagForBookmark } from './utils';
import { THEME } from './utils/const';
import { sendMessageToBackground } from './utils/message';

function App() {
  const [currentTheme, setTheme] = useState(THEME.LIGHT);
  const [bookmarkList, setBookmarkList] = useState([]);
  const [currentMenuList, setCurrentMenuList] = useState([]);
  const [segmentedOptions, setSegmentedOptions] = useState([]);
  const [storageTagForBookmark, setStorageTagForBookmark] = useState({});
  const [search, setSearch] = useState();
  const [searchTag, setSearchTag] = useState([]);
  const [segmentedValue, setSegmentedValue] = useState();

  const getMenuItems = useCallback(value => {
    return buildMenuItem((value ? bookmarkList.find(item => +item.id === +value)?.children : bookmarkList[0]?.children) || [], storageTagForBookmark, onAfterAddTags);
  }, [bookmarkList, storageTagForBookmark]);

  const onAfterAddTags = useCallback(() => {
    // 刷新列表
    initList();
  }, []);

  const onSegmentChange = useCallback(value => {
    setSegmentedValue(value);

    // 在书签列表里通过id反查对应的列表
    setCurrentMenuList(getMenuItems(value));

    sendMessageToBackground({
      action: 'onSegmentChange',
      currentSegment: value,
      options: segmentedOptions
    });
  }, [segmentedOptions]);

  const onThemeChange = useCallback(theme => {
    setTheme(theme)
  }, []);

  const initList = useCallback(() => {
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
  }, [segmentedValue]);

  useEffect(() => {
    setCurrentMenuList(getMenuItems());
  }, [bookmarkList, storageTagForBookmark]);

  useEffect(() => {
    // removeTagForBookmark()
    initList();
    // 根据系统初始化主题
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT);
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: currentTheme === THEME.DARK ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout className="container">
        <ToolBar onSearch={setSearch} onTagSearch={setSearchTag} theme={currentTheme} onThemeChange={onThemeChange} />
        <Segmented className="segmented" options={segmentedOptions} value={segmentedValue} onChange={onSegmentChange} />
        <BookmarkMenu list={currentMenuList} search={search} searchTag={searchTag} tagStoreMap={storageTagForBookmark} />
      </Layout>
    </ConfigProvider>
  )
}

export default App
