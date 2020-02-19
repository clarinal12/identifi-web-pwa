import React from 'react';
import { Row, Col } from 'antd';

import AppLayout from 'components/AppLayout';
import SlackIntegration from 'HOC/SlackIntegration';
import MembersTable from './components/MembersTable';
import { MembersProvider } from 'contexts/MembersContext';

const People = () => (
  <MembersProvider>
    <AppLayout>
      <Row>
        <Col>
          <MembersTable />
        </Col>
      </Row>
    </AppLayout>
  </MembersProvider>
);

export default SlackIntegration(
  People,
  "Identifi uses Slack to run check-ins with your team. Click the button below to connect install our Slack bot and get started."
);
