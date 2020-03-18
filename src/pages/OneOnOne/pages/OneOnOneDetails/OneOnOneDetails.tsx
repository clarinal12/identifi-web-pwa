import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Alert, Row, Col, Affix, Card, Icon, Typography } from 'antd';
import { OneOnOneProviderWithRouter } from 'contexts/OneOnOneContext';

import AppLayout from 'components/AppLayout';
import OneOnOneHeader from './components/OneOnOneHeader';
import OneOnOneSession from './components/OneOnOneSession';
import OneOnOneHistory from './components/OneOnOneHistory';
import { ONE_ON_ONE_SCHEDULE } from 'apollo/queries/oneOnOne';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';
import { getDisplayName } from 'utils/userUtils';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';

const { Title } = Typography;

interface IOneOnOneScheduleQuery {
  oneOnOneSchedule: IOneOnOneSchedule,
}

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 16px;
    border: none;
  }
  .ant-card-body {
    padding: 0 0 16px;
  }
`;

const OneOnOneDetails: React.FC<RouteComponentProps> = ({ history }) => {
  const [pastOneOnOneId, setPastOneOnOneId] = useState('');
  const { selectedUserSession } = useOneOnOneContextValue();

  const { data, loading = true, error } = useQuery<IOneOnOneScheduleQuery>(ONE_ON_ONE_SCHEDULE, {
    variables: {
      scheduleId: selectedUserSession?.info?.scheduleId,
    },
    onCompleted: () => {
      history.replace({
        state: { direct_report_id_alias: getDisplayName(selectedUserSession?.teammate) },
      });
    },
    skip: !Boolean(selectedUserSession?.info),
  });

  const contentBody = error ? (
    <Alert
      showIcon
      type="warning"
      message={function() {
        let errorMessage = "Network error";
        if (error.graphQLErrors[0]) {
          errorMessage = error.graphQLErrors[0].message;
        }
        return errorMessage;
      }()}
      description="The check-in you're looking for isn't available"
    />
  ) : (
    <>
      <Row className="mx-0" gutter={24}>
        <Col sm={24} md={17} className="pl-0">
          <OneOnOneHeader
            oneOnOneSchedule={data?.oneOnOneSchedule}
            loading={!Boolean(data) || loading}
          />
          {selectedUserSession?.info && (
            <OneOnOneSession sessionId={selectedUserSession.info.currentSessionId} />
          )}
        </Col>
        <Col sm={24} md={7} className="pr-0">
          <Affix offsetTop={24}>
            <StyledCard
              className="mb-3"
              title={(
                <div className="d-flex" style={{ alignItems: 'center' }}>
                  <Icon type="calendar" className="mr-2 text-muted" />
                  <Title className="mb-0 fs-16">
                    1-1 history
                  </Title>
                </div>
              )}
            >
              <OneOnOneHistory
                upcomingSessionDate={data?.oneOnOneSchedule.upcomingSessionDate}
                scheduleId={selectedUserSession?.info?.scheduleId}
                directReport={selectedUserSession?.teammate}
                pastOneOnOneId={pastOneOnOneId}
                setPastOneOnOneId={setPastOneOnOneId}
              />
            </StyledCard>
          </Affix>
        </Col>
      </Row>
    </>
  );

  return (
    <AppLayout>
      {contentBody}
    </AppLayout>
  );
}

const OneOnOneDetailsWithRouter = withRouter(OneOnOneDetails);

export default () => (
  <OneOnOneProviderWithRouter>
    <OneOnOneDetailsWithRouter />
  </OneOnOneProviderWithRouter>
);
