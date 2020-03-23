import React from 'react';
import { Row, Col, Typography } from 'antd';

import AppLayout from 'components/AppLayout';
import OneOnOneTable from './components/OneOnOneTable';

const { Title } = Typography;

const OneOnOne = () => {
  return (
    <AppLayout>
      <Row style={{ marginBottom: 32 }}>
        <Col>
          <Title level={3}>1-on-1s</Title>
        </Col>
      </Row>
      <OneOnOneTable />
    </AppLayout>
  );
}

export default OneOnOne;
