import gql from 'graphql-tag';

import SESSION_INFO_FIELDS from '../fields/sessionInfo';

export const SCHEDULE_ONE_ON_ONE = gql`
  mutation ScheduleOneOnOne($directReportId: ID!, $input: ScheduleOneOnOneInput!) {
    scheduleOneOnOne(directReportId: $directReportId, input: $input) {
      ${SESSION_INFO_FIELDS}
    }
  }
`;

export const UPDATE_ONE_ON_ONE_ESCHEDULE = gql`
  mutation UpdateOneOnOneSchedule($scheduleId: ID!, $input: UpdateOneOnOneScheduleInput!) {
    updateOneOnOneSchedule(scheduleId: $scheduleId, input: $input) {
      ${SESSION_INFO_FIELDS}
    }
  }
`;

export const RESCHEDULE_ONE_ON_ONE = gql`
  mutation RescheduleOneOnOne($sessionId: ID!, $time: String!) {
    rescheduleOneOnOne(sessionId: $sessionId, time: $time)
  }
`;

export const SKIP_ONE_ON_ONE = gql`
  mutation SkipOneOnOne($sessionId: ID!) {
    skipOneOnOne(sessionId: $sessionId)
  }
`;

export const COMPLETE_ONE_ON_ONE = gql`
  mutation CompleteOneOnOne($sessionId: ID!) {
    completeOneOnOne(sessionId: $sessionId)
  }
`;
