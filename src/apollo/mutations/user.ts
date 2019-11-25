import { gql } from 'apollo-boost';

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
