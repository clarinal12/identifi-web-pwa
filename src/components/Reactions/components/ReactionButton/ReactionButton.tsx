import React, { useState } from 'react';
import { emojify } from 'node-emoji';
import styled from 'styled-components';
import cx from 'classnames';
import { useQuery } from 'react-apollo';
import { Tooltip, Button, Typography } from 'antd';

import { getDisplayName } from 'utils/userUtils';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
import { IAccount } from 'apollo/types/user';
import { TReaction, TEmoji } from 'apollo/types/checkin';

const { Text } = Typography;

interface IReactionButton {
  reaction: TReaction,
  responseId: string,
  addCheckInReaction: (emoji: TEmoji) => void,
  removeCheckInReaction: (emoji: TEmoji) => void,
}

const StyledButton = styled(Button)`
  &.has-reacted {
    background: rgba(35, 168, 168, 0.25) !important;
    border: 1px solid rgb(35, 168, 168) !important;
    color: #23A8A8 !important;
  }
`;

const ReactionButton: React.FC<IReactionButton> = ({
  addCheckInReaction, removeCheckInReaction, reaction, responseId,
}) => {
  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const { emoji, hasReacted, count } = reaction;

  const { data, loading } = useQuery(CHECKIN_RESPONSE_REACTORS, {
    variables: {
      filter: { responseId, emojiId: emoji.id },
    },
    skip: !tooltipVisibility,
  });

  const reactorSource = (data && !loading) ?
    [emoji.description]
      .concat(
        data.checkInResponseReactors
          .map((member: IAccount | undefined) => getDisplayName(member))
      ) :
    [emoji.description];
  if (loading) reactorSource.push('Loading...');

  return (
    <Tooltip
      placement="bottomLeft"
      title={<>
        {reactorSource.map((reactor, idx) => (
          <Text
            style={{ color: '#FFF' }}
            className="d-block" key={idx}
            strong={idx === 0}
          >
            {reactor}
          </Text>
        ))}
      </>}
      onVisibleChange={visibility => setTooltipVisibility(visibility)}
    >
      <StyledButton
        size="small"
        className={cx({
          'mr-1': true,
          'has-reacted': hasReacted,
        })}
        onClick={() => {
          hasReacted ? removeCheckInReaction(emoji) : addCheckInReaction(emoji);
        }}
      >
        {emojify(emoji.web)} {count}
      </StyledButton>
    </Tooltip>
  );
};

export default ReactionButton;
