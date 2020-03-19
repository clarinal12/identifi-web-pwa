import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';
import ONE_ON_ONE_SCHEDULE_FIELDS from '../fields/oneOnOneSchedule';

export const ONE_ON_ONES = gql`
  query OneOnOnes {
    oneOnOnes {
      isManager
      teammate {
        ${MEMBER_FIELDS}
      }
      info {
        ${ONE_ON_ONE_SCHEDULE_FIELDS}
      }
    }
  }
`;

export const ONE_ON_ONE_SCHEDULE = gql`
  query OneOnOneSchedule($scheduleId: ID!) {
    oneOnOneSchedule(scheduleId: $scheduleId) {
      id
      upcomingSessionDate
      nextSessionDate
      frequency
      duration
      status
      currentSessionId
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

export const ONE_ON_ONE_SESSION = gql`
  query OneOnOneSession($sessionId: ID!) {
    oneOnOneSession(sessionId: $sessionId) {
      id
      time
      completed
      feedbackInfo {
        feedback {
          id
          content
        }
        author {
          ${MEMBER_FIELDS}
        }
      }
      agenda {
        id
        topic
        content
        author {
          ${MEMBER_FIELDS}
        }
      }
    }
  }
`;
