import React, { useState, forwardRef, useImperativeHandle } from 'react';
import * as H from 'history';
import moment from 'moment';
import styled from 'styled-components';
import { Icon, Typography, Row, Col, List, Tabs } from 'antd';

import { TPastCheckIns } from 'apollo/types/graphql-types';
import PastCheckInDetails from './components/PastCheckInDetails';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PastClockIcon = () => (
  <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7127 45.5066C15.7127 26.3587 31.5239 10.8508 50.8235 11.3816C68.6064 11.8746 83.4697 26.7379 83.9627 44.5208C84.4935 63.8204 68.9856 79.6316 49.8377 79.6316C41.9131 79.6316 34.671 76.9396 28.9077 72.3896C27.1256 71.0246 27.0118 68.3325 28.6043 66.74C29.9693 65.375 32.0927 65.2612 33.6093 66.4366C38.0835 69.9629 43.7331 72.0483 49.8377 72.0483C64.6252 72.0483 76.5689 59.9529 76.3793 45.1275C76.1897 31.0225 64.3218 19.1546 50.2168 18.965C35.3535 18.7754 23.296 30.7191 23.296 45.5066H30.0831C31.7893 45.5066 32.6235 47.5541 31.4481 48.7296L20.8693 59.3462C20.111 60.1046 18.9356 60.1046 18.1772 59.3462L7.59849 48.7296C6.38516 47.5541 7.21933 45.5066 8.92558 45.5066H15.7127ZM46.046 33.1837C46.046 31.6291 47.3352 30.34 48.8897 30.34C50.4443 30.34 51.7335 31.6291 51.7335 33.1458V46.0375L62.6535 52.5212C63.9806 53.3175 64.4356 55.0616 63.6393 56.4266C62.8431 57.7537 61.0989 58.2087 59.7339 57.4125L47.9039 50.3979C46.7664 49.7154 46.046 48.4641 46.046 47.1371V33.1837Z" fill="#BFC5D0"/>
    </g>
  </svg>
);


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
      <PastClockIcon />
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
