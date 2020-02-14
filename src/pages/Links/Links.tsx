import React from 'react';
import { Row, Col } from 'antd';

import AppLayout from 'components/AppLayout';
import LinkList from './components/LinkList';

const Links = () => {
  return (
    <AppLayout>
      <Row>
        <Col>
          <LinkList />
        </Col>
      </Row>
    </AppLayout>
  );
}

export default Links;
