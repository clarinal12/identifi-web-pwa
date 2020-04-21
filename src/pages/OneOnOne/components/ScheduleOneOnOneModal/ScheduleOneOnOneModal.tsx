import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, } from 'antd';

import ScheduleForm from './components/ScheduleForm';
import { IScheduleFormValues } from './components/ScheduleForm/ScheduleForm';
import { SCHEDULE_ONE_ON_ONE, UPDATE_ONE_ON_ONE_ESCHEDULE } from 'apollo/mutations/oneOnOne';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';
import { useUserContextValue } from 'contexts/UserContext';
import scheduleOneOnOneCacheHandler from './cache-handler/scheduleOneOnOne';
import updateOneOnOneScheduleCacheHandler from './cache-handler/updateOneOnOneSchedule';

interface IScheduleOneOnOneModal {
  isEditing?: boolean,
  directReportId: string | undefined,
  title: string,
}

const StyledModal = styled(Modal)`
  min-width: 625px;
  .ant-modal-header, .ant-modal-footer {
    border: none;
  }
  .ant-modal-header {
    padding-bottom: 0;
    padding-top: 24px;
    .ant-modal-title {
      font-size: 24px;
      font-weight: 600;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`;

const ScheduleOneOnOneModal: React.FC<IScheduleOneOnOneModal> = ({
  title, directReportId, isEditing,
}) => {
  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [visibility, setVisibility] = useState(false);
  const [scheduleOneOnOneMutation] = useMutation(SCHEDULE_ONE_ON_ONE);
  const [updateOneOnOneScheduleMutation] = useMutation(UPDATE_ONE_ON_ONE_ESCHEDULE);
  const derivedTimezone = account?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scheduleOneOnOneAction = (values: IScheduleFormValues) => {
    try {
      scheduleOneOnOneMutation({
        variables: {
          directReportId,
          input: {
            timings: {
              ...values,
              time: values.time.toISOString(),
            },
          },
        },
        ...scheduleOneOnOneCacheHandler({
          directReportId,
          values: {
            duration: values.duration,
            frequency: values.frequency,
            upcomingSessionDate: values.time.toISOString(),
            time: values.time.toISOString(),
          },
        }),
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  const updateOneOnOneScheduleAction = (values: IScheduleFormValues) => {
    if (!selectedUserSession || !directReportId || !selectedUserSession?.info) return;
    try {
      updateOneOnOneScheduleMutation({
        variables: {
          scheduleId: selectedUserSession.info?.scheduleId,
          input: {
            timings: {
              ...values,
              time: values.time.toISOString(),
            },
          },
        },
        ...updateOneOnOneScheduleCacheHandler({
          directReportId,
          values: {
            duration: values.duration,
            frequency: values.frequency,
            upcomingSessionDate: values.time.toISOString(),
            status: selectedUserSession.info.status,
            currentSessionId: selectedUserSession.info.currentSessionId,
            currentSessionStatus: 'UPCOMING',
            scheduleId: selectedUserSession.info.scheduleId,
            time: values.time.toISOString(),
          },
        }),
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setVisibility(false);
  }

  return (
    <div className="float-right">
      {isEditing ? (
        <Button style={{ color: '#595959' }} type="link" icon="setting" size="large" onClick={() => setVisibility(true)} />
      ) : (
        <Button type="primary" onClick={() => setVisibility(true)}>Schedule 1-on-1</Button>
      )}
      <StyledModal
        maskClosable={false}
        closable={false}
        title={title}
        visible={visibility}
      >
        <ScheduleForm
          data={selectedUserSession?.info}
          setVisibility={setVisibility}
          onSubmitAction={isEditing ? updateOneOnOneScheduleAction : scheduleOneOnOneAction}
          tz={derivedTimezone}
        />
      </StyledModal>
    </div>
  )
}

export default ScheduleOneOnOneModal;
