import React from 'react';
import { Empty, Typography, Button } from 'antd';

const { Text } = Typography;

const Agenda = () => {
  return (
    <div>
      <Empty
        className="mb-3"
        description={<Text type="secondary">Add talking points you want to talk about with your manager.</Text>}
      >
        <Button type="primary">Add talking points</Button>
      </Empty>
    </div>
  )
}

export default Agenda;
