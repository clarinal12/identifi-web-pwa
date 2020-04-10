import React from 'react';
import styled from 'styled-components';
import { List, Avatar } from 'antd';
import { MentionsInput, Mention } from 'react-mentions';

import { useMentionSourceContextValue } from 'contexts/MentionSourceContext';
import { getDisplayName } from 'utils/userUtils';
import { IAccount } from 'apollo/types/user';

declare module "react-mentions" {
  export interface SuggestionDataItem {
    avatar: any,
    position: any,
  }
}

const StyledMentionInput = styled(MentionsInput)`
  div[class$="__highlighter"], textarea {
    padding: 8px 12px;
    line-height: 20px;
  }
  div[class$="__highlighter"] {
    background-color: #f2f3f5 !important;
    border-radius: 16px;
    word-break: break-word;
    border: 0;
    strong {
      background: #E6FFFB;
      border-radius: 2px;
    }
  }
  textarea {
    border-radius: 16px;
    border: 1px solid #ccd0d5;
    color: #262626;
    &::placeholder {
      color: #8d949e;
    }
    &:focus {
      &::placeholder {
        color: #d9d9d9;
      }
    }
  }
`;

interface IMentionBox {
  id: string,
  comment: string,
  isUpdating: boolean,
  setComment: (comment: string) => void,
  setMentions: (mentions: IAccount[]) => void,
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
      placeholder="Write a comment..."
      onChange={(e, _newValue, _newPlainTextValue, mentions) => {
        const newSetOfMentions: IAccount[] = [];
        mentions.forEach((mention) => {
          const user = mentionSource.find((source) => source.id === mention.id);
          if (user) newSetOfMentions.push(user);
        })
        setComment(e.target.value);
        setMentions(newSetOfMentions);
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
        renderSuggestion={({ display, avatar, position }, _search, _highlightedDisplay) => (
          <List.Item.Meta
            className="align-items-center"
            avatar={<Avatar className="rounded-0" src={avatar || undefined} />}
            title={display}
            description={position}
          />
        )}
      />
    </StyledMentionInput>
  )
}

export default MentionBox;
