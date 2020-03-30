import React from 'react';
import styled from 'styled-components';
import { Modal, Button } from 'antd';

interface IAgendaDetails {
  topic: string,
  content: string,
  visibility: boolean,
  setVisibility: (visiblity: boolean) => void,
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border: none;
    padding: 24px 24px 0;
    .ant-typography {
      margin: 0;
    }
  }
  .ant-modal-body {
    ol {
      padding-inline-start: 16px;
    }
    .custom-footer {
      margin-top: 32px;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`;

const AgendaDetails: React.FC<IAgendaDetails> = ({ topic, content, visibility, setVisibility }) => (
  <StyledModal
    title={topic}
    closable={false}
    maskClosable={false}
    visible={visibility}
    onCancel={() => setVisibility(false)}
  >
    <div  dangerouslySetInnerHTML={{ __html: content }} />
    <div className="custom-footer text-right">
      <Button size="large" onClick={() => setVisibility(false)}>Close</Button>
    </div>
  </StyledModal>
);

export default AgendaDetails;
