import React, { useRef, useState } from 'react';
import { Tabs, Typography, Button } from 'antd';

import { ICheckinData } from 'apollo/types/graphql-types';
import CheckInDetailView from '../CheckInDetailView';
import PastCheckInList from '../PastCheckInList';

const { TabPane } = Tabs;
const { Title } = Typography;

const CheckInTabs: React.FC<{ data: ICheckinData }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(1);
  const pastCheckInRef = useRef<{ resetCheckInId: () => void }>();
  return (
    <Tabs
      activeKey={activeTab.toString()}
      onTabClick={(key: number) =>{
        setActiveTab(key);
        if (pastCheckInRef.current) {
          pastCheckInRef.current.resetCheckInId();
        }
      }}
      tabBarExtraContent={(
        <Button
          size="large"
          icon="edit"
          type="link"
          style={{ color: '#595959' }}
        >
          Settings
        </Button>
      )}
    >
      <TabPane tab={<Title style={{ fontSize: 16 }}>Current check-in</Title>} key="1">
        <CheckInDetailView data={data.currentCheckIn} />
      </TabPane>
      <TabPane tab={<Title style={{ fontSize: 16 }}>Past check-ins</Title>} key="2">
        <PastCheckInList
          ref={pastCheckInRef}
          data={data.pastCheckIns}
        />
      </TabPane>
    </Tabs>
  );
}

export default CheckInTabs;
