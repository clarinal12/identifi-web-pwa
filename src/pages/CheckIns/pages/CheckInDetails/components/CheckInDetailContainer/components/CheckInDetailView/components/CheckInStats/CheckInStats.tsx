import React from 'react';
import { Card, Typography, Icon } from 'antd';

const { Title, Text } = Typography;

const CheckInStats = () => {
  return (
    <Card className="mb-3" bodyStyle={{ display: 'flex' }}>
      <div>
        <Text>Checked-in</Text>
        <Title className="m-0">100%</Title>
        <Icon type="user" className="text-muted mr-2" /><Text>6/6</Text>
      </div>
      <div style={{ margin: '0 32px' }}>
        <Text>Completed goals</Text>
        <Title className="m-0" style={{ color: '#08979C' }}>83%</Title>
        <Icon type="user" className="text-muted mr-2" /><Text>5/6</Text>
      </div>
      <div>
        <Text>Blocked</Text>
        <Title className="m-0" type="danger">16%</Title>
        <Icon type="user" className="text-muted mr-2" /><Text>1/6</Text>
      </div>
    </Card>
  );
};

export default CheckInStats;
