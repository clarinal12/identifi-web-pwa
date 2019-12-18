import React, { useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Modal, Typography } from 'antd';

import { DELETE_COMMENT } from 'apollo/mutations/comments';
import { COMMENTS } from 'apollo/queries/comments';
import { CHECKIN_SCHEDULE, CHECKIN } from 'apollo/queries/checkin';

const { Text} = Typography;

interface IDeleteModal extends RouteComponentProps<{ past_checkin_id: string, id: string }> {
  commentId: string,
  responseId: string,
  visibility: boolean,
  setVisibility: (visibility: boolean) => void,
}

const StyledModal = styled(Modal)`
  .ant-modal-header, .ant-modal-body {
    padding: 16px;
  }
`;

const DeleteModal: React.FC<IDeleteModal> = ({ commentId, visibility, setVisibility, match, responseId }) => {
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [loadingState, setLoadingState] = useState(false);

  const deleteAction = async () => {
    setLoadingState(true);
    await deleteComment({
      variables: { id: commentId },
      refetchQueries: [{
        query: COMMENTS,
        variables: {
          checkInResponseId: responseId,
        },
      }, {
        query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
        variables: {
          id: match.params.past_checkin_id || match.params.id,
        },
      }],
      awaitRefetchQueries: true,
    });
    setLoadingState(false);
    setVisibility(false);
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
      <Text type="secondary">Are you sure you want to delete this comment?</Text>
    </StyledModal>
  );
}

export default withRouter(DeleteModal);