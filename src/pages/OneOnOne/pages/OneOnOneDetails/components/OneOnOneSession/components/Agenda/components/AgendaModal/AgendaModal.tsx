import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import AgendaForm from './components/AgendaForm';
import { IAgendaFormValues } from './components/AgendaForm/AgendaForm';
import { ADD_ONE_ON_ONE_AGENDA } from 'apollo/mutations/agenda';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

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
  const { alertError } = useMessageContextValue();
  const { selectedUserSession } = useOneOnOneContextValue();
  const [visiblity, setVisibility] = useState(false);
  const [addOneOnOneAgendaMutation] = useMutation(ADD_ONE_ON_ONE_AGENDA);

  const addOneOnOneAgendaAction = (values: IAgendaFormValues) => {
    try {
      addOneOnOneAgendaMutation({
        variables: {
          sessionId: selectedUserSession?.info?.currentSessionId,
          input: { ...values },
        },
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
    <div>
      <StyledModal
        closable={false}
        maskClosable={false}
        visible={visiblity}
        title={<Title level={3}>Add agenda item</Title>}
        onCancel={() => setVisibility(false)}
      >
        <AgendaForm
          addOneOnOneAgendaAction={addOneOnOneAgendaAction}
          setVisibility={setVisibility}
        />
      </StyledModal>
      <Button className="active-btn" onClick={() => setVisibility(true)}>Add talking points</Button>
    </div>
  );
}

export default AgendaModal;
