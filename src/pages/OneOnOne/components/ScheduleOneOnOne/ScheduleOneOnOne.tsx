import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, } from 'antd';

import ScheduleForm from './components/ScheduleForm';
import { IScheduleFormValues } from './components/ScheduleForm/ScheduleForm';
import { SCHEDULE_ONE_ON_ONE } from 'apollo/mutations/oneOnOne';
import { useMessageContextValue } from 'contexts/MessageContext';
import scheduleOneOnOneCacheHandler from './cache-handler/scheduleOneOnOne';

interface IScheduleOneOnOneForm {
  directReportId: string,
  title: string,
  isEditing?: boolean,
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
  title, isEditing = false, directReportId,
}) => {
  const { alertError } = useMessageContextValue();
  const [visibility, setVisibility] = useState(false);
  const [scheduleOneOnOneMutation] = useMutation(SCHEDULE_ONE_ON_ONE);

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

  return (
    <div className="float-right">
      {isEditing ? (
        <Button className="text-muted" shape="circle" type="link" icon="setting" onClick={() => setVisibility(true)} />
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
          setVisibility={setVisibility}
          scheduleOneOnOneAction={scheduleOneOnOneAction}
        />
      </StyledModal>
    </div>
  )
}

export default ScheduleOneOnOneForm;
