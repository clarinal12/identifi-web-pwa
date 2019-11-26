import React, { useState, forwardRef, useImperativeHandle } from 'react';
import * as H from 'history';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List, Tabs } from 'antd';

import { TPastCheckIns } from 'apollo/types/graphql-types';
import PastCheckInDetails from './components/PastCheckInDetails';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface IPastCheckInList {
  data: TPastCheckIns[],
  ref: any,
  routeParams: {
    date: string,
    id: string,
  },
  history: H.History<any>,
  location: H.Location<any>,
}

const StyledTabs = styled(Tabs)`
  .ant-tabs-bar {
    display: none;
  }
`;

const StyledListWrapper = styled.div`
  .ant-list-item {
    &:hover {
      background: rgba(0, 0, 0, 0.075);
      cursor: pointer;
    }
    .list-content-wrapper {
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const StyledEmptyRow = styled(Row)`
  min-height: 350px;
  justify-content: center;
  align-items: center;
`;

const EmptyState = () => (
  <StyledEmptyRow className="d-flex">
    <Col sm={6} className="text-center">
      <Icon type="clock-circle" style={{ fontSize: 75, color: '#DADADA' }} />
      <Title className="mt-4" level={2}>No past check-ins yet</Title>
      <Text>Once you go through your first cycle for this check-in, all past check-ins will appear here.</Text>
    </Col>
  </StyledEmptyRow>
);

const PastCheckInList: React.FC<IPastCheckInList> = forwardRef(({ data, routeParams, history, location }, ref) => {
  const { id } = data.find(({ date }) => {
    const dateFromRoute = moment(new Date(routeParams.date)).format('MMM DD, YYYY hh:mm A');
    const pastCheckInDate = moment(date).format('MMM DD, YYYY hh:mm A');
    return dateFromRoute === pastCheckInDate;
  }) || { id: routeParams.date ? 'invalid-checkin-id' : '' };

  const [pastCheckInId, setPastCheckInId] = useState<string>(id);

  useImperativeHandle(ref, () => ({
    resetCheckInId() {
      if (pastCheckInId) {
        setPastCheckInId('');
        history.push({
          pathname: `/checkins/${routeParams.id}`,
          state: {
            id_alias: location.state.id_alias,
          },
        });
      }
    }
  }));

  return (data.length > 0) ? (
    <StyledTabs
      className="mt-2"
      activeKey={(pastCheckInId && routeParams.date) ? '2' : '1'}
    >
      <TabPane tab="Past check-in list" key="1">
        <StyledListWrapper>
          <List
            style={{ background: '#FFF' }}
            size="large"
            bordered
            dataSource={data}
            renderItem={({ date, id }) => (
              <List.Item
                key={id}
                onClick={() => {
                  const formatDate = moment(date);
                  setPastCheckInId(id);
                  history.push({
                    pathname: `/checkins/${routeParams.id}/${formatDate.format('MM-DD-YYYY-HH:mm')}`,
                    state: {
                      ...location.state,
                      date_alias: moment(date).format('MMM DD, YYYY'),
                    },
                  });
                }}
              >
                <div className="d-flex list-content-wrapper">
                  <Text strong>{moment(date).format('MMM DD, YYYY hh:mm A')}</Text>
                  <Icon className="float-right" type="right" />
                </div>
              </List.Item>
            )}
          />
        </StyledListWrapper>
      </TabPane>
      <TabPane tab="Past check-in details" key="2">
        {pastCheckInId && <PastCheckInDetails id={pastCheckInId} />}
      </TabPane>
    </StyledTabs>
  ) : (
    <EmptyState />
  );
});

export default PastCheckInList;
