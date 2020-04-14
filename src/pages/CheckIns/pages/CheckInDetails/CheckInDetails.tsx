import React from 'react';
import styled from 'styled-components';
import { Row, Col, Typography, Affix, Icon, Card, Alert } from 'antd';

import AppLayout from 'components/AppLayout';
import CheckInHeader from './components/CheckInHeader';
import CheckInResponses from './components/CheckInResponses';
import PastCheckInList from './components/PastCheckInList';
import CheckInNavigation from './components/CheckInNavigation';
import { ReactionProvider } from 'contexts/ReactionContext';
import { MentionSourceProviderWithRouter } from 'contexts/MentionSourceContext';
import { CheckInScheduleProviderWithRouter, CheckInScheduleConsumer } from 'contexts/CheckInScheduleContext';
import { CheckInResponseFilterProviderWithRouter } from 'contexts/CheckInResponseFilterContext';

const { Title } = Typography;

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 16px;
    border: none;
  }
  .ant-card-body {
    padding: 0 0 16px;
  }
`;

const CheckInDetails = () => {
  const contentBody = (
    <CheckInScheduleConsumer>
      {({ selectedCheckInCard, loading }) => {
        if (loading) return null;
        return (
          <Row className="mx-0" gutter={24}>
            {(selectedCheckInCard) ? (
              <>
                <Col sm={24} md={17} className="pl-0">
                  <CheckInHeader />
                  <CheckInResponses />
                </Col>
                <Col sm={24} md={7} className="pr-0">
                  <Affix offsetTop={24}>
                    <div>
                      <StyledCard
                        className="mb-3"
                        title={(
                          <div className="d-flex" style={{ alignItems: 'center' }}>
                            <Icon type="calendar" className="mr-2 text-muted" />
                            <Title className="mb-0 fs-16">
                              Check-in history
                            </Title>
                          </div>
                        )}
                      >
                        <PastCheckInList />
                      </StyledCard>
                      <CheckInNavigation />
                    </div>
                  </Affix>
                </Col>
              </>
            ) : (
              <Alert
                showIcon
                type="warning"
                message="Cannot view specified schedule, you don't have access this checkin."
                description="Could not load checkin details at the moment"
              />
            )}
          </Row>
        );
      }}
    </CheckInScheduleConsumer>
  );

  return (
    <CheckInResponseFilterProviderWithRouter>
      <MentionSourceProviderWithRouter>
        <CheckInScheduleProviderWithRouter>
          <ReactionProvider>
            <AppLayout>
              {contentBody}
            </AppLayout>
          </ReactionProvider>
        </CheckInScheduleProviderWithRouter>
      </MentionSourceProviderWithRouter>
    </CheckInResponseFilterProviderWithRouter>
  );
};

export default CheckInDetails;
