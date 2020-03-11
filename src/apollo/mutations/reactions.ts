import gql from 'graphql-tag';

export const ADD_CHECKIN_RESPONSE_REACTION = gql`
  mutation AddCheckInResponseReaction($input: AddCheckInResponseReactionInput!) {
    addCheckInResponseReaction(input: $input) {
      id
      web
      description
    }
  }
`;

export const REMOVE_CHECKIN_RESPONSE_REACTION = gql`
  mutation RemoveCheckInResponseReaction($responseId: ID!, $emojiId: Int!) {
    removeCheckInResponseReaction(responseId: $responseId, emojiId: $emojiId)
  }
`;
