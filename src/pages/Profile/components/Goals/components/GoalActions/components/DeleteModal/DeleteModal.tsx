import React, { useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Modal, Typography } from 'antd';

import { useMessageContextValue } from 'contexts/MessageContext';

const { Text} = Typography;

interface IDeleteModal extends RouteComponentProps<{ profile_id: string }> {
  goalId: string,
  visibility: boolean,
  setVisibility: (visibility: boolean) => void,
}

const StyledModal = styled(Modal)`
  .ant-modal-header, .ant-modal-body {
    padding: 16px;
  }
`;

const DeleteModal: React.FC<IDeleteModal> = ({ goalId, visibility, setVisibility, match }) => {
  const [loadingState, setLoadingState] = useState(false);
  const { alertError } = useMessageContextValue();

  const deleteAction = async () => {
    setLoadingState(true);
    try {
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

export default withRouter(DeleteModal);
