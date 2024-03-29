import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import RescheduleOneOnOneForm from './components/RescheduleOneOnOneForm';
import { IRescheduleOneOnOneFormValues } from './components/RescheduleOneOnOneForm/RescheduleOneOnOneForm';
import { ONE_ON_ONES, ONE_ON_ONE_HEADER, ONE_ON_ONE_SESSIONS, ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { RESCHEDULE_ONE_ON_ONE } from 'apollo/mutations/oneOnOne';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

const { Text } = Typography;

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

const RescheduleOneOnOneModal: React.FC<{ maxRescheduleDate: string }> = ({ maxRescheduleDate }) => {
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [visibility, setVisibility] = useState(false);
  const [rescheduleOneOnOneMutation] = useMutation(RESCHEDULE_ONE_ON_ONE);

  const rescheduleOneOnOneAction = async (
    values: IRescheduleOneOnOneFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => {
    try {
      await rescheduleOneOnOneMutation({
        variables: {
          sessionId: selectedUserSession?.info?.currentSessionId,
          time: values.time.format(),
        },
        refetchQueries: [{
          query: ONE_ON_ONE_HEADER,
          variables: {
            sessionId: selectedUserSession?.info?.currentSessionId,
          },
        }, {
          query: ONE_ON_ONE_SESSION,
          variables: {
            sessionId: selectedUserSession?.info?.currentSessionId,
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
      resetForm();
      setVisibility(false);
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setSubmitting(false);
  }

  return (
    <div className="d-flex">
      <Button type="primary" ghost onClick={() => setVisibility(true)}>Postpone</Button>
      <StyledModal
        maskClosable={false}
        closable={false}
        title="Postpone upcoming 1-1"
        visible={visibility}
      >
        <Text className="fs-16">
          Something came up and you can’t do your 1-1 when you originally agreed? No worries, just select a new date and time below. Keep in mind this reschedules <strong>only</strong> the upcoming 1-1.
        </Text>
        <RescheduleOneOnOneForm
          {...(selectedUserSession?.info && {
            data: {
              upcomingSessionDate: selectedUserSession.info.upcomingSessionDate,
            },
          })}
          maxRescheduleDate={maxRescheduleDate}
          setVisibility={setVisibility}
          onSubmitAction={rescheduleOneOnOneAction}
        />
      </StyledModal>
    </div>
  )
}

export default RescheduleOneOnOneModal;
