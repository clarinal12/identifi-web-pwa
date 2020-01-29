import React from 'react';
import styled from 'styled-components';
import { Popover, Typography, Badge, Avatar } from 'antd';

import { TCheckInGoal } from 'apollo/types/graphql-types';
import { MOOD_MAP } from 'utils/emojiUtils';
import { GoalCompletedIcon, IconBlocked } from 'utils/iconUtils';

const { Text } = Typography;

interface IRespondentAvatar {
  previousGoal: TCheckInGoal,
  mood: number,
  blocker: string,
  avatar: string | null,
  name: string | undefined,
  streak: number,
}

const StyledPopoverContentWrapper = styled.div`
  .ant-typography {
    align-items: center;
    .blocked {
      margin-right: 8px;
      line-height: 0 !important;
    }
    .goal-completed {
      margin-right: 4px;
      line-height: 0 !important;
    }
  }
`;

const StyledAvatarWrapper = styled.div`
  position: relative;
  .ant-badge {
    cursor: pointer;
    position: absolute;
    width: 64px;
    height: 64px;
    left: 0;
    .mood {
      font-size: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .blocked {
      background: #FFF;
      border-radius: 50%;
      line-height: 0;
      position: absolute;
      bottom: 0;
    }
    .goal-completed {
      position: absolute;
      top: 53px;
      right: 10px;
    }
    .streak {
      position: absolute;
      -webkit-transform-origin-x: unset;
      transform-origin: unset;
      transform: unset;
      left: 0;
      top: 2px;
    }
  }
`;

const StreakIcon = (streak: number) => {
  let streakType = undefined;
  if (streak >= 2 && streak <= 4) {
    streakType = <span className="streak fs-16" role="img" aria-label="like-streak">👍</span>;
  } else if (streak >= 5 && streak <= 14) {
    streakType = <span className="streak fs-16" role="img" aria-label="fire-streak">🔥</span>
  } else if (streak >= 15) {
    streakType = <span className="streak fs-16" role="img" aria-label="spark-streak">💥</span>
  }
  return streakType;
}

const RespondentAvatar: React.FC<IRespondentAvatar> = ({ previousGoal, mood, blocker, avatar, name, streak }) => {
  const hasHoverInfo = (typeof mood === 'number') || blocker || previousGoal;
  const AvatarWrapper: React.FC<any> = ({ children }) => {
    return hasHoverInfo ? (
      <Popover
        title={<Text strong className="fs-16">{name}</Text>}
        placement="bottom"
        content={(
          <StyledPopoverContentWrapper>
            {blocker && (
              <div>
                <Text className="fs-16 d-flex" type="secondary">
                  <IconBlocked /> Is blocked
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
            {(typeof mood === 'number') && (
              <div>
                <Text className="fs-16" type="secondary">
                  {MOOD_MAP[mood].emoji} {MOOD_MAP[mood].label}
                </Text>
              </div>
            )}
            {StreakIcon(streak) && (
              <div>
                <Text className="fs-16" type="secondary">
                  {StreakIcon(streak)} {streak} day streak
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
      <Avatar
        style={{ cursor: 'pointer' }}
        size={64}
        {...(avatar && { src : avatar })}
      />
      <Badge
        {...((previousGoal && previousGoal.completed) && { 
          count: <GoalCompletedIcon />,
        })}
      />
      <Badge
        {...((typeof mood === 'number') && {
          count: <span className="mood" role="img" aria-label="mood">{MOOD_MAP[mood].emoji}</span>,
        })}
      />
      <Badge
        {...(blocker && {
          count: <IconBlocked />,
        })}
      />
      <Badge
        {...(StreakIcon(streak) && {
          count: StreakIcon(streak),
        })}
      />
    </AvatarWrapper>
  );
}

export default RespondentAvatar;
