import gql from 'graphql-tag';

import ONE_ONE_ONE_SCHEDULE_FIELDS from '../fields/oneOnOneSchedule';

export const SCHEDULE_ONE_ON_ONE = gql`
  mutation ScheduleOneOnOne($directReportId: ID!, $input: ScheduleOneOnOneInput!) {
    scheduleOneOnOne(directReportId: $directReportId, input: $input) {
      scheduleId
      ${ONE_ONE_ONE_SCHEDULE_FIELDS}
    }
  }
`;

export const UPDATE_ONE_ON_ONE_ESCHEDULE = gql`
  mutation UpdateOneOnOneSchedule($scheduleId: ID!, $input: UpdateOneOnOneScheduleInput!) {
    updateOneOnOneSchedule(scheduleId: $scheduleId, input: $input) {
      scheduleId
      ${ONE_ONE_ONE_SCHEDULE_FIELDS}
    }
  }
`;

export const RESCHEDULE_ONE_ON_ONE = gql`
  mutation RescheduleOneOnOne($sessionId: ID!, $time: DateTime!) {
    rescheduleOneOnOne(sessionId: $sessionId, time: $time)
  }
`;
