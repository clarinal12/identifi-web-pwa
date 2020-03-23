import gql from 'graphql-tag';

import AGENDA_FIELDS from '../fields/agenda';

export const ADD_ONE_ON_ONE_AGENDA = gql`
  mutation AddOneOnOneAgenda($sessionId: ID!, $input: AddOneOnOneAgendaInput!) {
    addOneOnOneAgenda(sessionId: $sessionId, input: $input) {
      ${AGENDA_FIELDS}
    }
  }
`;

export const UPDATE_ONE_ON_ONE_AGENDA = gql`
  mutation UpdateOneOnOneAgenda($agendaId: ID!, $input: UpdateOneOnOneAgendaInput!) {
    updateOneOnOneAgenda(agendaId: $agendaId, input: $input) {
      ${AGENDA_FIELDS}
    }
  }
`;

export const DELETE_ONE_ON_ONE_AGENDA = gql`
  mutation DeleteOneOnOneAgenda($agendaId: ID!) {
    deleteOneOnOneAgenda(agendaId: $agendaId)
  }
`;
