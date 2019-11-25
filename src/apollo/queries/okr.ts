import { gql } from 'apollo-boost';

export const CORE_OBJECTIVES = gql`
  query coreObjectives($filter: CoreObjectivesFilterInput!) {
    coreObjectives(filter: $filter) {
      id
      title
      deadline
      progress
      description
      owner {
        id
        memberId
        firstname
        lastname
        email
      }
      contributors {
        id
        memberId
        firstname
        lastname
        email
      }
      subObjectives {
        id
        parentId
        title
        deadline
        progress
        description
        contributors {
          id
          memberId
          firstname
          lastname
          email
        }
        keyResults {
          id
          objectiveId
          title
          deadline
          contributors {
            id
            memberId
            firstname
            lastname
            email
          }
          ... on BooleanKeyResult {
            completed
          }
          ... on NumericKeyResult {
            unit
            initial
            current
            progress
            target
          }
        }
      }
    }
  }
`;