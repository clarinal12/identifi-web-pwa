import React from 'react';
import { emojify } from 'node-emoji';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Button, Menu, Dropdown, Icon } from 'antd';

import ReactionButton from './components/ReactionButton';
import { SmileyIcon } from 'utils/iconUtils';
import { useMessageContextValue } from 'contexts/MessageContext';
import { useUserContextValue } from 'contexts/UserContext';
import { useReactionContextValue } from 'contexts/ReactionContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';
import { useCheckInResponseFilterContextValue } from 'contexts/CheckInResponseFilterContext';
import { ADD_CHECKIN_RESPONSE_REACTION, REMOVE_CHECKIN_RESPONSE_REACTION } from 'apollo/mutations/reactions';
import { TReaction, TEmoji } from 'apollo/types/checkin';
import addCheckInResponseReactionCacheHandler from './cache-handler/addCheckInResponseReaction';
import removeCheckInResponseReaction from './cache-handler/removeCheckInResponseReaction';

interface IReactions extends RouteComponentProps<{ checkin_id: string, past_checkin_id: string }> {
  responseId: string,
  reactions: TReaction[],
}

interface IReactionsMenu {
  addCheckInResponseReactionAction: (emoji: TEmoji) => void,
  removeCheckInReaction: (emoji: TEmoji) => void,
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
  const { loading, emojis } = useReactionContextValue();
  return (
    <StyledMenu className="d-flex p-1">
      {(loading) ? (
        <Menu.Item className="loading-item">
          <Icon type="loading" spin />
        </Menu.Item>
      ) : (
        emojis.map((emoji) => (
          <Menu.Item
            className="text-center"
            key={emoji.id}
            title={emoji.description}
            onClick={({ domEvent, key }) => {
              domEvent.stopPropagation();
              reactedEmojis.includes(+key) ?
                removeCheckInReaction(emoji) :
                addCheckInResponseReactionAction(emoji)
            }}
          >
            {emojify(emoji.web)}
          </Menu.Item>
        ))
      )}      
    </StyledMenu>
  );
};

const Reactions: React.FC<IReactions> = ({ responseId, reactions, match, location }) => {
  const { alertError } = useMessageContextValue();
  const { responseFilterState } = useCheckInResponseFilterContextValue();
  const { account } = useUserContextValue();
  const { selectedCheckInCard } = useCheckInScheduleContextValue();
  const derivedCheckInId = match.params.past_checkin_id || selectedCheckInCard?.currentCheckInInfo?.id;
  const [addCheckInResponseReactionMutation] = useMutation(ADD_CHECKIN_RESPONSE_REACTION);
  const [removeCheckInResponseReactionMutation] = useMutation(REMOVE_CHECKIN_RESPONSE_REACTION);

  const addCheckInResponseReactionAction = (emoji: TEmoji) => {
    try {
      addCheckInResponseReactionMutation({
        variables: {
          input: { responseId, emojiId: emoji.id }
        },
        ...addCheckInResponseReactionCacheHandler({
          checkInId: derivedCheckInId,
          responseId: responseId,
          values: {
            emoji,
            reactor: account,
          },
          filter: responseFilterState,
        }),
      });
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  const removeCheckInReaction = (emoji: TEmoji) => {
    try {
      removeCheckInResponseReactionMutation({
        variables: { responseId, emojiId: emoji.id },
        ...removeCheckInResponseReaction({
          scheduleId: selectedCheckInCard?.scheduleId,
          checkInId: derivedCheckInId,
          responseId: responseId,
          values: {
            emoji,
            reactor: account,
          },
          filter: responseFilterState,
        }),
      });
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  }

  return (
    <div className="d-flex" onClick={e => e.stopPropagation()}>
      <StyledDiv className="d-flex">
        {reactions.map((reaction, idx) => (
          <ReactionButton
            responseId={responseId}
            reaction={reaction}
            key={idx}
            addCheckInReaction={addCheckInResponseReactionAction}
            removeCheckInReaction={removeCheckInReaction}
          />
        ))}
      </StyledDiv>
      <Dropdown
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
