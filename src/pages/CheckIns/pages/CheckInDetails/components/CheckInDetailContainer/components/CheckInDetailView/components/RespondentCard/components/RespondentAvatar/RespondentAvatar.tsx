import React from 'react';
import styled from 'styled-components';
import { Popover, Typography, Badge, Avatar } from 'antd';

import { TCheckInGoal } from 'apollo/types/graphql-types';
import { MOOD_MAP } from 'utils/emojiUtils';
import { GoalCompletedIcon } from 'utils/iconUtils';

const { Text } = Typography;

interface IRespondentAvatar {
  previousGoal: TCheckInGoal,
  mood: number,
  blocker: string,
  avatar: string | null,
  name: string | undefined,
}

const StyledPopoverContentWrapper = styled.div`
  .goal-completed {
    margin-right: 4px;
  }
`;

const StyledAvatarWrapper = styled.div`
  .ant-badge {
    cursor: pointer;
    position: relative;
    .blocked {
      top: 54px;
      right: 54px;
      font-size: 16px;
    }
    .mood {
      background: transparent;
      top: 10px;
      right: 10px;
      border: none;
      font-size: 16px;
      box-shadow: none;
    }
    .goal-completed {
      margin-top: 54px;
      margin-right: 10px;
    }
  }
`;

const RespondentAvatar: React.FC<IRespondentAvatar> = ({ previousGoal, mood, blocker, avatar, name }) => {
  const hasHoverInfo = mood || blocker || previousGoal;

  const AvatarWrapper: React.FC<any> = ({ children }) => {
    return hasHoverInfo ? (
      <Popover
        title={<Text strong className="fs-16">{name}</Text>}
        placement="bottom"
        content={(
          <StyledPopoverContentWrapper>
            {blocker && (
              <div>
                <Text className="fs-16" type="secondary">
                  <span role="img" aria-label="blocked">🚫</span>  Is blocked
                </Text>
              </div>
            )}
            {(previousGoal && previousGoal.completed) && (
              <div>
                <Text className="d-flex fs-16" type="secondary">
                  <GoalCompletedIcon /> Goals met for this check-in
                </Text>
              </div>
            )}
            {typeof mood === 'number' && (
              <div>
                <Text className="fs-16" type="secondary">
                  {MOOD_MAP[mood].emoji} {MOOD_MAP[mood].label}
                </Text>
              </div>
            )}
          </StyledPopoverContentWrapper>
        )}
      >
        <StyledAvatarWrapper>
          {children}
        </StyledAvatarWrapper>
      </Popover>
    ) : (
      <StyledAvatarWrapper>
        {children}
      </StyledAvatarWrapper>
    )
  };
  
  return (
    <AvatarWrapper>
      <Badge
        {...((previousGoal && previousGoal.completed) && { 
          count: <GoalCompletedIcon />,
        })}
      >
        <Badge
          {...((typeof mood === 'number') && {
            count: <span className="mood" role="img" aria-label="mood">{MOOD_MAP[mood].emoji}</span>,
          })}
        >
          <Badge
            {...(blocker && {
              count: <span className="blocked" role="img" aria-label="blocked">🚫</span>,
            })}
          >
            <Avatar
              style={{ cursor: 'pointer' }}
              size={64}
              {...(avatar && { src : avatar })}
            />
          </Badge>
        </Badge>
      </Badge>
    </AvatarWrapper>
  );
}

export default RespondentAvatar;
