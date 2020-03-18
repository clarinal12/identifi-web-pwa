import gql from 'graphql-tag';

export const SCHEDULE_ONE_ON_ONE = gql`
  mutation ScheduleOneOnOne($directReportId: ID!, $input: ScheduleOneOnOneInput!) {
    scheduleOneOnOne(directReportId: $directReportId, input: $input) {
      upcomingSessionDate
      frequency
      scheduleId
      currentSessionId
    }
  }
`;
