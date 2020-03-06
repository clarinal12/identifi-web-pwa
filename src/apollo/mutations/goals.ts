import gql from 'graphql-tag';

export const ADD_GOAL = gql`
  mutation AddGoal($input: AddGoalInput!) {
    addGoal(input: $input) {
      id
    }
  }
`;

export const DELETE_GOAL = gql`
  mutation DeleteGoal($goalId: ID!) {
    deleteGoal(goalId: $goalId)
  }
`;

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($goalId: ID!, $input: UpdateGoalInput!) {
    updateGoal(goalId: $goalId, input: $input) {
      id
    }
  }
`;
