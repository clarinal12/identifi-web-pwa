import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Typography, Button, Tabs, Tooltip, Select } from 'antd';

import AppLayout from 'components/AppLayout';
import SlackIntegration from 'HOC/SlackIntegration';
import CheckInList from './components/CheckInList';
import { useUserContextValue } from 'contexts/UserContext'
import { CheckInScheduleProviderWithRouter } from 'contexts/CheckInScheduleContext';
import { CheckInScheduleConsumer } from 'contexts/CheckInScheduleContext'
import { useCheckInFilterContextValue, FILTER_OPTIONS, TFilterState } from 'contexts/CheckInFilterContext'

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
  .ant-tabs-bar {
    margin-bottom: 24px;
    border: 0;
  }
`;

const CheckIns: React.FC = () => {
  const { account } = useUserContextValue();
  const { filterState, setFilterState } = useCheckInFilterContextValue();
  return (
    <CheckInScheduleProviderWithRouter>
      <AppLayout>
        <CheckInScheduleConsumer>
          {({ checkInCards }) => (
            <Row className="mb-4">
              <Col sm={12}>
                <Title level={3}>Check-ins</Title>
              </Col>
              <Col sm={12}>
                {(checkInCards.allCheckIns.length > 0) && (account?.isOwner) && (
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
          )}
        </CheckInScheduleConsumer>
        <StyledTabs
          defaultActiveKey={(account?.isOwner) ? '2' : '1'}
          tabBarExtraContent={(
            <Select<TFilterState>
              className="text-capitalize"
              size="large"
              showSearch
              style={{ width: 200 }}
              placeholder="Select check-in status"
              value={filterState}
              onChange={v => setFilterState(v)}
            >
              {FILTER_OPTIONS.map(({ label }, idx) => (
                <Option className="text-capitalize" key={idx} value={label}>{label.toLowerCase()}</Option>
              ))}
            </Select>
          )}
        >
          <TabPane
            key="1"
            tab={(
              <Tooltip title="All check-ins I am participating in.">
                <Title className="fs-16">My check-ins</Title>
              </Tooltip>
            )}
          >
            <CheckInList participatingOnly />
          </TabPane>
          <TabPane
            key="2"
            tab={(
              <Tooltip title="All check-ins across the company.">
                <Title className="fs-16">All check-ins</Title>
              </Tooltip>
            )}
          >
            <CheckInList />
          </TabPane>
        </StyledTabs>
      </AppLayout>
    </CheckInScheduleProviderWithRouter>
  );
}

export default SlackIntegration(
  CheckIns,
  "Identifi uses Slack to run check-ins with your team. Click the button below to connect install our Slack bot and get started."
);
