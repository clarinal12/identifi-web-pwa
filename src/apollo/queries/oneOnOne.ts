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
        scheduleId
        upcomingSessionDate
        frequency
        duration
        currentSessionId
        status
      }
    }
  }
`;

export const ONE_ON_ONE_SCHEDULE = gql`
  query OneOnOneSchedule($scheduleId: ID!) {
    oneOnOneSchedule(scheduleId: $scheduleId) {
      id
      upcomingSessionDate
      frequency
      duration
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
          status
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
      status
      canModifyFeedback
      canModifyAgenda
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


export const ONE_ON_ONE_HEADER = gql`
  query OneOnOneHeader($sessionId: ID!) {
    oneOnOneHeader(sessionId: $sessionId) {
      scheduleId
      time
      displayMember {
        ${MEMBER_FIELDS}
      }
      status
      maxRescheduleDateRange
      canRescheduleSession
      canSkipSession
      showCompleteButton
      canCompleteSession
    }
  }
`;
