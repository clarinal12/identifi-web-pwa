import gql from 'graphql-tag';

export const SIGN_UP = gql`
  mutation signUp($input: SignUpInput!) {
    signUp(input: $input)
  }
`;

export const RECOVER_ACCOUNT = gql`
  mutation recoverAccount($email: EmailAddress!) {
    recoverAccount(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token)
  }
`;

export const SETUP_INVITED_USER = gql`
  mutation setupInvitedUser($input: SetupInvitedUserInput!, $token: String!) {
    setupInvitedUser(input: $input, token: $token)
  }
`;

export const ADD_DIRECT_REPORT = gql`
  mutation AddDirectReport($managerId: ID!, $directReportId: ID!) {
    addDirectReport(managerId: $managerId, directReportId: $directReportId) {
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

export const REMOVE_DIRECT_REPORT = gql`
  mutation RemoveDirectReport($managerId: ID!, $directReportId: ID!) {
    removeDirectReport(managerId: $managerId, directReportId: $directReportId)
  }
`;
