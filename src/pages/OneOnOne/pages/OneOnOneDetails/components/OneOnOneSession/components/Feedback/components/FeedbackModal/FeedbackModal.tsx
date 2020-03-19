import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import FeedbackForm from './components/FeedbackForm';
import { IFeedbackFormValues } from './components/FeedbackForm/FeedbackForm';
import addOneOnOneFeedbackCacheHandler from './cache-handler/addOneOnOneFeedback';
import { ADD_ONE_ON_ONE_FEEDBACK } from 'apollo/mutations/feedback';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';
import { useUserContextValue } from 'contexts/UserContext';

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

const FeedbackModal = () => {
  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [visiblity, setVisibility] = useState(false);
  const [addOneOnOneFeedbackMutation] = useMutation(ADD_ONE_ON_ONE_FEEDBACK);

  const addOneOnOneFeedbackAction = (values: IFeedbackFormValues) => {
    if (!selectedUserSession?.info || !account) return;
    try {
      addOneOnOneFeedbackMutation({
        variables: {
          sessionId: selectedUserSession?.info?.currentSessionId,
          input: { ...values },
        },
        ...addOneOnOneFeedbackCacheHandler({
          sessionId: selectedUserSession.info.currentSessionId,
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

  return (
    <div>
      <StyledModal
        closable={false}
        maskClosable={false}
        visible={visiblity}
        title={<Title level={3}>Write your feedback</Title>}
        onCancel={() => setVisibility(false)}
      >
        <FeedbackForm
          onSubmit={addOneOnOneFeedbackAction}
          setVisibility={setVisibility}
        />
      </StyledModal>
      <Button className="mt-3" type="primary" ghost onClick={() => setVisibility(true)}>Leave feedback</Button>
    </div>
  );
}

export default FeedbackModal;
