import React from 'react';
import styled from 'styled-components';
import { Popover, Typography, Badge, Avatar } from 'antd';

import { useUserContextValue } from 'contexts/UserContext';
import { TCheckInGoal } from 'apollo/types/graphql-types';
import { MOOD_MAP } from 'utils/moodUtils';
import { getDisplayName } from 'utils/userUtils';

const { Text } = Typography;

interface IRespondentAvatar {
  previousGoal: TCheckInGoal,
  mood: number,
  blocker: string,
  avatar: string | null,
}

const GoalCompletedIcon = () => (
  <span className="ant-scroll-number-custom-component goal-completed">
    <svg width="22" height="22" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="#52C41A" stroke="white" strokeWidth="2"/>
      <path
        d="M8.22237 12.1696L6.27792 10.2251C6.17523 10.1212 6.03517 10.0626 5.88904 10.0626C5.7429 10.0626 5.60284 10.1212 5.50015 10.2251C5.28348 10.4418 5.28348 10.7862 5.50015 11.0029L7.82792 13.3307C8.04459 13.5473 8.39459 13.5473 8.61126 13.3307L14.5001 7.44735C14.7168 7.23068 14.7168 6.88624 14.5001 6.66957C14.3974 6.5656 14.2574 6.50708 14.1113 6.50708C13.9651 6.50708 13.8251 6.5656 13.7224 6.66957L8.22237 12.1696Z"
        fill="white" stroke="white" strokeWidth="0.5"
      />
    </svg>
  </span>
);

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

const RespondentAvatar: React.FC<IRespondentAvatar> = ({ previousGoal, mood, blocker, avatar }) => {
  const { account } = useUserContextValue();
  const hasHoverInfo = mood || blocker || previousGoal;

  const AvatarWrapper: React.FC<any> = ({ children }) => {
    return hasHoverInfo ? (
      <Popover
        title={<Text strong style={{ fontSize: 16 }}>{getDisplayName(account)}</Text>}
        placement="bottom"
        content={(
          <StyledPopoverContentWrapper>
            {blocker && (
              <div>
                <Text style={{ fontSize: 16 }} type="secondary">
                  <span role="img" aria-label="blocked">🚫</span>  Is blocked
                </Text>
              </div>
            )}
            {(previousGoal && previousGoal.completed) && (
              <div>
                <Text className="d-flex" style={{ fontSize: 16 }} type="secondary">
                  <GoalCompletedIcon /> Goals met for this check-in
                </Text>
              </div>
            )}
            {typeof mood === 'number' && (
              <div>
                <Text style={{ fontSize: 16 }} type="secondary">
                  {MOOD_MAP[mood].emoji} {MOOD_MAP[mood].moodLabel}
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
