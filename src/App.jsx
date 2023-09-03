import { useEffect, useState, useMemo } from 'react'

import { Layout, Menu, Segmented, Empty, Row, Col, Badge } from 'antd';

import './App.css';
import MenuItem from './components/MenuItem';
import ToolBar from './components/ToolBar';

import { getTagForBookmark } from './utils';

const handleRedirect = url => {
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

function App() {
  const [treeRoot, setTreeRoot] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState();
  const [searchTag, setSearchTag] = useState([]);
  const [segmentedOptions, setsegmentedOptions] = useState([]);
  const [segmentedValue, setSegmentedValue] = useState({});
  const [tagStoreMap, setTagStoreMap] = useState({});

  const filteredList = useMemo(() => {
    let result = list;

    if (search) {
      result = list.filter(item => `${item.name} ${item.key} ${item.url}`.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1);
    }

    if (searchTag && searchTag.length) {
      result = result.filter(item => searchTag.some(tag => (tagStoreMap[item.key] || []).includes(tag)));
    }

    return result;
  }, [list, search, searchTag, tagStoreMap]);

  const buildMeniItem = option => {
    return option.map(item => {
      return getItem(item.title, item.id, item.url);
    })
  }

  const onSegmentChange = value => {
    setSegmentedValue(value);
    chrome.runtime.sendMessage({
      currentSegment: value,
      options: segmentedOptions
    });
    setList(buildMeniItem(segmentedOptions.find(option => option.value === value)?.children || []));
  }

  const handleMenuClick = (e) => {
    const clickedItem = list.find(item => item.key === e.key);
    chrome.runtime.sendMessage({
      menuCLickKey: e.key,
      clickedItem
    });

    // 跳转链接
    if (clickedItem && clickedItem.url) {
      handleRedirect(clickedItem.url);
    }
  }

  const getItem = (label, id, url, icon, children, type) => {
    return {
      key: id,
      icon,
      children,
      name: label,
      label: <MenuItem id={id} label={label} tagStoreMap={tagStoreMap} callback={() => init()} />,
      type,
      url
    };
  }

  const init = () => {
    setList(buildMeniItem(treeRoot[0]?.children || []));
  }

  useEffect(() => {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      chrome.runtime.sendMessage({
        bookmarkTreeNodes
      });

      const root = (bookmarkTreeNodes || []).find(node => node.id === '0')?.children || (bookmarkTreeNodes || [])[0] || [];

      const options = root.map(item => {
        return {
          label: <div>
            <Badge count={item.children?.length || 0} size="small">
              {item.title}
            </Badge>
          </div>,
          value: item.id,
          children: item.children
        }
      });
      setsegmentedOptions(options);
      setSegmentedValue(options[0]?.value);
      setTreeRoot(root);
    });

    getTagForBookmark(item => {
      setTagStoreMap(item ? item['chrome-bookmark'] || {} : {})
    });
  }, [tagStoreMap]);

  useEffect(() => {
    // 属性刷新时，重置状态
    init();
  }, [treeRoot]);

  return (
    <>
      <Layout className="container">
        <ToolBar onSearch={setSearch} onTagSearch={setSearchTag} />
        <Segmented className="segmented" options={segmentedOptions} value={segmentedValue} onChange={onSegmentChange} />

        <Row className='list-row'>
          <Col className='list-col'>
            {list && list.length ?
              <Menu
                onClick={handleMenuClick}
                mode="inline"
                items={filteredList}
              /> : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
          </Col>
        </Row>
      </Layout>
    </>
  )
}

export default App
