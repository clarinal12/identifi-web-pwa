import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

const EMOJI_FIELDS = `
  id
  web
  description
`;

const CHECKIN_STATS = `
  percentage
  colored {
    ${MEMBER_FIELDS}
  }
  faded {
    ${MEMBER_FIELDS}
  }
`;

const CHECKIN_GOAL = `
  id
  createdAt
  goal
  completed
`;

const CHECKIN_FIELDS = `
  id
  name
  frequency
  days
  nextCheckInDate
  time
  waitingTime
  remindTime
  timezone
  goalsEnabled
  moodsEnabled
  blockersEnabled
  respondents {
    ${MEMBER_FIELDS}
  }
  watchers {
    ${MEMBER_FIELDS}
  }
  questions
  slackChannel {
    id
    name
  }
  isPrivate
`;

const CHECKIN_CARD = `
  scheduleId
  currentCheckInInfo {
    id
    date
  }
  name
  replies {
    expected
    total
  }
  nextCheckInDate
  frequency
  status
`;

const CHECKIN_REPLIES = `
  edges {
    cursor
    node {
      id
      respondent {
        ${MEMBER_FIELDS}
      }
      submitDate
      answers {
        id
        question
        answer
      }
      onTime
      currentGoal {
        ${CHECKIN_GOAL}
      }
      previousGoal {
        ${CHECKIN_GOAL}
      }
      block {
        id
        blocker
      }
      mood {
        ${EMOJI_FIELDS}
      }
      numberOfComments
      reactions {
        emoji {
          ${EMOJI_FIELDS}
        }
        count
        hasReacted
      }
      streak
      goalCompleted
    }
  }
  pageInfo {
    endCursor
    hasNextPage
    # startCursor
    # hasPreviousPage
  }
  totalCount
`;

export const CHECKIN_CARDS = gql`
  query CheckInCards {
    checkInCards {
      myCheckIns {
        ${CHECKIN_CARD}
      }
      allCheckIns {
        ${CHECKIN_CARD}
      }
    }
  }
`;

export const SLACK_CHANNELS = gql`
  query SlackChannels($filter: SlackChannelsInputFilter!) {
    slackChannels(filter: $filter) {
      id
      name
    }
  }
`;

export const CHECKIN_SCHEDULE = gql`
  query CheckInSchedule($id: ID!) {
    checkInSchedule(id: $id) {
      ${CHECKIN_FIELDS}
    }
  }
`;

export const CHECKIN_RESPONSE_SECTION = gql`
  query CheckInResponseSection($scheduleId: ID!, $checkInId: ID, $filter: CheckInResponsesFilterInput, $pagination: PaginationInput) {
    checkInResponseSection(scheduleId: $scheduleId, checkInId: $checkInId) {
      id
      isCurrent
      replies(filter: $filter, pagination: $pagination) {
        ${CHECKIN_REPLIES}
      }
    }
  }
`;

export const PAST_CHECKINS = gql`
  query PastCheckIns($checkInScheduleId: ID!, $pagination: PaginationInput ) {
    pastCheckIns(checkInScheduleId: $checkInScheduleId, pagination: $pagination) {
      edges {
        cursor
        node {
          id
          date
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        # startCursor
        # hasPreviousPage
      }
      totalCount
    }
  }
`;

export const CHECKIN_HEADER = gql`
  query CheckInHeader($scheduleId: ID!, $checkInId: ID) {
    checkInHeader(scheduleId: $scheduleId, checkInId: $checkInId) {
      name
      scheduleId
      status
      date
      stats {
        checkedIn {
        ${CHECKIN_STATS}
        }
        completedGoals {
          ${CHECKIN_STATS}
        }
        blockers {
          ${CHECKIN_STATS}
        }
      }
    }
  }
`;

export const CHECKIN_PARTICIPANTS = gql`
  query CheckInParticipants($checkInScheduleId: ID!) {
    checkInParticipants(checkInScheduleId: $checkInScheduleId) {
      member {
        ${MEMBER_FIELDS}
      }
      role
    }
  }
`;