import { gql } from 'apollo-boost';

export const MEMBERS = gql`
  query members($companyId: ID!) {
    members(companyId: $companyId) {
      id
      email
      firstname
      lastname
      access
      status
      memberId
    }
  }
`;
