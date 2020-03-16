import gql from 'graphql-tag';

export const SCHEDULE_ONE_ON_ONE = gql`
  mutation ScheduleOneOnOne($directReportId: ID!, $input: ScheduleOneOnOneInput!) {
    scheduleOneOnOne(directReportId: $directReportId, input: $input) {
      nextSessionDate
      frequency
      scheduleId
      currentSessionId
    }
  }
`;
