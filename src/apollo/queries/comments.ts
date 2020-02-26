import { gql } from 'apollo-boost';

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
      comment
      createdAt
      updatedAt
    }
  }
`;
