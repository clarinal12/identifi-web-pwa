import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditBlockerForm from './components/EditBlockerForm';
import { IExternalProps } from './components/EditBlockerForm/EditBlockerForm';
import { UPDATE_CHECKIN_BLOCKER, REMOVE_CHECKIN_BLOCKER } from 'apollo/mutations/checkin';
import { TBlocker } from 'apollo/types/checkin';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { useCheckInResponseFilterContextValue } from 'contexts/CheckInResponseFilterContext';
import updateCheckInBlockerCacheHandler from './cache-handler/updateCheckInBlocker';

interface IEditBlockerModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditBlockerModal: React.FC<IEditBlockerModal> = ({ data, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account } = useUserContextValue();
  const { responseFilterState } = useCheckInResponseFilterContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const [modalState, setModalState] = useState(false);
  const [updateCheckInBlocker] = useMutation(UPDATE_CHECKIN_BLOCKER);
  const [removeCheckInBlocker] = useMutation(REMOVE_CHECKIN_BLOCKER);
  
  const onSubmitAction = (values: Partial<TBlocker> & { isBlocked?: boolean }) => {
    const derivedMutation = values.isBlocked ? updateCheckInBlocker : removeCheckInBlocker;
    try {
      derivedMutation({
        variables: {
          ...(data && {
            blockerId: data.id,
          }),
          ...(values.isBlocked && {
            input: {
              blocker: values.blocker,
            },
          })
        },
        ...updateCheckInBlockerCacheHandler({
          isBlocked: values.isBlocked,
          respondentId: account?.id,
          scheduleId: selectedCheckInCard?.scheduleId,
          checkInId: derivedCheckInId,
          filter: responseFilterState,
          value: {
            id: data?.id,
            blocker: values.blocker,
          },
        }),
      });
      alertSuccess("Checkin blocker updated");
      if (values.isBlocked) {
        setModalState(false);
      }
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
        <EditBlockerForm
          data={data}
          modalState={modalState}
          setModalState={setModalState}
          onSubmitAction={onSubmitAction}
        />
      )}
    </>
  );
}

export default withRouter(EditBlockerModal);
