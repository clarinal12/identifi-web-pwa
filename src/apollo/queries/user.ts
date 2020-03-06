import gql from 'graphql-tag';

export const ACCOUNT = gql`
  query me {
    me {
      id
      email
      firstname
      lastname
      role
      location
      avatar
      timezone
      onboarded
      # invited
      isOwner
      activeCompany {
        id
        name
        slackEnabled
        owner {
          id
          email
          firstname
          lastname
          access
          status
        }
      }
      memberInfo {
        memberId
        isOwner
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
      id
      email
      firstname
      lastname
      access
      status
      role
      avatar
      isGuest
    }
  }
`;
