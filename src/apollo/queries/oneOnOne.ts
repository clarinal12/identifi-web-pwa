import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const ONE_ON_ONES = gql`
  query OneOnOnes {
    oneOnOnes {
      isManager
      teammate {
        ${MEMBER_FIELDS}
      }
      info {
        nextSessionDate
        frequency
        scheduleId
        currentSessionId
      }
    }
  }
`;

export const ONE_ON_ONE_SCHEDULE = gql`
  query OneOnOneSchedule($scheduleId: ID!) {
    oneOnOneSchedule(scheduleId: $scheduleId) {
      id
      nextSessionDate
      frequency
      duration
      displayMember {
        ${MEMBER_FIELDS}
      }
    }
  }
`;

export const ONE_ON_ONE_SESSIONS = gql`
  query OneOnOneSessions($scheduleId: ID!, $pagination: PaginationInput) {
    oneOnOneSessions(scheduleId: $scheduleId, pagination: $pagination) {
      edges {
        cursor
        node {
          id
          time
          completed
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;
