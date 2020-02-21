import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Button } from 'antd';

import EditBlockerForm from './components/EditBlockerForm';
import { IExternalProps } from './components/EditBlockerForm/EditBlockerForm';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { UPDATE_CHECKIN_BLOCKER, REMOVE_CHECKIN_BLOCKER } from 'apollo/mutations/checkin';
import { TBlocker } from 'apollo/types/graphql-types';
import { useMessageContextValue } from 'contexts/MessageContext';

interface IEditBlockerModal extends Partial<IExternalProps>, RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {}

const EditBlockerModal: React.FC<IEditBlockerModal> = ({ data, match }) => {
  const { alertSuccess, alertError } = useMessageContextValue();
  const [modalState, setModalState] = useState(false);
  const [updateCheckInBlocker] = useMutation(UPDATE_CHECKIN_BLOCKER);
  const [removeCheckInBlocker] = useMutation(REMOVE_CHECKIN_BLOCKER);
  
  const onSubmitAction = async (
    values: Partial<TBlocker> & { isBlocked?: boolean },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const derivedMutation = values.isBlocked ? updateCheckInBlocker : removeCheckInBlocker;
    try {
      await derivedMutation({
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
        refetchQueries: [{
          query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.past_checkin_id || match.params.checkin_id,
          },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess("Checkin blocker updated");
      if (values.isBlocked) {
        setSubmitting(false);
        setModalState(false);  
      }
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
