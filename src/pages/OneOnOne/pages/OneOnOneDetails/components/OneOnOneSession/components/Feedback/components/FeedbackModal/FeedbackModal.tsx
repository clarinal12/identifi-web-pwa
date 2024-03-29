import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import FeedbackForm from './components/FeedbackForm';
import { IFeedbackFormValues } from './components/FeedbackForm/FeedbackForm';
import addOneOnOneFeedbackCacheHandler from './cache-handler/addOneOnOneFeedback';
import updateOneOnOneFeedbackCacheHandler from './cache-handler/updateOneOnOneFeedback';
import deleteOneOnOneFeedbackCacheHandler from './cache-handler/deleteOneOnOneFeedback';
import { ADD_ONE_ON_ONE_FEEDBACK, UPDATE_ONE_ON_ONE_FEEDBACK, DELETE_ONE_ON_ONE_FEEDBACK } from 'apollo/mutations/feedback';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { TFeedback } from 'apollo/types/oneOnOne';

const { Title } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border: none;
    padding: 24px 24px 0;
    .ant-typography {
      margin: 0;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`;

interface IFeedbackModal {
  sessionId: string,
  feedback?: TFeedback,
  isEditing?: boolean,
}

const FeedbackModal: React.FC<IFeedbackModal> = ({ feedback, isEditing, sessionId }) => {
  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const [visiblity, setVisibility] = useState(false);
  const [addOneOnOneFeedbackMutation] = useMutation(ADD_ONE_ON_ONE_FEEDBACK);
  const [updateOneOnOneFeedbackMutation] = useMutation(UPDATE_ONE_ON_ONE_FEEDBACK);
  const [deleteOneOnOneFeedbackMutation] = useMutation(DELETE_ONE_ON_ONE_FEEDBACK);

  const addOneOnOneFeedbackAction = (values: IFeedbackFormValues) => {
    if (!account) return;
    try {
      addOneOnOneFeedbackMutation({
        variables: {
          sessionId,
          input: { ...values },
        },
        ...addOneOnOneFeedbackCacheHandler({
          sessionId,
          author: account,
          values,
        }),
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  const updateOneOnOneFeedbackAction = (values: IFeedbackFormValues) => {
    if (!account || !feedback) return;
    try {
      updateOneOnOneFeedbackMutation({
        variables: {
          feedbackId: feedback.id, 
          input: { ...values },
        },
        ...updateOneOnOneFeedbackCacheHandler({
          sessionId,
          author: account,
          values,
        }),
      });
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setVisibility(false);
  }

  const deleteOneOnOneFeedbackAction = () => {
    if (!feedback || !account) return;
    try {
      deleteOneOnOneFeedbackMutation({
        variables: {  feedbackId: feedback.id },
        ...deleteOneOnOneFeedbackCacheHandler({
          author: account,
          sessionId,
        }),
      });
      setVisibility(false);
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  return (
    <div className="flex-shrink-0">
      <StyledModal
        closable={false}
        maskClosable={false}
        visible={visiblity}
        title={<Title level={3}>{feedback ? 'Edit' : 'Write'} your feedback</Title>}
      >
        <FeedbackForm
          data={feedback}
          onSubmit={feedback ? updateOneOnOneFeedbackAction : addOneOnOneFeedbackAction}
          deleteAction={deleteOneOnOneFeedbackAction}
          setVisibility={setVisibility}
        />
      </StyledModal>
      {isEditing ? (
        <Button onClick={() => setVisibility(true)} className="text-muted edit-btn" type="link" icon="form" size="large" />
      ) : (
        <Button className="mt-3" type="primary" ghost onClick={() => setVisibility(true)}>Leave feedback</Button>
      )}
    </div>
  );
}

export default FeedbackModal;
