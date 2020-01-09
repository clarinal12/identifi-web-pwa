import { gql } from 'apollo-boost';

export const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  access
  status
  role
  memberId
  avatar
`;

export const MEMBERS = gql`
  query members($companyId: ID!) {
    members(companyId: $companyId) {
      ${MEMBER_FIELDS}
    }
  }
`;

export const MEMBER = gql`
  query member($memberId: ID!) {
    member(memberId: $memberId) {
      ${MEMBER_FIELDS}
    }
  }
`;
