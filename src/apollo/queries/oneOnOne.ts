import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const ONE_ON_ONES = gql`
  query OneOnOnes {
    oneOnOnes {
      isManager
      teammate {
        ${MEMBER_FIELDS}
      }
      info {
        nextSessionDate
        frequency
        scheduleId
        currentSessionId
      }
    }
  }
`;
