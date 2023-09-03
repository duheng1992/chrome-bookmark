import { useEffect, useState } from 'react'
import { Col, Row, Button, Space, Popconfirm, Input, Tag, message, Select } from 'antd';
import { TagOutlined } from '@ant-design/icons';

import { saveTagForBookmark } from '../utils';
import { tagLevelColorMap } from '../utils/const';

import TagFilter from '../components/TagFilter';

const tagStyle = {
  cursor: 'pointer',
  transition: 'unset', // Prevent element from shaking after drag
};

function MenuItem({ id, label, tagStoreMap, callback }) {
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
    callback && callback();
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

  return <Row key={id}>
    <Col span={21}>
      {label || '-'}
      {tagStoreMap[id] ? <Space className='ml-4' size={1}>
        {(tagStoreMap[id] || []).map(tag => {
          return <Tag key={tag} color={tag} style={tagStyle}>{tagLevelColorMap[tag]}</Tag>
        })}
      </Space> : null}
    </Col>
    <Col span={3}>
      <Space wrap>
        <Popconfirm
          title="添加标签"
          icon={null}
          description={
            <TagFilter callback={values => {
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
  </Row>
}

export default MenuItem;