import { gql } from 'apollo-boost';

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
  query verifyResetToken($token: String!) {
    verifyResetToken(token: $token)
  }
`;

export const VERIFY_INVITE_TOKEN = gql`
  query verifyInviteToken($token: String!) {
    verifyInviteToken(token: $token)
  }
`;
