import gql from 'graphql-tag';

export const SCHEDULE_ONE_ON_ONE = gql`
  mutation ScheduleOneOnOne($directReportId: ID!, $input: ScheduleOneOnOneInput!) {
    scheduleOneOnOne(directReportId: $directReportId, input: $input) {
      scheduleId
      upcomingSessionDate
      frequency
      duration
      currentSessionId
      currentSessionStatus
      status
    }
  }
`;

export const UPDATE_ONE_ON_ONE_ESCHEDULE = gql`
  mutation UpdateOneOnOneSchedule($scheduleId: ID!, $input: UpdateOneOnOneScheduleInput!) {
    updateOneOnOneSchedule(scheduleId: $scheduleId, input: $input) {
      scheduleId
      upcomingSessionDate
      frequency
      currentSessionId
      status
      duration
    }
  }
`;

export const RESCHEDULE_ONE_ON_ONE = gql`
  mutation RescheduleOneOnOne($sessionId: ID!, $time: DateTime!) {
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
