import { gql } from 'apollo-boost';

const GOAL_FIELDS = `
  id
  title
  target
  current
  type
`;

export const GOALS = gql`
  query goals($memberId: ID!) {
    goals(memberId: $memberId) {
      ${GOAL_FIELDS}
    }
  }
`;
