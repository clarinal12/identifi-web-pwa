import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditGoalForm from './components/EditGoalForm';
import { IExternalProps } from './components/EditGoalForm/EditGoalForm';
import { UPDATE_CHECKIN_GOAL } from 'apollo/mutations/checkin';
import { TCheckInGoal } from 'apollo/types/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import updateCheckInGoalCacheHandler from './cache-handler/updateCheckInGoal';

interface IEditGoalModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditGoalModal: React.FC<IEditGoalModal> = ({ data, showSwitch, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const [modalState, setModalState] = useState(false);
  const [updateCheckInGoal] = useMutation(UPDATE_CHECKIN_GOAL);

  const onSubmitAction = (values: Partial<TCheckInGoal>) => {
    try {
      updateCheckInGoal({
        variables: {
          ...(data && {
            goalId: data.id,
          }),
          input: values,
        },
        ...updateCheckInGoalCacheHandler({
          isPreviousGoal: showSwitch,
          respondentId: account?.id,
          scheduleId: selectedCheckInCard?.scheduleId,
          checkInId: derivedCheckInId,
          value: {
            ...data,
            ...values,
          },
        }),
      });
      alertSuccess("Checkin goal updated");
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
