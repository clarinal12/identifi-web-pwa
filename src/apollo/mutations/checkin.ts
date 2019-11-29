import { gql } from 'apollo-boost';

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
  mutation DeleteSchedule($id: ID!) {
    deleteSchedule(id: $id)
  }
`;

export const TOGGLE_CHECKIN_STATUS = gql`
  mutation ToggleCheckInScheduleStatus($input: ToggleCheckInScheduleStatusInput!) {
    toggleCheckInScheduleStatus(input: $input) {
      id
    }
  }
`;
