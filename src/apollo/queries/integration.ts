import gql from 'graphql-tag';

import GOOGLE_FIELDS from '../fields/goolge';

export const INTEGRATION_INFO = gql`
  query IntegrationInfo {
    integrationInfo {
      ${GOOGLE_FIELDS}
    }
  }
`;
