import gql from 'graphql-tag';

export const INTEGRATE_SLACK = gql`
  mutation IntegrateSlack($input: IntegrateSlackInput!) {
    integrateSlack(input: $input) {
      id
      email
    }
  }
`;

export const INTEGRATE_GOOGLE = gql`
  mutation IntegrateGoogle($code: String!, $scopes: [GOOGLE_INTEGRATION_SCOPES!]!) {
    integrateGoogle(code: $code, scopes: $scopes)
  }
`;

export const DISABLE_GOOGLE_CALENDAR = gql`
  mutation DisableGoogleCalendar {
    disableGoogleCalendar
  }
`;
