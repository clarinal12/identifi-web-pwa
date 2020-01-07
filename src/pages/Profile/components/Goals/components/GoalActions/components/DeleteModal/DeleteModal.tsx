import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Modal, Typography } from 'antd';

import { useMessageContextValue } from 'contexts/MessageContext';
import { GOALS } from 'apollo/queries/goals';
import { DELETE_GOAL } from 'apollo/mutations/goals';

const { Text} = Typography;

interface IDeleteModal {
  memberId: string,
  goalId: string,
  visibility: boolean,
  setVisibility: (visibility: boolean) => void,
}

const StyledModal = styled(Modal)`
  .ant-modal-header, .ant-modal-body {
    padding: 16px;
  }
`;

const DeleteModal: React.FC<IDeleteModal> = ({ goalId, visibility, setVisibility, memberId }) => {
  const [loadingState, setLoadingState] = useState(false);
  const [deleteGoal] = useMutation(DELETE_GOAL);
  const { alertError, alertWarning } = useMessageContextValue();

  const deleteAction = async () => {
    setLoadingState(true);
    try {
      await deleteGoal({
        variables: { goalId },
        refetchQueries: [{
          query: GOALS,
          variables: { memberId },
        }],
        awaitRefetchQueries: true,
      });
      alertWarning('Goal deleted');
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setLoadingState(false);
      setVisibility(false);
    }
  }

  return (
    <StyledModal
      title="Delete"
      visible={visibility}
      okText="Delete"
      onOk={deleteAction}
      confirmLoading={loadingState}
      {...(!loadingState && {
        onCancel: () => setVisibility(false),
      })}
    >
      <Text type="secondary">Are you sure you want to delete this goal?</Text>
    </StyledModal>
  );
}

export default DeleteModal;
