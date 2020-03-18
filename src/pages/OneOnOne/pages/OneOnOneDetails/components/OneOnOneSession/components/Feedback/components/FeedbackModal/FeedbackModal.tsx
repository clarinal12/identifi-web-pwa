import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import FeedbackForm from './components/FeedbackForm';

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
  const [visiblity, setVisibility] = useState(false);
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
          setVisibility={setVisibility}
        />
      </StyledModal>
      <Button className="mt-3 active-btn" onClick={() => setVisibility(true)}>Leave feedback</Button>
    </div>
  );
}

export default FeedbackModal;
