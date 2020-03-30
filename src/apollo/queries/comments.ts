import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const COMMENTS = gql`
  query CheckInResponseComments($checkInResponseId: ID!) {
    checkInResponseComments(checkInResponseId: $checkInResponseId) {
      id
      author {
        ${MEMBER_FIELDS}
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
