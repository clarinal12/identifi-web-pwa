import React from 'react';
import { Row, Col } from 'antd';

import AppLayout from 'components/AppLayout';
import SlackIntegration from 'HOC/SlackIntegration';
import MemberList from './components/MemberList';
import { MembersProvider } from 'contexts/MembersContext';

const Members = () => (
  <MembersProvider>
    <AppLayout>
      <Row>
        <Col>
          <MemberList />
        </Col>
      </Row>
    </AppLayout>
  </MembersProvider>
);

export default SlackIntegration(
  Members,
  "Identifi uses Slack to run check-ins with your team. Click the button below to connect install our Slack bot and get started."
);
