import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Alert, Row, Col, Affix, Card, Icon, Typography } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import OneOnOneHistory from './components/OneOnOneHistory';
import { ONE_ON_ONE_SCHEDULE } from 'apollo/queries/oneOnOne';
import { useOneOnOnesContextValue } from 'contexts/OneOnOnesContext';
import { getDisplayName } from 'utils/userUtils';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOnes';

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

const OneOnOneDetails: React.FC<RouteComponentProps<{ direct_report_id: string }>> = ({ match, history }) => {
  const [pastOneOnOneId, setPastOneOnOneId] = useState('');
  const { oneOnOnes } = useOneOnOnesContextValue();
  const selectedSession = oneOnOnes.find(({ teammate }) => teammate.id === match.params.direct_report_id);

  const { data, loading = true, error } = useQuery<IOneOnOneScheduleQuery>(ONE_ON_ONE_SCHEDULE, {
    variables: {
      scheduleId: selectedSession?.info?.scheduleId,
    },
    onCompleted: () => {
      history.replace({
        state: { direct_report_id_alias: getDisplayName(selectedSession?.teammate) },
      });
    },
    skip: !Boolean(selectedSession?.info),
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
          {(!data || loading) ? (
            <Spinner label="Loading 1-on-1 details..." />
          ) : (
            <Title>One on one details</Title>
          )}
          {/* <CheckInDetailContainer
            data={data.checkInSchedule}
            pastCheckInId={pastCheckInId}
          /> */}
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
                nextSessionDate={data?.oneOnOneSchedule.nextSessionDate}
                scheduleId={selectedSession?.info?.scheduleId}
                directReport={selectedSession?.teammate}
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

export default withRouter(OneOnOneDetails);
