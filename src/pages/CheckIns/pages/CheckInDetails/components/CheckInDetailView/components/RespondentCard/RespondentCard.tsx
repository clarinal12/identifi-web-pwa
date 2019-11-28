import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Typography, Avatar, Badge, Icon } from 'antd';

import { TResponse } from 'apollo/types/graphql-types';

const { Text, Title } = Typography;

interface IRespondentCard {
  response: TResponse,
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
          .anticon {
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
    .current-goal, .qa-wrapper:not(:last-of-type) {
      border-bottom: 1px solid #E1E4E9;
      margin-bottom: 16px;
      padding-bottom: 16px;
    }
  }
`;

const RespondentCard: React.FC<IRespondentCard> = ({ response }) => {
  const { submitDate, respondent, answers, currentGoal, previousGoal } = response;
  const { firstname, lastname, email, role, avatar } = respondent;
  const deriviedName = (firstname && lastname) ? `${firstname} ${lastname}` : email;
  return (
    <StyledCard
      title={(
        <div className="d-flex">
          <div className="mr-3">
            <Badge
              {...((previousGoal && previousGoal.completed) && {
                count: <Icon type="check-circle" />,
              })}
            >
              <Avatar
                size={56}
                {...(avatar && { src : avatar })}
              />
            </Badge>
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
      <div className="current-goal mb-3">
        <Text type="secondary" strong>TODAY:</Text>
        <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>
          {currentGoal.goal}
        </Title>
      </div>
      {previousGoal && (
        <div className="current-goal mb-3">
          <Text type="secondary" strong>
            {function() {
              const timeAgo = moment(previousGoal.createdAt).calendar().toUpperCase();
              return timeAgo.includes('YESTERDAY') ? 'YESTERDAY:' : `timeAgo:`;
            }()}
          </Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>
            {previousGoal.goal}
          </Title>
        </div>
      )}
      <div className="mb-3">
        <Text type="secondary" strong>ADDITIONAL QUESTIONS:</Text>
      </div>
      {answers.map(({ question, answer }, idx) => (
        <div className="qa-wrapper" key={idx}>
          <Text type="secondary" strong>{question}</Text>
          <Title className="mt-2 mb-0" style={{ fontSize: 16, fontWeight: 'normal' }}>{answer}</Title>
        </div>
      ))}
    </StyledCard>
  );
};

export default RespondentCard;
