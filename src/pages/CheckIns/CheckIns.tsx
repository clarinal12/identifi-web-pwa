import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Typography, Button, Tabs, Tooltip } from 'antd';

import AppLayout from 'components/AppLayout';
import SlackIntegration from 'HOC/SlackIntegration';
import CheckInList from './components/CheckInList';
import { useUserContextValue } from 'contexts/UserContext'
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext'

const { Title } = Typography;
const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
  .ant-tabs-bar {
    margin-bottom: 24px;
  }
`;

const CheckIns: React.FC = () => {
  const { checkInSchedules } = useCheckInScheduleContextValue();
  const { account } = useUserContextValue();
  const memberInfo = account && account.memberInfo;
  return (
    <AppLayout>
      <Row className="mb-4">
        <Col sm={12}>
          <Title level={3}>Check-ins</Title>
        </Col>
        <Col sm={12}>
          {(checkInSchedules.length > 0) && (
            <Link className="float-right" to="/checkins/new">
              <Button
                size="large"
                type="primary"
              >
                New check-in
              </Button>
            </Link>
          )}
        </Col>
      </Row>
      <StyledTabs defaultActiveKey={(memberInfo && memberInfo.isOwner) ? '2' : '1'}>
        <TabPane
          key="1"
          tab={(
            <Tooltip title="All check-ins I am participating in.">
              <Title style={{ fontSize: 16 }}>My check-ins</Title>
            </Tooltip>
          )}
        >
          <CheckInList participatingOnly />
        </TabPane>
        <TabPane
          key="2"
          tab={(
            <Tooltip title="All check-ins across the company.">
              <Title style={{ fontSize: 16 }}>All check-ins</Title>
            </Tooltip>
          )}
        >
          <CheckInList />
        </TabPane>
      </StyledTabs>
    </AppLayout>
  );
}

export default SlackIntegration(
  CheckIns,
  "Identifi uses Slack to run check-ins with your team. Click the button below to connect install our Slack bot and get started."
);
