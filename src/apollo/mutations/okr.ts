import gql from 'graphql-tag';

export const CREATE_CORE_OBJECTIVE = gql`
  mutation createCoreObjective($input: CreateCoreObjectiveInput!) {
    createCoreObjective(input: $input) {
      createdAt
    }
  }
`;

export const CREATE_SUB_OBJECTIVE = gql`
  mutation createSubObjective($input: CreateSubObjectiveInput!) {
    createSubObjective(input: $input) {
      createdAt
    }
  }
`;

export const EDIT_OBJECTIVE = gql`
  mutation updateObjective($id: ID!, $input: UpdateObjectiveInput!) {
    updateObjective(id: $id, input: $input) {
      createdAt
    }
  }
`;
export const DELETE_OBJECTIVE = gql`
  mutation deleteObjective($id: ID!) {
    deleteObjective(id: $id)
  }
`;

export const CREATE_KEY_RESULT = gql`
  mutation createKeyResult($input: CreateKeyResultInput!) {
    createKeyResult(input: $input) {
      createdAt
    }
  }
`;

export const EDIT_KEY_RESULT = gql`
  mutation updateKeyResult($id: ID!, $input: UpdateKeyResultInput!) {
    updateKeyResult(id: $id, input: $input) {
      createdAt
    }
  }
`;

export const DELETE_KEY_RESULT = gql`
  mutation deleteKeyResult($id: ID!) {
    deleteKeyResult(id: $id)
  }
`;

export const CREATE_ACTIVITY = gql`
  mutation createActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
      submitDate
    }
  }
`;
