import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Typography, Alert, Affix, Icon, Card } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import PastCheckInList from './components/PastCheckInList';
import CheckInDetailContainer from './components/CheckInDetailContainer';
import { CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { usePastCheckInContextValue } from 'contexts/PastCheckInContext';

const { Title } = Typography;

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 16px;
    border: none;
  }
  .ant-card-body {
    padding: 0 16px 16px;
  }
`;

const CheckInDetails: React.FC<RouteComponentProps<{ id: string, past_checkin_id: string }>> = ({ match, history }) => {
  const { pastCheckInId, setPastCheckInId } = usePastCheckInContextValue();

  const { data, loading, error } = useQuery(CHECKIN_SCHEDULE, {
    variables: { id: match.params.id },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      history.replace({ state: { id_alias: data.checkInSchedule.name } });
      setPastCheckInId(match.params.past_checkin_id || 'invalid-checkin-id');
    },
  });

  useEffect(() => {
    if (!match.params.past_checkin_id) {
      setPastCheckInId('');
    }
  }, [match.params.past_checkin_id, setPastCheckInId]);

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
        <Spinner loading label="Loading check-in..." />
      ) : (
        <Row className="mx-0" gutter={24}>
          <Col sm={24} md={16} className="pl-0">
            <CheckInDetailContainer
              data={data.checkInSchedule}
              pastCheckInId={pastCheckInId}
            />
          </Col>
          <Col sm={24} md={8} className="pr-0">
            <Affix offsetTop={24}>
              <StyledCard
                title={(
                  <div className="d-flex" style={{ alignItems: 'center' }}>
                    <Icon type="calendar" className="mr-2 text-muted" />
                    <Title className="mb-0" style={{ fontSize: 16 }}>
                      Check-in history
                    </Title>
                  </div>
                )}
              >
                <PastCheckInList
                  data={data.checkInSchedule}
                  pastCheckInId={pastCheckInId}
                  setPastCheckInId={setPastCheckInId}
                />
              </StyledCard>
            </Affix>
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <AppLayout>
      {contentBody}
    </AppLayout>
  );
};

export default withRouter(CheckInDetails);
