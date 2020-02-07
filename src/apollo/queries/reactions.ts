import { gql } from 'apollo-boost';

import { MEMBER_FIELDS } from './member';

export const CHECKIN_RESPONSE_REACTORS = gql`
  query CheckInResponseReactors($filter: CheckInResponseReactorsFilter!) {
    checkInResponseReactors(filter: $filter) {
      ${MEMBER_FIELDS}
    }
  }
`;

export const EMOJIS = gql`
  query Emojis {
    emojis {
      id
      web
      description
    }
  }
`;
