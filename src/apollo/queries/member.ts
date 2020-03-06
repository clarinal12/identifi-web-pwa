import gql from 'graphql-tag';

export const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  access
  status
  role
  avatar
  isGuest
`;

export const MEMBERS = gql`
  query Members($companyId: ID!) {
    members(companyId: $companyId) {
      ${MEMBER_FIELDS}
    }
  }
`;

export const MEMBER = gql`
  query Member($memberId: ID!) {
    member(memberId: $memberId) {
      ${MEMBER_FIELDS}
      directReports {
        ${MEMBER_FIELDS}
      }
      manager {
        ${MEMBER_FIELDS}
      }
    }
  }
`;

export const MEMBER_CHECKINS = gql`
  query MemberCheckIns($memberId: ID!) {
    memberCheckIns(memberId: $memberId) {
      scheduleId
      name
      replies {
        expected
        total
      }
      nextCheckInDate
      frequency
      status
    }
  }
`;
