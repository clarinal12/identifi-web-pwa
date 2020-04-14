import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditAnswerForm from './components/EditAnswerForm';
import { IExternalProps } from './components/EditAnswerForm/EditAnswerForm';
import { UPDATE_CHECKIN_ANSWER } from 'apollo/mutations/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import updateCheckInAnswerCacheHandler from './cache-handler/updateCheckInAnswer';

interface IEditAnswerModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditAnswerModal: React.FC<IEditAnswerModal> = ({ data, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const [modalState, setModalState] = useState(false);
  const [updateCheckInAnswer] = useMutation(UPDATE_CHECKIN_ANSWER);

  const onSubmitAction = (values: { answer: string }) => {
    try {
      updateCheckInAnswer({
        variables: {
          ...(data && {
            answerId: data.id,
          }),
          input: values,
        },
        ...updateCheckInAnswerCacheHandler({
          respondentId: account?.id,
          scheduleId: selectedCheckInCard?.scheduleId,
          checkInId: derivedCheckInId,
          value: {
            ...data,
            ...values,
          },
        }),
      });
      alertSuccess("Checkin answer updated");
      setModalState(false);
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  return (
    <>
      <Button style={{ minWidth: 32 }} onClick={() => setModalState(true)} title="edit" type="link" icon="form" />
      {data && (
        <EditAnswerForm
          data={data}
          // key={data.answer?.length} // ugly hack to reset form values after updating content
          modalState={modalState}
          setModalState={setModalState}
          onSubmitAction={onSubmitAction}
        />
      )}
    </>
  );
}

export default withRouter(EditAnswerModal);
