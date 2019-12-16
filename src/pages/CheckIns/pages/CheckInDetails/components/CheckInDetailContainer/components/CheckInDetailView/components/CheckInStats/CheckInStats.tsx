import React from 'react';
import styled from 'styled-components';
import { Card, Typography, Icon } from 'antd';

import { TCheckInStats } from 'apollo/types/graphql-types';

const { Title, Text } = Typography;

interface ICheckInStats {
  goals: TCheckInStats,
  blockers: TCheckInStats,
  checkins: TCheckInStats,
  respondentCount: number,
}

const StyledCard = styled(Card)`
  .stat-wrapper:not(:last-of-type) {
    margin-right: 32px;
  }
`;

const CheckInStats: React.FC<ICheckInStats> = ({ goals, blockers, checkins, respondentCount }) => {
  return (
    <StyledCard className="mb-3" bodyStyle={{ display: 'flex' }}>
      {checkins && (
        <div className="stat-wrapper">
          <Text>Checked-in</Text>
          <Title className="m-0">{checkins.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{checkins.count}/{respondentCount}</Text>
        </div>
      )}
      {goals && (
        <div className="stat-wrapper">
          <Text>Completed goals</Text>
          <Title className="m-0" style={{ color: '#08979C' }}>{goals.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{goals.count}/{respondentCount}</Text>
        </div>
      )}
      {blockers && (
        <div className="stat-wrapper">
          <Text>Blocked</Text>
          <Title className="m-0" type="danger">{blockers.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{blockers.count}/{respondentCount}</Text>
        </div>
      )}
    </StyledCard>
  );
};

export default CheckInStats;
