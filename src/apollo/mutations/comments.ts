import gql from 'graphql-tag';

const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  avatar
  role
`;

export const ADD_COMMENT = gql`
  mutation AddCheckInResponseComment($input: AddCheckInResponseCommentInput!) {
    addCheckInResponseComment(input: $input) {
      id
      author {
        id
        firstname
        lastname
        email
        avatar
      }
      mentions {
        ${MEMBER_FIELDS}
      }
      comment
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateCheckInResponseComment($id: ID!, $input: UpdateCheckInResponseCommentInput!) {
    updateCheckInResponseComment(id: $id, input: $input) {
      id
      author {
        id
        firstname
        lastname
        email
        avatar
      }
      mentions {
        ${MEMBER_FIELDS}
      }
      comment
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COMMENT  = gql`
  mutation DeleteCheckInResponseComment($id: ID!) {
    deleteCheckInResponseComment(id: $id)
  }
`;
