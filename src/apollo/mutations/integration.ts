import gql from 'graphql-tag';

import GOOGLE_FIELDS from '../fields/goolge';

export const INTEGRATE_SLACK = gql`
  mutation IntegrateSlack($input: IntegrateSlackInput!) {
    integrateSlack(input: $input) {
      id
      email
    }
  }
`;

export const SETUP_GOOGLE_INTEGRATION = gql`
  mutation SetupGoogleIntegration($redirectURI: String! ,$code: String!, $scopes: [String!]!) {
    setupGoogleIntegration(redirectURI: $redirectURI, code: $code, scopes: $scopes) {
      ${GOOGLE_FIELDS}
    }
  }
`;

export const DISABLE_GOOGLE_INTEGRATION = gql`
  mutation DisableGoogleIntegration($scope: String!) {
    disableGoogleIntegration(scope: $scope) {
      ${GOOGLE_FIELDS}
    }
  }
`;
