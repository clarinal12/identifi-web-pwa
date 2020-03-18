import MEMBER_FIELDS from './member';

export default `
  id
  topic
  content
  author {
    ${MEMBER_FIELDS}
  }
`;
