import { gql } from 'apollo-boost';

export const ADD_CHECKIN_RESPONSE_REACTION = gql`
  mutation AddCheckInResponseReaction($input: AddCheckInResponseReactionInput!) {
    addCheckInResponseReaction(input: $input)
  }
`;

export const REMOVE_CHECKIN_RESPONSE_REACTION = gql`
  mutation RemoveCheckInResponseReaction($responseId: ID!, $emoji: Int!) {
    removeCheckInResponseReaction(responseId: $responseId, emoji: $emoji)
  }
`;
