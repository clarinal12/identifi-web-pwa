import gql from 'graphql-tag';

const GOAL_FIELDS = `
  id
  title
  target
  current
  type
  unit
`;

export const GOALS = gql`
  query Goals($memberId: ID!) {
    goals(memberId: $memberId) {
      ${GOAL_FIELDS}
    }
  }
`;
