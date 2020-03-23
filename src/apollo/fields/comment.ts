import MEMBER_FIELDS from './member';

export default `
  id
  author {
    ${MEMBER_FIELDS}
  }
  mentions {
    ${MEMBER_FIELDS}
  }
  comment
  createdAt
  updatedAt
`;
