import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Typography, Avatar } from 'antd';

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
      }
    }
  }
  .ant-card-body {
    .qa-wrapper:not(:last-of-type) {
      border-bottom: 1px solid #E1E4E9;
      margin-bottom: 16px;
      padding-bottom: 16px;
    }
  }
`;

const RespondentCard: React.FC<IRespondentCard> = ({ response }) => {
  const { submitDate, respondent, answers } = response;
  const { firstname, lastname, email, role, avatar } = respondent;
  const deriviedName = (firstname && lastname) ? `${firstname} ${lastname}` : email;
  return (
    <StyledCard
      title={(
        <div className="d-flex">
          <div className="mr-3">
            <Avatar
              size={56}
              {...(avatar && { src : avatar })}
            />
          </div>
          <div>
            <Title className="mb-0" level={4}>{deriviedName}</Title>
            {role && (
              <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{role}</Text>
            )}
          </div>
        </div>
      )}
      extra={<Text className="d-none d-sm-block" strong>{moment(submitDate).format('MMM DD, hh:mm A')}</Text>}
    >
      {answers.map(({ question, answer }, idx) => (
        <div className="qa-wrapper" key={idx}>
          <Title type="secondary" style={{ fontSize: 14 }}>{question}</Title>
          <Title style={{ fontSize: 16 }}>{answer}</Title>
        </div>
      ))}
    </StyledCard>
  );
};

export default RespondentCard;
