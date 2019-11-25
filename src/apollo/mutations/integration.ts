import { gql } from 'apollo-boost';

export const INTEGRATE_SLACK = gql`
  mutation IntegrateSlack($input: IntegrateSlackInput!) {
    integrateSlack(input: $input) {
      id
      email
      memberId
    }
  }
`;
