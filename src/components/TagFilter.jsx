import { useState } from 'react'
import { Space, Tag } from 'antd';
import { tagLevelColorMap, tagLevel } from '../utils/const';

const { CheckableTag } = Tag;

function TagFilter({ callback, initValues }) {
  const [selectedTags, setSelectedTags] = useState(initValues || []);

  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);

    callback && callback(nextSelectedTags);
  };

  return <Space size={1} wrap align="center" className='ml-4'>
    标签：
    {tagLevel.map((tag) => (
      <CheckableTag
        key={tag}
        checked={selectedTags.includes(tag)}
        color="red"
        style={selectedTags.includes(tag) ? { background: tag } : {}}
        onChange={(checked) => handleTagChange(tag, checked)}
      >
        {tagLevelColorMap[tag]}
      </CheckableTag>
    ))}
  </Space>

}

export default TagFilter;