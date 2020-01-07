import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal } from 'antd';

import GoalForm from './components/GoalForm';
import { IGoalFormValues } from './components/GoalForm/GoalForm';
import { ADD_GOAL } from 'apollo/mutations/goals';
import { GOALS } from 'apollo/queries/goals';
import { useMessageContextValue } from 'contexts/MessageContext';

interface IGoalFormModal {
  memberId: string,
  visibility: boolean,
  setVisibility: (visibility: boolean) => void,
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    padding: 16px 24px;
  }
  .ant-modal-body {
    padding: 24px;
  }
  .ant-modal-footer {
    display: none;
  }
`;

const GoalFormModal: React.FC<IGoalFormModal> = ({ setVisibility, visibility, memberId }) => {
  const [loadingState, setLoadingState] = useState(false);
  const [addGoal] = useMutation(ADD_GOAL);
  const { alertError, alertSuccess } = useMessageContextValue();

  const createAction = async (values: IGoalFormValues, setSubmitting: (isSubmitting: boolean) => void) => {
    setLoadingState(true);
    try {
      await addGoal({
        variables: { input: values },
        refetchQueries: [{
          query: GOALS,
          variables: { memberId },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess("Goal added");
      setVisibility(false);
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setSubmitting(false);
    }
    setLoadingState(false);
  }

  return (
    <StyledModal
      title="New goal"
      visible={visibility}
      confirmLoading={loadingState}
      {...(!loadingState && {
        onCancel: () => setVisibility(false),
      })}
    >
      <GoalForm onCancel={() => setVisibility(false)} onSubmit={createAction} />
    </StyledModal>
  );
}

export default GoalFormModal;
