import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditGoalForm from './components/EditGoalForm';
import { IExternalProps } from './components/EditGoalForm/EditGoalForm';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { UPDATE_CHECKIN_GOAL } from 'apollo/mutations/checkin';
import { TCheckInGoal } from 'apollo/types/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';

interface IEditGoalModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditGoalModal: React.FC<IEditGoalModal> = ({ data, showSwitch, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const [modalState, setModalState] = useState(false);
  const [updateCheckInGoal] = useMutation(UPDATE_CHECKIN_GOAL);

  const onSubmitAction = async (values: Partial<TCheckInGoal>, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      await updateCheckInGoal({
        variables: {
          ...(data && {
            goalId: data.id,
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
      alertSuccess("Checkin goal updated");
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
        <EditGoalForm
          data={data}
          showSwitch={showSwitch}
          modalState={modalState}
          setModalState={setModalState}
          onSubmitAction={onSubmitAction}
        />
      )}
    </>
  );
}

export default withRouter(EditGoalModal);
