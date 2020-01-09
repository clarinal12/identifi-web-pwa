import { gql } from 'apollo-boost';

const CHECKIN_STATS = `
  percentage
  count
`;

const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  avatar
  memberId
  role
`;

const CHECKIN_GOAL = `
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
  responses {
    id
    respondent {
      ${MEMBER_FIELDS}
    }
    submitDate
    answers {
      question
      answer
    }
    onTime
    goalCompleted
    mood
    blocker
    currentGoal {
      ${CHECKIN_GOAL}
    }
    previousGoal {
      ${CHECKIN_GOAL}
    }
    numberOfComments
    reactions {
      emoji
      count
      hasReacted
    }
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
  replies {
    expected
    total
  }
`;

export const CHECKIN_SCHEDULES = gql`
  query CheckInSchedules($filter: CheckInSchedulesInputFilter!) {
    checkInSchedules(filter: $filter) {
      ${CHECKIN_FIELDS}
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
