import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Button, Menu, Dropdown } from 'antd';

import { REACTION_MAP } from 'utils/emojiUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { ADD_CHECKIN_RESPONSE_REACTION, REMOVE_CHECKIN_RESPONSE_REACTION } from 'apollo/mutations/reactions';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { TReaction } from 'apollo/types/graphql-types';

interface IReactions extends RouteComponentProps<{ checkin_id: string, past_checkin_id: string }> {
  responseId: string,
  reactions: TReaction[],
}

interface IReactionsMenu {
  addCheckInReaction: (emoji: number) => void,
  removeCheckInReaction: (emoji: number) => void,
  reactedEmojis: number[],
}

const StyledDiv = styled.div``;

const StyledButton = styled(Button)`
  align-items: center;
  padding: 0 8px !important;
  .anticon-plus {
    margin-right: 4px;
    color: #BFBFBF;
    font-size: 10px;
  }
  &.ant-dropdown-open, &:hover {
    .anticon-plus {
      color: #23A8A8;
    }
    svg > path {
      fill: #23A8A8;
    }
  }
`;

const StyledMenu = styled(Menu)`
  flex-wrap: wrap;
  .ant-dropdown-menu-item {
    flex-basis: 25%;
    width: 24px;
    border-radius: 4px;
  }
`;

const ReactionsMenu: React.FC<IReactionsMenu> = ({ addCheckInReaction, removeCheckInReaction, reactedEmojis }) => (
  <StyledMenu className="d-flex p-1">
    {REACTION_MAP.map(({ emoji, label }, idx) => (
      <Menu.Item
        className="text-center"
        key={idx}
        title={label}
        onClick={({ domEvent, key }) => {
          domEvent.stopPropagation();
          reactedEmojis.includes(+key) ?
            removeCheckInReaction(+key) :
            addCheckInReaction(+key);
        }}
      >
        {emoji}
      </Menu.Item>
    ))}
  </StyledMenu>
);

const SmileyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.492 1.58325C5.122 1.58325 1.58325 5.12992 1.58325 9.49992C1.58325 13.8699 5.122 17.4166 9.492 17.4166C13.8699 17.4166 17.4166 13.8699 17.4166 9.49992C17.4166 5.12992 13.8699 1.58325 9.492 1.58325ZM9.49992 15.8333C6.00075 15.8333 3.16659 12.9991 3.16659 9.49992C3.16659 6.00075 6.00075 3.16659 9.49992 3.16659C12.9991 3.16659 15.8333 6.00075 15.8333 9.49992C15.8333 12.9991 12.9991 15.8333 9.49992 15.8333ZM13.4583 7.52075C13.4583 8.17784 12.9278 8.70825 12.2708 8.70825C11.6137 8.70825 11.0833 8.17784 11.0833 7.52075C11.0833 6.86367 11.6137 6.33325 12.2708 6.33325C12.9278 6.33325 13.4583 6.86367 13.4583 7.52075ZM6.72908 8.70825C7.38617 8.70825 7.91658 8.17784 7.91658 7.52075C7.91658 6.86367 7.38617 6.33325 6.72908 6.33325C6.072 6.33325 5.54158 6.86367 5.54158 7.52075C5.54158 8.17784 6.072 8.70825 6.72908 8.70825ZM13.2603 11.677C12.5083 12.9753 11.107 13.8541 9.49992 13.8541C7.89284 13.8541 6.49159 12.9753 5.7395 11.677C5.58909 11.4158 5.787 11.0833 6.08784 11.0833H12.912C13.2208 11.0833 13.4108 11.4158 13.2603 11.677Z"
      fill="#BFBFBF"
    />
  </svg>
);

const Reactions: React.FC<IReactions> = ({ responseId, reactions, match }) => {
  const { alertError } = useMessageContextValue();
  const [loadingState, setLoadingState] = useState(false);
  const [addCheckInResponseReaction] = useMutation(ADD_CHECKIN_RESPONSE_REACTION);
  const [removeCheckInResponseReaction] = useMutation(REMOVE_CHECKIN_RESPONSE_REACTION);

  const addCheckInReaction = async (emoji: number) => {
    setLoadingState(true);
    try {
      await addCheckInResponseReaction({
        variables: {
          input: { responseId, emoji }
        },
        refetchQueries: [{
          query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.past_checkin_id || match.params.checkin_id,
          },
        }],
        awaitRefetchQueries: true,
      });
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  const removeCheckInReaction = async (emoji: number) => {
    setLoadingState(true);
    try {
      await removeCheckInResponseReaction({
        variables: { responseId, emoji },
        refetchQueries: [{
          query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
          variables: {
            id: match.params.past_checkin_id || match.params.checkin_id,
          },
        }],
        awaitRefetchQueries: true,
      });
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  return (
    <div className="d-flex">
      <StyledDiv className="d-flex">
        {reactions.map(({ emoji, count, hasReacted }, idx) => (
          <Button
            key={idx}
            size="small"
            className="mr-1"
            onClick={e => {
              e.stopPropagation();
              if (loadingState) return;
              hasReacted ? removeCheckInReaction(emoji) : addCheckInReaction(emoji);
            }}
          >
            {REACTION_MAP[emoji].emoji} {count}
          </Button>
        ))}
      </StyledDiv>
      <Dropdown
        disabled={loadingState}
        overlay={ReactionsMenu({
          addCheckInReaction,
          removeCheckInReaction,
          reactedEmojis: reactions
            .filter(({ hasReacted }) => hasReacted)
            .map(({ emoji }) => emoji),
        })}
        trigger={['click']}
        placement="bottomRight"
      >
        <StyledButton
          size="small"
          icon="plus"
          className="d-flex"
          onClick={e => e.stopPropagation()}
        >
          <SmileyIcon />
        </StyledButton>
      </Dropdown>
    </div>
  );
}

export default withRouter(Reactions);
