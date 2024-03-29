import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const ACCOUNT = gql`
  query Me {
    me {
      ${MEMBER_FIELDS}
      location
      timezone
      onboarded
      isOwner
      # invited
      activeCompany {
        id
        name
        slackEnabled
        owner {
          ${MEMBER_FIELDS}
        }
      }
    }
  }
`;

export const VERIFY_RESET_TOKEN = gql`
  query VerifyResetToken($token: String!) {
    verifyResetToken(token: $token)
  }
`;

export const VERIFY_INVITE_TOKEN = gql`
  query VerifyInviteToken($token: String!) {
    verifyInviteToken(token: $token)
  }
`;

export const AVAILABE_DIRECT_REPORTS = gql`
  query AvailableDirectReports($managerId: ID!) {
    availableDirectReports(managerId: $managerId) {
      ${MEMBER_FIELDS}
    }
  }
`;
