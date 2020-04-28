import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input)
  }
`;

export const RECOVER_ACCOUNT = gql`
  mutation RecoverAccount($email: EmailAddress!) {
    recoverAccount(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token)
  }
`;

export const SETUP_INVITED_USER = gql`
  mutation SetupInvitedUser($input: SetupInvitedUserInput!, $token: String!) {
    setupInvitedUser(input: $input, token: $token)
  }
`;

export const ADD_DIRECT_REPORT = gql`
  mutation AddDirectReport($managerId: ID!, $directReportId: ID!) {
    addDirectReport(managerId: $managerId, directReportId: $directReportId) {
      ${MEMBER_FIELDS}
    }
  }
`;

export const REMOVE_DIRECT_REPORT = gql`
  mutation RemoveDirectReport($managerId: ID!, $directReportId: ID!) {
    removeDirectReport(managerId: $managerId, directReportId: $directReportId)
  }
`;

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: EmailAddress!) {
    sendMagicLink(email: $email)
  }
`;
