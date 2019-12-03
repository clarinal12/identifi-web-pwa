import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import styled from 'styled-components';
import { Card, Typography, Avatar, Badge, Icon, Tooltip } from 'antd';

import { TResponse, TCheckInGoal } from 'apollo/types/graphql-types';

const { Text, Title } = Typography;

const MOOD_MAP = [{
  emoji: '😃',
  moodLabel: 'Cheerful',
}, {
  emoji: '🙂',
  moodLabel: 'Happy',
}, {
  emoji: '🤗',
  moodLabel: 'Excited',
}, {
  emoji: '😠',
  moodLabel: 'Angry',
}, {
  emoji: '🤔',
  moodLabel: 'Thoughtful',
}, {
  emoji: '😐',
  moodLabel: 'Unimpressed',
}, {
  emoji: '😕',
  moodLabel: 'Confused',
}, {
  emoji: '😴',
  moodLabel: 'Tired',
}, {
  emoji: '🤒',
  moodLabel: 'Sick',
}];

interface IRespondentCard {
  response: TResponse,
}

interface IRespondentAvatar {
  previousGoal: TCheckInGoal,
  mood: number,
  blocker: string,
  avatar: string | null,
}

const StyledCard = styled(Card)`
  &:not(:last-of-type) {
    margin-bottom: 24px;
  }
  .ant-card-head {
    border-bottom: none;
    padding: 24px 24px 0 24px;
    margin-bottom: 16px;
    .ant-card-head-wrapper {
      .ant-card-head-title {
        padding: 0;
        .ant-badge {
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
            font-size: 20px;
            top: auto;
            bottom: -10px;
            right: 10px;
            color: #FFF;
            background: #52C41A;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .ant-card-body {
    .div-wrapper:not(:last-of-type) {
      border-bottom: 1px solid #E1E4E9;
      margin-bottom: 16px;
      padding-bottom: 16px;
    }
  }
`;

const RespondentAvatar: React.FC<IRespondentAvatar> = ({ previousGoal, mood, blocker, avatar }) => (
  <Badge
    {...((previousGoal && previousGoal.completed) && {
      count: <Icon className="goal-completed" type="check-circle" />,
    })}
  >
    <Badge
      {...((typeof mood === 'number') && {
        count: <Tooltip title={MOOD_MAP[mood].moodLabel} className="mood">
          {MOOD_MAP[mood].emoji}
        </Tooltip>,
      })}
    >
      <Badge
        {...(blocker && {
          count: <span className="blocked" role="img" aria-label="blocked">🚫</span>,
        })}
      >
        <Avatar
          size={64}
          {...(avatar && { src : avatar })}
        />
      </Badge>
    </Badge>
  </Badge>
);

const RespondentCard: React.FC<IRespondentCard> = ({ response }) => {
  const { submitDate, respondent, answers, currentGoal, previousGoal, mood, blocker } = response;
  const { firstname, lastname, email, role, avatar } = respondent;
  const deriviedName = (firstname && lastname) ? `${firstname} ${lastname}` : email;
  return (
    <StyledCard
      title={(
        <div className="d-flex">
          <div className="mr-3">
            <RespondentAvatar
              avatar={avatar}
              mood={mood}
              blocker={blocker}
              previousGoal={previousGoal}
            />
          </div>
          <div>
            <Title className="mb-0" level={4}>{deriviedName}</Title>
            {role && (
              <Text className="text-muted" style={{ fontSize: 12 }}>{role}</Text>
            )}
          </div>
        </div>
      )}
      extra={(
        <Text className="d-none d-sm-block" type="secondary">
          {moment(submitDate).format('MMM DD, hh:mm A').toUpperCase()}
        </Text>
      )}
    >
      {currentGoal && (
        <div className="div-wrapper mb-3">
          <Text strong>TODAY:</Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>
            {currentGoal.goal}
          </Title>
        </div>
      )}
      {previousGoal && (
        <div className="div-wrapper">
          <Text 
            strong
            className={cx({
              'text-success': previousGoal.completed,
              'text-danger': !previousGoal.completed,
            })}
          >
            {function() {
              const timeAgo = moment(previousGoal.createdAt).calendar().toUpperCase();
              return timeAgo.includes('YESTERDAY') ? 'YESTERDAY:' : `${timeAgo}:`;
            }()}
          </Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>
            {previousGoal.goal}
          </Title>
        </div>
      )}
      {blocker && (
        <div className="div-wrapper">
          <Text strong className="text-danger">BLOCKED:</Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>
            {blocker}
          </Title>
        </div>
      )}
      {answers.length > 0 && (
        <div className="my-3">
          <Text type="secondary" strong>ADDITIONAL QUESTIONS:</Text>
        </div>
      )}
      {answers.map(({ question, answer }, idx) => (
        <div className="div-wrapper" key={idx}>
          <Text type="secondary">{question}</Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>{answer}</Title>
        </div>
      ))}
    </StyledCard>
  );
};

export default RespondentCard;
