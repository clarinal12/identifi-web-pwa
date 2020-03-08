import React from 'react';
import styled from 'styled-components';
import { List, Avatar } from 'antd';
import { MentionsInput, Mention } from 'react-mentions';

import { useMentionSourceContextValue } from 'contexts/MentionSourceContext';
import { getDisplayName } from 'utils/userUtils';

const StyledMentionInput = styled(MentionsInput)`
  div[class$="__highlighter"], textarea {
    padding: 6px 10px;
  }
  div[class$="__highlighter"] {
    word-break: break-word;
    border: 0;
    strong {
      background: #E6FFFB;
    }
  }
  textarea {
    transition: all .3s,height 0s;
    border-radius: 4px;
    color: #262626;
    &::placeholder {
      color: #d9d9d9;
    }
    &:hover, &:focus {
      border-color: #23a8a8;
    }
    &:focus {
      box-shadow: 0 0 0 2px #08979c33;
    }
  }
`;

interface IMentionBox {
  id: string,
  comment: string,
  isUpdating: boolean,
  setComment: (comment: string) => void,
  setMentions: (mentions: string[]) => void,
  commentAction: () => void,
}

const MentionBox: React.FC<IMentionBox> = ({
  comment, isUpdating, setComment, commentAction, id, setMentions,
}) => {
  const { mentionSource } = useMentionSourceContextValue();
  const mentionableUsers = mentionSource.map((user) => ({
    id: user.id,
    display: getDisplayName(user) || '',
    position: user.role,
    avatar: user.avatar,
  }));

  return (
    <StyledMentionInput
      id={id}
      allowSpaceInQuery
      allowSuggestionsAboveCursor
      placeholder="Add a comment"
      onChange={(e, _newValue, _newPlainTextValue, mentions) => {
        setComment(e.target.value);
        setMentions(mentions.map((mention) => mention.id));
      }}
      value={comment}
      autoFocus={isUpdating}
      {...(isUpdating && {
        onFocus: (e) => {
          const tempValue = e.target.value;
          e.target.value = '';
          e.target.value = tempValue;
        },
      })}
      onKeyPress={e => {
        const key = e.keyCode || e.which;
        if (!e.shiftKey && key === 13) { // Enter key code equivalent
          e.preventDefault();
          if (comment) {
            commentAction();
          }
        }
      }}
    >
      <Mention
        trigger="@"
        data={mentionableUsers}
        renderSuggestion={({ display }, _search, _highlightedDisplay, index) => (
          <List.Item.Meta
            className="align-items-center"
            avatar={<Avatar className="rounded-0" src={mentionableUsers[index].avatar || undefined} />}
            title={display}
            description={mentionableUsers[index].position}
          />
        )}
      />
    </StyledMentionInput>
  )
}

export default MentionBox;
