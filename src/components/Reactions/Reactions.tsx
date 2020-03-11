import React, { useState } from 'react';
import { emojify } from 'node-emoji';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Button, Menu, Dropdown, Icon } from 'antd';

import ReactionButton from './components/ReactionButton';
import { SmileyIcon } from 'utils/iconUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { ADD_CHECKIN_RESPONSE_REACTION, REMOVE_CHECKIN_RESPONSE_REACTION } from 'apollo/mutations/reactions';
import { CHECKIN, CHECKIN_SCHEDULE } from 'apollo/queries/checkin';
import { CHECKIN_RESPONSE_REACTORS, EMOJIS } from 'apollo/queries/reactions';
import { TReaction, TEmoji } from 'apollo/types/graphql-types';
// import addCheckInResponseReactionCacheHandler from './cache-handler/addCheckInResponseReaction';

interface IReactions extends RouteComponentProps<{ checkin_id: string, past_checkin_id: string }> {
  responseId: string,
  reactions: TReaction[],
}

interface IReactionsMenu {
  addCheckInResponseReactionAction: (emoji: number) => void,
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
    &.loading-item {
      background: transparent;
    }
  }
`;

const ReactionsMenu: React.FC<IReactionsMenu> = ({ addCheckInResponseReactionAction, removeCheckInReaction, reactedEmojis }) => {
  const { data, loading } = useQuery<{ emojis: TEmoji[] }>(EMOJIS);
  return (
    <StyledMenu className="d-flex p-1">
      {(loading || !data) ? (
        <Menu.Item className="loading-item">
          <Icon type="loading" spin />
        </Menu.Item>
      ) : (
        data.emojis.map(({ id, web, description }, idx) => (
          <Menu.Item
            className="text-center"
            key={id}
            title={description}
            onClick={({ domEvent, key }) => {
              domEvent.stopPropagation();
              reactedEmojis.includes(+key) ?
                removeCheckInReaction(+key) :
                addCheckInResponseReactionAction(+key);
            }}
          >
            {emojify(web)}
          </Menu.Item>
        ))
      )}      
    </StyledMenu>
  );
};

const Reactions: React.FC<IReactions> = ({ responseId, reactions, match }) => {
  const { alertError } = useMessageContextValue();
  const [loadingState, setLoadingState] = useState(false);
  const [addCheckInResponseReactionMutation] = useMutation(ADD_CHECKIN_RESPONSE_REACTION);
  const [removeCheckInResponseReactionMutation] = useMutation(REMOVE_CHECKIN_RESPONSE_REACTION);

  const refetchQueries = (emojiId: number) => {
    return [{
      query: match.params.past_checkin_id ? CHECKIN : CHECKIN_SCHEDULE,
      variables: {
        id: match.params.past_checkin_id || match.params.checkin_id,
      },
    }, {
      query: CHECKIN_RESPONSE_REACTORS,
      variables: {
        filter: { responseId, emojiId },
      }
    }];
  }

  const addCheckInResponseReactionAction = async (emojiId: number) => {
    setLoadingState(true);
    try {
      await addCheckInResponseReactionMutation({
        variables: {
          input: { responseId, emojiId }
        },
        // ...addCheckInResponseReactionCacheHandler({
        //   isPastCheckIn: !!match.params.past_checkin_id,
        //   checkInId: match.params.past_checkin_id || match.params.checkin_id,
        //   responseId: responseId,
        //   emojiId,
        // }),
        refetchQueries: refetchQueries(emojiId),
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

  const removeCheckInReaction = async (emojiId: number) => {
    setLoadingState(true);
    try {
      await removeCheckInResponseReactionMutation({
        variables: { responseId, emojiId },
        refetchQueries: refetchQueries(emojiId),
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
            addCheckInReaction={addCheckInResponseReactionAction}
            removeCheckInReaction={removeCheckInReaction}
          />
        ))}
      </StyledDiv>
      <Dropdown
        disabled={loadingState}
        overlay={ReactionsMenu({
          addCheckInResponseReactionAction,
          removeCheckInReaction,
          reactedEmojis: reactions
            .filter(({ hasReacted }) => hasReacted)
            .map(({ emoji }) => emoji.id),
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
