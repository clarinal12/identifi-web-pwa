import { gql } from 'apollo-boost';

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
    id
    date
    submitted {
      ${MEMBER_FIELDS}
    }
    notSubmitted {
      ${MEMBER_FIELDS}
    }
    responses {
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
      currentGoal {
        ${CHECKIN_GOAL}
      }
      previousGoal {
        ${CHECKIN_GOAL}
      }
    }
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
      id
      date
      submitted {
        ${MEMBER_FIELDS}
      }
      notSubmitted {
        ${MEMBER_FIELDS}
      }
      responses {
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
        currentGoal {
          ${CHECKIN_GOAL}
        }
        previousGoal {
          ${CHECKIN_GOAL}
        }
      }
    }
  }
`;
