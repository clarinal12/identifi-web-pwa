import gql from 'graphql-tag';

export const INTEGRATE_SLACK = gql`
  mutation IntegrateSlack($input: IntegrateSlackInput!) {
    integrateSlack(input: $input) {
      id
      email
    }
  }
`;
