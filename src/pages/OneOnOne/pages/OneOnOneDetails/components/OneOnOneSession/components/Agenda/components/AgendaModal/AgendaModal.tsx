import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import AgendaForm from './components/AgendaForm';

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

const AgendaModal = () => {
  const [visiblity, setVisibility] = useState(false);
  return (
    <div>
      <StyledModal
        closable={false}
        maskClosable={false}
        visible={visiblity}
        title={<Title level={3}>Add agenda item</Title>}
        onCancel={() => setVisibility(false)}
      >
        <AgendaForm
          setVisibility={setVisibility}
        />
      </StyledModal>
      <Button onClick={() => setVisibility(true)} type="primary">Add talking points</Button>
    </div>
  );
}

export default AgendaModal;
