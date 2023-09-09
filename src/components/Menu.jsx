import { useEffect, useState } from 'react'
import { Menu, Empty, Row, Col } from 'antd';

import { handleRedirect } from '../utils';

/**
 * 书签菜单列表
 * @param {*} list 数据源；search, searchTag 搜索字段；tagStoreMap 存储在本地的标签
 * @returns 
 */
function BookmarkMenu({ list, search, searchTag, tagStoreMap }) {
  const [filteredList, setFilteredList] = useState([]);

  const handleMenuClick = e => {
    let clickedItem;
    const findStack = [...list];

    while(findStack.length) {
      const currentNode = findStack.pop();
      
      if (currentNode.key === e.key) {
        clickedItem = currentNode;
        break; 
      }

      if (currentNode.children && currentNode.children.length) {
        findStack.push(...currentNode.children);
      }
    }

    chrome.runtime.sendMessage({
      menuCLickKey: e.key,
      clickedItem
    });

    // 跳转链接
    if (clickedItem && clickedItem.url) {
      handleRedirect(clickedItem.url);
    }
  }

  useEffect(() => {
    let wipFiltered = list;
    if (search) {
      wipFiltered = wipFiltered.filter(item => {
        return `${item.name} ${item.key} ${item.url}`.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
      });
    }
    if (searchTag && searchTag.length) {
      wipFiltered = wipFiltered.filter(item => {
        return searchTag.some(tag => (tagStoreMap[item.key] || []).includes(tag))
      });
    }

    setFilteredList(wipFiltered);
  }, [searchTag, search, list]);

  return (
    <Row className='list-row'>
      <Col className='list-col'>
        {filteredList && filteredList.length ?
          <Menu
            onClick={handleMenuClick}
            mode="inline"
            items={filteredList}
          /> : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
      </Col>
    </Row>
  )
}

export default BookmarkMenu;