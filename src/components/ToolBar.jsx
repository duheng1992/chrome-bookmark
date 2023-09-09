import { Col, Row, Input } from 'antd';

import TagFilter from '../components/TagFilter';

const { Search } = Input;

function ToolBar({ onSearch, onTagSearch }) {

return <Row className='list-row mb-4'>
    <Col span={8}>
      <Search placeholder="input search text" onSearch={onSearch} />
    </Col>
    <Col span={16} className="flex-xy-center">
      <TagFilter callback={onTagSearch} />
    </Col>
  </Row>
}

export default ToolBar;