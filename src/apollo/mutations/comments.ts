import gql from 'graphql-tag';

export const ADD_COMMENT = gql`
  mutation AddCheckInResponseComment($input: AddCheckInResponseCommentInput!) {
    addCheckInResponseComment(input: $input) {
      id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateCheckInResponseComment($id: ID!, $input: UpdateCheckInResponseCommentInput!) {
    updateCheckInResponseComment(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_COMMENT  = gql`
  mutation DeleteCheckInResponseComment($id: ID!) {
    deleteCheckInResponseComment(id: $id)
  }
`;
