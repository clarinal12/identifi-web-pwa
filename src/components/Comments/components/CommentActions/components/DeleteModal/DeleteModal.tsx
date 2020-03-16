import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Modal, Typography } from 'antd';

import { DELETE_COMMENT } from 'apollo/mutations/comments';
import { useMessageContextValue } from 'contexts/MessageContext';
import deleteCommentCacheHandler from './cache-handler/deleteComment';

const { Text} = Typography;

interface IDeleteModal extends RouteComponentProps<{ past_checkin_id: string, checkin_id: string }> {
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
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);
  const { alertError } = useMessageContextValue();

  const deleteCommentAction = () => {
    try {
      deleteCommentMutation({
        variables: { id: commentId },
        ...deleteCommentCacheHandler({
          commentId,
          isPastCheckIn: Boolean(match.params.past_checkin_id),
          checkInId: match.params.past_checkin_id || match.params.checkin_id,
          checkInResponseId: responseId,
        }),
      });
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setVisibility(false);
    }
  }

  return (
    <StyledModal
      title="Delete"
      visible={visibility}
      okText="Delete"
      onOk={deleteCommentAction}
      onCancel={() => setVisibility(false)}
    >
      <Text type="secondary">Are you sure you want to delete this comment?</Text>
    </StyledModal>
  );
}

export default withRouter(DeleteModal);
