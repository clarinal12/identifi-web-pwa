import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography, Alert, Affix, Icon, Card } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import PastCheckInList from './components/PastCheckInList';
import CheckInNavigation from './components/CheckInNavigation';
import CheckInDetailContainer from './components/CheckInDetailContainer';
import { CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { useMentionSourceContextValue } from 'contexts/MentionSourceContext';
import { ReactionProvider } from 'contexts/ReactionContext';
import { CheckInScheduleProvider } from 'contexts/CheckInScheduleContext';

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

const CheckInDetails: React.FC<RouteComponentProps<{ checkin_id: string }>> = ({ match, history, location }) => {
  const { setMentionSource } = useMentionSourceContextValue();

  const { data, loading, error } = useQuery(CHECKIN_SCHEDULE, {
    variables: { id: match.params.checkin_id },
    onCompleted: data => {
      history.replace({
        state: { checkin_id_alias: data.checkInSchedule.name },
        ...(location.search && { search: location.search }),
      });
    },
  });

  useEffect(() => {
    if (data) {
      const { currentCheckIn } = data.checkInSchedule;
      currentCheckIn && setMentionSource(currentCheckIn.mentionables);
    }
  }, [data, setMentionSource]);

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
      {loading ? (
        <Spinner label="Loading check-in..." />
      ) : (
        <Row className="mx-0" gutter={24}>
          <Col sm={24} md={17} className="pl-0">
            <CheckInDetailContainer data={data.checkInSchedule} />
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
        </Row>
      )}
    </>
  );

  return (
    <CheckInScheduleProvider>
      <ReactionProvider>
        <AppLayout>
          {contentBody}
        </AppLayout>
      </ReactionProvider>
    </CheckInScheduleProvider>
  );
};

export default withRouter(CheckInDetails);
