import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Typography, Icon } from 'antd';

import Comments from 'components/Comments';
import RespondentAvatar from './components/RespondentAvatar';
import { TResponse } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';
import { getMultipleLines } from 'utils/textUtils';

const { Text, Title } = Typography;

interface IRespondentCard {
  response: TResponse,
}

const StyledCard = styled(Card)`
  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
  .ant-card-head {
    border-bottom: none;
    padding: 24px 24px 0 24px;
    margin-bottom: 16px;
    .ant-card-head-wrapper {
      .ant-card-head-title {
        padding: 0;
      }
    }
  }
  .ant-card-body {
    padding: 0;
    .respondent-details {
      padding: 24px 24px 0;
      border-bottom: 1px solid #E1E4E9;
      [class~='div-wrapper'] {
        border-bottom: 1px solid #E1E4E9;
        margin-bottom: 16px;
        padding-bottom: 16px;
        &:last-of-type {
          border: none;
          margin-bottom: 0 !important;  
        }
      }
    }
  }
`;

const RespondentCard: React.FC<IRespondentCard> = ({ response }) => {
  const {
    id, submitDate, respondent, answers, currentGoal, previousGoal, mood, block, numberOfComments, reactions, streak,
  } = response;
  const { firstname, lastname, email, role, avatar, memberId } = respondent;
  const deriviedName = (firstname && lastname) ? `${firstname} ${lastname}` : email;
  return (
    <StyledCard
      id={id}
      title={(
        <div className="d-flex">
          <div className="mr-3">
            <RespondentAvatar
              avatar={avatar}
              mood={mood}
              block={block}
              previousGoal={previousGoal}
              streak={streak}
              name={getDisplayName(respondent)}
            />
          </div>
          <div>
            <Link to={`/profile/${memberId}`}>
              <Title className="mb-0" level={4}>{deriviedName}</Title>
            </Link>
            {role && (
              <Text className="text-muted" style={{ fontSize: 12 }}>{role}</Text>
            )}
          </div>
        </div>
      )}
      extra={(
        <Text className="d-none d-sm-block" type="secondary">
          {moment(submitDate).format('MMM DD, hh:mm a')}
        </Text>
      )}
    >
      <div className="respondent-details">
        {currentGoal && (
          <div className="div-wrapper mb-3">
            <Text strong>TODAY:</Text>
            {getMultipleLines(currentGoal.goal).map((line, idx) => (
              <Title key={idx} className="mt-2 mb-0 fs-16" style={{ fontWeight: 'normal' }}>
                {line}
              </Title>
            ))}
          </div>
        )}
        {previousGoal && (
          <div className="div-wrapper">
            <Text strong className="text-muted">
              {function() {
                const timeAgo = moment(previousGoal.createdAt).calendar().toUpperCase().split(' AT');
                const dateString = timeAgo.includes('YESTERDAY') ? 'YESTERDAY:' : `${timeAgo[0]}:`;
                const iconIndicator = previousGoal.completed ? (
                  <Icon className="text-success fs-16 mr-1" type="check-circle" theme="filled" />
                ) : <Icon className="text-warning fs-16 mr-1" type="exclamation-circle" theme="filled" />;
                return <>
                  {iconIndicator} {dateString}
                </>;
              }()}
            </Text>
            {getMultipleLines(previousGoal.goal).map((line, idx) => (
              <Title key={idx} className="mt-2 mb-0 fs-16" style={{ fontWeight: 'normal' }}>
                {line}
              </Title>
            ))}
          </div>
        )}
        {block && (
          <div className="div-wrapper">
            <Text strong className="text-danger">
              <Icon className="mr-1" type="stop" style={{ transform: 'rotate(90deg)' }} /> BLOCKED:
            </Text>
            {getMultipleLines(block.blocker).map((line, idx) => (
              <Title key={idx} className="mt-2 mb-0 fs-16" style={{ fontWeight: 'normal' }}>
                {line}
              </Title>
            ))}
          </div>
        )}
        {answers.length > 0 && (
          <div className="my-3">
            <Text type="secondary" strong>ADDITIONAL QUESTIONS:</Text>
          </div>
        )}
        {answers.map(({ question, answer }, idx) => (
          <div key={idx} className="div-wrapper">
            <Text type="secondary">{question}</Text>
            {getMultipleLines(answer).map((line, idx) => (
              <Title key={idx} className="mt-2 mb-0 fs-16" style={{ fontWeight: 'normal' }}>
                {line}
              </Title>
            ))}
          </div>
        ))}
      </div>
      <Comments
        responseId={id}
        numberOfComments={numberOfComments}
        reactions={reactions}
      />
    </StyledCard>
  );
};

export default RespondentCard;
