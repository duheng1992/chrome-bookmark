import { useState, useEffect } from 'react'
import { Col, Row, Button, Space, Popconfirm, Tag } from 'antd';
import { TagOutlined } from '@ant-design/icons';

import { saveTagForBookmark } from '../utils';
import { tagLevelColorMap } from '../utils/const';

import TagFilter from '../components/TagFilter';

const tagStyle = {
  cursor: 'pointer',
  transition: 'unset', // Prevent element from shaking after drag
};

function MenuItem({ id, label, tagStoreMap = {}, isDir, callback }) {
  const [tagValues, setTagValues] = useState([]);

  const onTagSelect = tags => {
    setTagValues(tags);
  }

  const addTag = (id) => {
    // if (tagValues && tagValues.length >= 4) {
    //   message.warning('一个书签目前只支持最多4个标签！');
    //   return;
    // }
    saveTagForBookmark(id, [...tagValues]);
  }

  const closeAdd = () => {
    setTagValues([]);
  }

  // const handleAddTagOpenChange = (newOpen) => {
  //   setAddTagOpen(newOpen);
  // }

  const handleAddTag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    // 当存储变化时，再更新列表
    chrome.storage.onChanged.addListener(function() {  
      // alert(JSON.stringify(changes))
      callback && callback();
    })
  }, []);

  return <Row key={id}>
    <Col span={21}>
      {label || '-'}
      {!isDir && tagStoreMap[id] ? <Space className='ml-4' size={1}>
        {(tagStoreMap[id] || []).map(tag => {
          return <Tag key={tag} color={tag} style={tagStyle}>{tagLevelColorMap[tag]}</Tag>
        })}
      </Space> : null}
    </Col>
    {!isDir && (
      <Col span={3}>
        <Space wrap>
          <Popconfirm
            title="添加标签"
            icon={null}
            description={
              <TagFilter initValues={tagStoreMap[id]} callback={values => {
                // 设置标签
                onTagSelect(values);
              }} />
            }
            onConfirm={() => addTag(id, label)}
            onCancel={closeAdd}
            // onOpenChange={handleAddTagOpenChange}
            onPopupClick={e => e.stopPropagation()}
            okText="确定"
            cancelText="取消"
          >
            {/* <Tooltip title="添加标签"> */}
            <Button shape="circle" icon={<TagOutlined />} onClick={(e) => handleAddTag(e)} />
            {/* </Tooltip> */}
          </Popconfirm>
        </Space>
      </Col>
    )}
  </Row>
}

export default MenuItem;