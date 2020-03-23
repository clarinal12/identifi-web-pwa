import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Button, Typography, Spin, Avatar } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import ScheduleOneOnOneModal from 'pages/OneOnOne/components/ScheduleOneOnOneModal';
import RescheduleOneOnOneModal from './components/RescheduleOneOnOneModal';
import { COMPLETE_ONE_ON_ONE } from 'apollo/mutations/oneOnOne';
import { ONE_ON_ONES, ONE_ON_ONE_SESSIONS, ONE_ON_ONE_SCHEDULE, ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';
import { getDisplayName } from 'utils/userUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

const { Title, Text } = Typography;

interface IOneOnOneHeader {
  isManager?: boolean,
  loading: boolean,
  oneOnOneSchedule?: IOneOnOneSchedule,
}

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    margin-top: 24px;
  }
`;

const OneOnOneHeader: React.FC<IOneOnOneHeader> = ({ loading, oneOnOneSchedule, isManager }) => {
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [loadingState, setLoadingState] = useState(false);
  const [completeOneOnOneMutation] = useMutation(COMPLETE_ONE_ON_ONE);

  const completeOneOnOneAction = async () => {
    try {
      setLoadingState(true);
      await completeOneOnOneMutation({
        variables: { sessionId: oneOnOneSchedule?.currentSessionId },
        refetchQueries: [{
          query: ONE_ON_ONE_SCHEDULE,
          variables: {
            scheduleId: selectedUserSession?.info?.scheduleId,
          },
        }, {
          query: ONE_ON_ONE_SESSION,
          variables: {
            sessionId: oneOnOneSchedule?.currentSessionId,
          },
        }, {
          query: ONE_ON_ONE_SESSIONS,
          variables: {
            scheduleId: selectedUserSession?.info?.scheduleId,
          },
        }, {
          query: ONE_ON_ONES,
        }],
        awaitRefetchQueries: true,
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  return (
    <Card className="mb-3">
      {loading ? (
        <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
          <Spin className="py-3" size="small" indicator={LoadingIcon} />
        </StyledSpinnerWrapper>
      ) : (
        <div className="d-flex">
          {oneOnOneSchedule?.displayMember.avatar && (
            <Avatar
              style={{ width: 64, height: 64 }}
              className="mr-3 flex-shrink-0"
              src={oneOnOneSchedule.displayMember.avatar}
            />
          )}
          <div className="d-flex justify-content-between w-100">
            <div>
              <div className="d-flex" style={{ alignItems: 'center' }}>
                <Title className="mb-0 mr-2 text-capitalize" level={3}>
                  {getDisplayName(oneOnOneSchedule?.displayMember)}
                </Title>
                {(isManager && oneOnOneSchedule) && (
                  <ScheduleOneOnOneModal
                    oneOnOneSchedule={oneOnOneSchedule}
                    directReportId={oneOnOneSchedule.displayMember.id}
                    title={`Edit 1-1 with ${getDisplayName(oneOnOneSchedule.displayMember)}`}
                  />
                )}
              </div>
              <Text type="secondary" className="fs-16">
                {moment(oneOnOneSchedule?.upcomingSessionDate).format('MMM DD, hh:mm a')}
              </Text>
            </div>
            {isManager && (
              <div className="d-flex align-items-end">
                {oneOnOneSchedule?.canRescheduleCurrentSession && (
                  <RescheduleOneOnOneModal oneOnOneSchedule={oneOnOneSchedule} />
                )}
                <Button onClick={completeOneOnOneAction} loading={loadingState} className="ml-3" type="primary">Complete 1-1</Button>
                {/* {oneOnOneSchedule?.status === 'ACTIVE' ? (
                  <>
                    {oneOnOneSchedule?.canRescheduleCurrentSession && (
                      <RescheduleOneOnOneModal oneOnOneSchedule={oneOnOneSchedule} />
                    )}
                    <Button onClick={completeOneOnOneAction} loading={loadingState} className="ml-3" type="primary">Complete 1-1</Button>
                  </>
                ) : (
                  <Tag className="m-0" color="#E8E8E8">
                    <Text>{oneOnOneSchedule?.status}</Text>
                  </Tag>
                )} */}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OneOnOneHeader;
