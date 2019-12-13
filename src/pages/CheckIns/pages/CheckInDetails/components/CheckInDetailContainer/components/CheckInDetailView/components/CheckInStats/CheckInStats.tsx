import React from 'react';
import { Card, Typography, Icon } from 'antd';

const { Title, Text } = Typography;
import { TCheckInStats } from 'apollo/types/graphql-types';

interface ICheckInStats {
  goals: TCheckInStats,
  blockers: TCheckInStats,
  checkins: TCheckInStats,
}

const CheckInStats: React.FC<ICheckInStats> = ({ goals, blockers, checkins }) => {
  return (
    <Card className="mb-3" bodyStyle={{ display: 'flex' }}>
      {checkins && (
        <div>
          <Text>Checked-in</Text>
          <Title className="m-0">{checkins.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{checkins.count}/6</Text>
        </div>
      )}
      {goals && (
        <div style={{ margin: '0 32px' }}>
          <Text>Completed goals</Text>
          <Title className="m-0" style={{ color: '#08979C' }}>{goals.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{goals.count}/6</Text>
        </div>
      )}
      {blockers && (
        <div>
          <Text>Blocked</Text>
          <Title className="m-0" type="danger">{blockers.percentage}%</Title>
          <Icon type="user" className="text-muted mr-2" /><Text>{blockers.count}/6</Text>
        </div>
      )}
    </Card>
  );
};

export default CheckInStats;
