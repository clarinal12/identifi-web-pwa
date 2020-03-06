import gql from 'graphql-tag';

export const CANCEL_INVITE = gql`
  mutation cancelInvitation($memberId: ID!) {
    cancelInvitation(memberId: $memberId)
  }
`;

export const RESEND_INVITE = gql`
  mutation resendInvitation($memberId: ID!) {
    resendInvitation(memberId: $memberId)
  }
`;
