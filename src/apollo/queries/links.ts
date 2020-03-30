import gql from 'graphql-tag';

import MEMBER_FIELDS from '../fields/member';

export const STORED_LINKS = gql`
  query StoredLinks($companyId: ID!, $filter: StoredLinksFilterInput, $pagination: PaginationInput ) {
    storedLinks(companyId: $companyId, filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
          id
          link {
            url
            title
            image
            description
          }
          category {
            id
            keyword
          }
          sharedBy {
            ${MEMBER_FIELDS}
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const LINK_CATEGORIES = gql`
  query Categories($companyId: ID!) {
    categories(companyId: $companyId) {
      id
      keyword
    }
  }
`;
