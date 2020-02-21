import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditAnswerForm from './components/EditAnswerForm';
import { IExternalProps } from './components/EditAnswerForm/EditAnswerForm';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { UPDATE_CHECKIN_ANSWER } from 'apollo/mutations/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';

interface IEditAnswerModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditAnswerModal: React.FC<IEditAnswerModal> = ({ data, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const [modalState, setModalState] = useState(false);
  const [updateCheckInAnswer] = useMutation(UPDATE_CHECKIN_ANSWER);

  const onSubmitAction = async (
    values: { answer: string },
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    try {
      await updateCheckInAnswer({
        variables: {
          ...(data && {
            answerId: data.id,
          }),
          input: values,
        },
        refetchQueries: [{
          query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.past_checkin_id || match.params.checkin_id,
          },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess("Checkin answer updated");
      setSubmitting(false);
      setModalState(false);
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button style={{ minWidth: 32 }} onClick={() => setModalState(true)} title="edit" type="link" icon="form" />
      {data && (
        <EditAnswerForm
          data={data}
          modalState={modalState}
          setModalState={setModalState}
          onSubmitAction={onSubmitAction}
        />
      )}
    </>
  );
}

export default withRouter(EditAnswerModal);
