import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

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
      isManager
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
      currentCheckInDate
      nextCheckInDate
      frequency
      status
    }
  }
`;
