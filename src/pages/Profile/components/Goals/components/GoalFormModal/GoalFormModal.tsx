import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal } from 'antd';

import GoalForm from './components/GoalForm';
import { IGoalFormValues } from './components/GoalForm/GoalForm';
import { ADD_GOAL, UPDATE_GOAL } from 'apollo/mutations/goals';
import { GOALS } from 'apollo/queries/goals';
import { useMessageContextValue } from 'contexts/MessageContext';

interface IGoalFormModal {
  editGoalInfo?: IGoalFormValues,
  memberId: string,
  visibility: boolean,
  updateProgressState: boolean,
  onClose: () => void,
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

const GoalFormModal: React.FC<IGoalFormModal> = ({
  visibility, memberId, editGoalInfo, onClose, updateProgressState,
}) => {
  const [loadingState, setLoadingState] = useState(false);
  const [addGoal] = useMutation(ADD_GOAL);
  const [updateGoal] = useMutation(UPDATE_GOAL);
  const { alertError, alertSuccess } = useMessageContextValue();

  const createAction = async (
    values: IGoalFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => {
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
      onClose();
      resetForm();
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setSubmitting(false);
    setLoadingState(false);
  }

  const editAction = async (
    { type, ...otherValues }: IGoalFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    resetForm: () => void,
  ) => {
    setLoadingState(true);
    try {
      await updateGoal({
        variables: {
          input: otherValues,
          ...(editGoalInfo && {
            goalId: editGoalInfo.id,
          }),
        },
        refetchQueries: [{
          query: GOALS,
          variables: { memberId },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess("Goal updated");
      onClose();
      resetForm();
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setSubmitting(false);
    setLoadingState(false);
  }

  return (
    <StyledModal
      title={editGoalInfo ? 'Update goal' : 'New goal'}
      visible={visibility}
      confirmLoading={loadingState}
      {...(!loadingState && {
        onCancel: onClose,
      })}
    >
      <GoalForm
        {...(editGoalInfo && {
          data: editGoalInfo,
        })}
        onCancel={onClose}
        updateProgressState={updateProgressState}
        onSubmit={(editGoalInfo || updateProgressState) ? editAction : createAction}
      />
    </StyledModal>
  );
}

export default GoalFormModal;
