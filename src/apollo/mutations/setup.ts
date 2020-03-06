import gql from 'graphql-tag';

export const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      email
      firstname
      lastname
    }
  }
`;

export const ENTER_COMPANY = gql`
  mutation EnterCompany($companyId: ID!) {
    enterCompany(companyId: $companyId) {
      id
      email
    }
  }
`;

export const INVITE_EMAIL = gql`
  mutation InviteMembers($input: InviteMembersInput!) {
    inviteMembers(input: $input) {
      id
      email
    }
  }
`;
