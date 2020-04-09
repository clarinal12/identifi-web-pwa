import gql from 'graphql-tag';

export const CREATE_CHECKIN_SCHEDULE = gql`
  mutation CreateCheckInSchedule($input: CreateCheckInScheduleInput!) {
    createCheckInSchedule(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_CHECKIN_SCHEDULE = gql`
  mutation UpdateCheckInSchedule($id: ID!, $input: UpdateCheckInScheduleInput!) {
    updateCheckInSchedule(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_CHECKIN_SCHEDULE = gql`
  mutation DeleteCheckInSchedule($id: ID!) {
    deleteCheckInSchedule(id: $id)
  }
`;

export const TOGGLE_CHECKIN_STATUS = gql`
  mutation ToggleCheckInScheduleStatus($input: ToggleCheckInScheduleStatusInput!) {
    toggleCheckInScheduleStatus(input: $input) {
      id
    }
  }
`;

export const UPDATE_CHECKIN_GOAL = gql`
  mutation UpdateCheckInGoal($goalId: ID!, $input: UpdateCheckInGoalInput!) {
    updateCheckInGoal(goalId: $goalId, input: $input) {
      id
      createdAt
      goal
      completed
    }
  }
`;

export const UPDATE_CHECKIN_ANSWER = gql`
  mutation UpdateCheckInAnswer($answerId: ID!, $input: UpdateCheckInAnswerInput!) {
    updateCheckInAnswer(answerId: $answerId, input: $input) {
      id
    }
  }
`;

export const ADD_CHECKIN_BLOCKER = gql`
  mutation AddCheckInBlocker($responseId: ID!, $input: AddCheckInBlockerInput!) {
    addCheckInBlocker(responseId: $responseId, input: $input) {
      id
    }
  }
`;

export const UPDATE_CHECKIN_BLOCKER = gql`
  mutation UpdateCheckInBlocker($blockerId: ID!, $input: UpdateCheckInBlockerInput!) {
    updateCheckInBlocker(blockerId: $blockerId, input: $input) {
      id
      blocker
    }
  }
`;

export const REMOVE_CHECKIN_BLOCKER = gql`
  mutation RemoveCheckInBlocker($blockerId: ID!) {
    removeCheckInBlocker(blockerId: $blockerId)
  }
`;
