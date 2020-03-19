import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, } from 'antd';

import ScheduleForm from './components/ScheduleForm';
import { IScheduleFormValues } from './components/ScheduleForm/ScheduleForm';
import { SCHEDULE_ONE_ON_ONE, UPDATE_ONE_ON_ONE_ESCHEDULE } from 'apollo/mutations/oneOnOne';
import { useMessageContextValue } from 'contexts/MessageContext';
import scheduleOneOnOneCacheHandler from './cache-handler/scheduleOneOnOne';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';

interface IScheduleOneOnOneForm {
  directReportId: string,
  title: string,
  oneOnOneSchedule?: IOneOnOneSchedule,
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

const ScheduleOneOnOneForm: React.FC<IScheduleOneOnOneForm> = ({
  title, oneOnOneSchedule, directReportId,
}) => {
  const { alertError } = useMessageContextValue();
  const [visibility, setVisibility] = useState(false);
  const [scheduleOneOnOneMutation] = useMutation(SCHEDULE_ONE_ON_ONE);
  const [updateOneOnOneScheduleMutation] = useMutation(UPDATE_ONE_ON_ONE_ESCHEDULE);

  const scheduleOneOnOneAction = (values: IScheduleFormValues) => {
    try {
      scheduleOneOnOneMutation({
        variables: {
          directReportId,
          input: {
            timings: { ...values },
          },
        },
        ...scheduleOneOnOneCacheHandler({
          directReportId,
          values: {
            frequency: values.frequency,
            upcomingSessionDate: values.time.utc(false).format(),
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
    try {
      updateOneOnOneScheduleMutation({
        variables: {
          scheduleId: oneOnOneSchedule?.id,
          input: {
            timings: { ...values },
          },
        },
        // ...scheduleOneOnOneCacheHandler({
        //   directReportId,
        //   values: {
        //     frequency: values.frequency,
        //     upcomingSessionDate: values.time.utc(false).format(),
        //   },
        // }),
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
      {oneOnOneSchedule ? (
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
          data={oneOnOneSchedule}
          setVisibility={setVisibility}
          onSubmitAction={oneOnOneSchedule ? updateOneOnOneScheduleAction : scheduleOneOnOneAction}
        />
      </StyledModal>
    </div>
  )
}

export default ScheduleOneOnOneForm;
