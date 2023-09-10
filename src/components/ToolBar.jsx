import { memo } from 'react';
import { Col, Row, Input, Switch } from 'antd';
import { HappyProvider } from '@ant-design/happy-work-theme';

import TagFilter from '../components/TagFilter';
import { THEME } from '../utils/const';

const { Search } = Input;

// const Moon = <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" tabindex="-1" title="NightsStayOutlined" data-ga-event-action="click" data-ga-event-label="NightsStayOutlined"><path d="M19.78 17.51c-2.47 0-6.57-1.33-8.68-5.43-2.33-4.51-.5-8.48.53-10.07C6.27 2.2 1.98 6.59 1.98 12c0 .14.02.28.02.42.61-.26 1.28-.42 1.98-.42 0-3.09 1.73-5.77 4.3-7.1-.5 2.19-.54 5.04 1.04 8.1 1.57 3.04 4.18 4.95 6.8 5.86-1.23.74-2.65 1.15-4.13 1.15-.5 0-1-.05-1.48-.14-.37.7-.94 1.27-1.64 1.64.98.32 2.03.5 3.11.5 3.5 0 6.58-1.8 8.37-4.52-.17.01-.37.02-.57.02z"></path><path d="M7 16h-.18C6.4 14.84 5.3 14 4 14c-1.66 0-3 1.34-3 3s1.34 3 3 3h3c1.1 0 2-.9 2-2s-.9-2-2-2z"></path></svg>;
// const Sun = <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" tabindex="-1" title="WbSunnyOutlined" data-ga-event-action="click" data-ga-event-label="WbSunnyOutlined"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115l1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41 1.79-1.8-1.41-1.41z"></path></svg>;

function ToolBar({ theme, onSearch, onTagSearch, onThemeChange }) {
  return <Row className='list-row mb-4'>
    <Col span={7}>
      <Search placeholder="input search text" onSearch={onSearch} />
    </Col>
    <Col span={14} className="flex-xy-center">
      <TagFilter callback={onTagSearch} />
    </Col>
    <Col span={2} className="flex-xy-center">
      <HappyProvider>
        <Switch
          checkedChildren={'☀ '}
          unCheckedChildren={'☽'}
          checked={theme === THEME.LIGHT}
          onChange={checked => onThemeChange(checked ? THEME.LIGHT : THEME.DARK)}
        />
      </HappyProvider>
    </Col>
  </Row>
}

export default memo(ToolBar);