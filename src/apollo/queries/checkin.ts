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

const SINGLE_CHECKIN_FIELDS = `
  id
  date
  submitted {
    ${MEMBER_FIELDS}
  }
  notSubmitted {
    ${MEMBER_FIELDS}
  }
  mentionables {
    ${MEMBER_FIELDS}
  }
  responses {
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
    goalCompleted
    mood {
      ${EMOJI_FIELDS}
    }
    block {
      id
      blocker
    }
    currentGoal {
      ${CHECKIN_GOAL}
    }
    previousGoal {
      ${CHECKIN_GOAL}
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
  }
  checkedIn {
    ${CHECKIN_STATS}
  }
  completedGoals {
    ${CHECKIN_STATS}
  }
  blockers {
    ${CHECKIN_STATS}
  }
  isCurrent
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
  status
  currentCheckIn {
    ${SINGLE_CHECKIN_FIELDS}
  }
  pastCheckIns {
    id
    date
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

export const CHECKIN = gql`
  query CheckIn($id: ID!) {
    checkIn(id: $id) {
      ${SINGLE_CHECKIN_FIELDS}
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
  query CheckInHeader($checkInId: ID!) {
    checkInHeader(checkInId: $checkInId) {
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

export const CHECKIN_RESPONSES = gql`
  query CheckInResponses($checkInId: ID!, $filter: CheckInResponsesFilterInput, $pagination: PaginationInput ) {
    checkInResponses(checkInId: $checkInId, filter: $filter, pagination: $pagination) {
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
    }
  }
`;