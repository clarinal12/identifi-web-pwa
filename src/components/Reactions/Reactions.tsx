import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Button, Menu, Dropdown } from 'antd';

import ReactionButton from './components/ReactionButton';
import { REACTION_MAP } from 'utils/emojiUtils';
import { SmileyIcon } from 'utils/iconUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { ADD_CHECKIN_RESPONSE_REACTION, REMOVE_CHECKIN_RESPONSE_REACTION } from 'apollo/mutations/reactions';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
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

const Reactions: React.FC<IReactions> = ({ responseId, reactions, match }) => {
  const { alertError } = useMessageContextValue();
  const [loadingState, setLoadingState] = useState(false);
  const [addCheckInResponseReaction] = useMutation(ADD_CHECKIN_RESPONSE_REACTION);
  const [removeCheckInResponseReaction] = useMutation(REMOVE_CHECKIN_RESPONSE_REACTION);

  const refetchQueries = (emoji: number) => {
    return [{
      query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
      variables: {
        id: match.params.past_checkin_id || match.params.checkin_id,
      },
    }, {
      query: CHECKIN_RESPONSE_REACTORS,
      variables: {
        filter: { responseId, emoji },
      }
    }];
  }

  const addCheckInReaction = async (emoji: number) => {
    setLoadingState(true);
    try {
      await addCheckInResponseReaction({
        variables: {
          input: { responseId, emoji }
        },
        refetchQueries: refetchQueries(emoji),
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
        refetchQueries: refetchQueries(emoji),
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
    <div className="d-flex" onClick={e => e.stopPropagation()}>
      <StyledDiv className="d-flex">
        {reactions.map((reaction, idx) => (
          <ReactionButton
            responseId={responseId}
            reaction={reaction}
            loadingState={loadingState}
            key={idx}
            addCheckInReaction={addCheckInReaction}
            removeCheckInReaction={removeCheckInReaction}
          />
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
        >
          <SmileyIcon />
        </StyledButton>
      </Dropdown>
    </div>
  );
}

export default withRouter(Reactions);
