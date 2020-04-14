import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Modal, Button, Typography } from 'antd';

import AgendaForm from './components/AgendaForm';
import { IAgendaFormValues } from './components/AgendaForm/AgendaForm';
import addOneOnOneAgendaCacheHandler from './cache-handler/addOneOnOneAgenda';
import updateOneOnOneAgendaCacheHandler from './cache-handler/updateOneOnOneAgenda';
import deleteOneOnOneAgendaCacheHandler from './cache-handler/deleteOneOnOneAgenda';
import { ADD_ONE_ON_ONE_AGENDA, UPDATE_ONE_ON_ONE_AGENDA, DELETE_ONE_ON_ONE_AGENDA } from 'apollo/mutations/agenda';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { TAgenda } from 'apollo/types/oneOnOne';

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

interface IAgendaModal extends RouteComponentProps<{ session_id: string }> {
  isEmpty?: boolean,
  agenda?: TAgenda,
}

const AgendaModal: React.FC<IAgendaModal> = ({ agenda, isEmpty, match }) => {
  const { account } = useUserContextValue();
  const { alertError } = useMessageContextValue();
  const [visiblity, setVisibility] = useState(false);
  const [addOneOnOneAgendaMutation] = useMutation(ADD_ONE_ON_ONE_AGENDA);
  const [updateOneOnOneAgendaMutation] = useMutation(UPDATE_ONE_ON_ONE_AGENDA);
  const [deleteOneOnOneAgendaMutation] = useMutation(DELETE_ONE_ON_ONE_AGENDA);

  const addOneOnOneAgendaAction = (values: IAgendaFormValues) => {
    if (!account) return;
    try {
      addOneOnOneAgendaMutation({
        variables: {
          sessionId: match.params.session_id,
          input: { ...values },
        },
        ...addOneOnOneAgendaCacheHandler({
          sessionId: match.params.session_id,
          author: account,
          values,
        }),
      });
      if (!isEmpty) {
        setVisibility(false);
      }
    } catch (error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  const updateOneOnOneAgendaAction = (values: IAgendaFormValues) => {
    if (!agenda) return;
    try {
      updateOneOnOneAgendaMutation({
        variables: {
          agendaId: agenda.id,
          input: { ...values },
        },
        ...updateOneOnOneAgendaCacheHandler({
          agendaId: agenda.id,
          author: agenda.author,
          sessionId: match.params.session_id,
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

  const deleteOneOnOneAgendaAction = () => {
    if (!agenda) return;
    try {
      deleteOneOnOneAgendaMutation({
        variables: {  agendaId: agenda?.id },
        ...deleteOneOnOneAgendaCacheHandler({
          agendaId: agenda.id,
          sessionId: match.params.session_id,
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
    <div>
      <StyledModal
        closable={false}
        maskClosable={false}
        visible={visiblity}
        title={<Title level={3}>{agenda ? 'Edit' : 'Add'} agenda item</Title>}
      >
        <AgendaForm
          data={agenda}
          onSubmit={agenda ? updateOneOnOneAgendaAction : addOneOnOneAgendaAction}
          deleteAction={deleteOneOnOneAgendaAction}
          setVisibility={setVisibility}
        />
      </StyledModal>
      {agenda ? (
        <Button onClick={() => setVisibility(true)} className="text-muted" type="link" icon="form" size="large" />
      ) : (
        <Button type="primary" ghost onClick={() => setVisibility(true)}>Add talking points</Button>
      )}
    </div>
  );
}

export default withRouter(AgendaModal);
