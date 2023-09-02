import { useEffect, useState } from 'react'

import { Layout, Menu, Segmented } from 'antd';

import './App.css';

function getItem(label, key, url, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
    url
  };
}

function App() {
  const [list, setList] = useState([]);
  const [segmentedOptions, setsegmentedOptions] = useState([]);
  const [segmentedValue, setSegmentedValue] = useState({});

  useEffect(() => {
    setTimeout(function () {
      chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
        chrome.runtime.sendMessage({
          bookmarkTreeNodes
        });

        const root = (bookmarkTreeNodes || []).find(node => node.id === '0')?.children || (bookmarkTreeNodes || [])[0] || [];

        const options = root.map(item => {
          return {
            label: item.title,
            value: item.id,
            children: item.children
          }
        });
        setsegmentedOptions(options);

        setSegmentedValue(options[0]?.value);

        setList(buildMeniItem(root[0]?.children || []));
      });
    }, 0);
  }, []);

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

  return (
    <>
      <Layout className="container">
        <Segmented options={segmentedOptions} value={segmentedValue} onChange={onSegmentChange} />

        <Menu
          onClick={handleMenuClick}
          // style={{ width: 256 }}
          // defaultSelectedKeys={['1']}
          // defaultOpenKeys={['sub1']}
          mode="inline"
          items={list}
        />
      </Layout>
    </>
  )
}

export default App
