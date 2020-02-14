import { gql } from 'apollo-boost';

const MEMBER_FIELDS = `
  id
  email
  firstname
  lastname
  avatar
  memberId
  role
`;

export const STORED_LINKS = gql`
  query StoredLinks($companyId: ID!, $filter: StoredLinksFilterInput) {
    storedLinks(companyId: $companyId, filter: $filter) {
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
