import gql from 'graphql-tag';

import COMMENT_FIELDS from '../fields/comment';

export const ADD_COMMENT = gql`
  mutation AddCheckInResponseComment($input: AddCheckInResponseCommentInput!) {
    addCheckInResponseComment(input: $input) {
      ${COMMENT_FIELDS}
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateCheckInResponseComment($id: ID!, $input: UpdateCheckInResponseCommentInput!) {
    updateCheckInResponseComment(id: $id, input: $input) {
      ${COMMENT_FIELDS}
    }
  }
`;

export const DELETE_COMMENT  = gql`
  mutation DeleteCheckInResponseComment($id: ID!) {
    deleteCheckInResponseComment(id: $id)
  }
`;
