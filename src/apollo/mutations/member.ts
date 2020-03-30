import gql from 'graphql-tag';

export const CANCEL_INVITE = gql`
  mutation CancelInvitation($memberId: ID!) {
    cancelInvitation(memberId: $memberId)
  }
`;

export const RESEND_INVITE = gql`
  mutation ResendInvitation($memberId: ID!) {
    resendInvitation(memberId: $memberId)
  }
`;
