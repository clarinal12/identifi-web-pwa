import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Tooltip, Button, Typography } from 'antd';

import { REACTION_MAP } from 'utils/emojiUtils';
import { getDisplayName } from 'utils/userUtils';
import { CHECKIN_RESPONSE_REACTORS } from 'apollo/queries/reactions';
import { TReaction, IAccount } from 'apollo/types/graphql-types';

const { Text } = Typography;

interface IReactionButton {
  loadingState: boolean,
  reaction: TReaction,
  responseId: string,
  addCheckInReaction: (emoji: number) => void,
  removeCheckInReaction: (emoji: number) => void,
}

const ReactionButton: React.FC<IReactionButton> = ({
  loadingState, addCheckInReaction, removeCheckInReaction, reaction, responseId,
}) => {
  const [tooltipVisibility, setTooltipVisibility] = useState(false);
  const { emoji, hasReacted, count } = reaction;

  const { data, loading } = useQuery(CHECKIN_RESPONSE_REACTORS, {
    variables: {
      filter: { responseId, emoji },
    },
    skip: !tooltipVisibility,
  });

  const reactorSource = (data && !loading) ?
    [REACTION_MAP[emoji].label]
      .concat(
        data.checkInResponseReactors
          .map((member: IAccount | undefined) => getDisplayName(member))
      ) :
    [REACTION_MAP[emoji].label];
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
      <Button
        disabled={loadingState}
        size="small"
        className="mr-1"
        onClick={() => {
          hasReacted ? removeCheckInReaction(emoji) : addCheckInReaction(emoji);
        }}
      >
        {REACTION_MAP[emoji].emoji} {count}
      </Button>
    </Tooltip>
  );
};

export default ReactionButton;
