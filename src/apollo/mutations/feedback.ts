import gql from 'graphql-tag';

export const ADD_ONE_ON_ONE_FEEDBACK = gql`
  mutation AddOneOnOneFeedback($sessionId: ID!, $input: AddOneOnOneFeedbackInput!) {
    addOneOnOneFeedback(sessionId: $sessionId, input: $input) {
      id
      content
    }
  }
`;

export const UPDATE_ONE_ON_ONE_FEEDBACK = gql`
  mutation UpdateOneOnOneFeedback($feedbackId: ID!, $input: UpdateOneOnOneFeedbackInput!) {
    updateOneOnOneFeedback(feedbackId: $feedbackId, input: $input) {
      id
      content
    }
  }
`;

export const DELETE_ONE_ON_ONE_FEEDBACK = gql`
  mutation DeleteOneOnOneFeedback($feedbackId: ID!) {
    deleteOneOnOneFeedback(feedbackId: $feedbackId)
  }
`;
