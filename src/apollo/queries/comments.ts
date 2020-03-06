import gql from 'graphql-tag';

const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  avatar
  role
`;

export const COMMENTS = gql`
  query CheckInResponseComments($checkInResponseId: ID!) {
    checkInResponseComments(checkInResponseId: $checkInResponseId) {
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
