import React, { useRef, useState } from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Tabs, Typography, Button } from 'antd';

import { ICheckinData } from 'apollo/types/graphql-types';
import CheckInDetailView from '../CheckInDetailView';
// import PastCheckInList from '../PastCheckInList';

const { TabPane } = Tabs;
const { Title } = Typography;

interface ICheckInTabs extends RouteComponentProps<{ date: string, id: string }> {
  data: ICheckinData
}

const CheckInTabs: React.FC<ICheckInTabs> = ({ data, match, history, location }) => {
  const defaultActiveTab = match.params.date;

  const [activeTab, setActiveTab] = useState(defaultActiveTab ? 2 : 1);
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
        <Link
          to={{
            pathname: `/checkins/${match.params.id}/edit`,
            state: location.state,
          }}
        >
          <Button
            size="large"
            icon="edit"
            type="link"
            style={{ color: '#595959' }}
          >
            Settings
          </Button>
        </Link>
      )}
    >
      <TabPane tab={<Title style={{ fontSize: 16 }}>Current check-in</Title>} key="1">
        <CheckInDetailView data={data.currentCheckIn} />
      </TabPane>
      {/* <TabPane tab={<Title style={{ fontSize: 16 }}>Past check-ins</Title>} key="2">
        <PastCheckInList
          ref={pastCheckInRef}
          data={data.pastCheckIns}
          history={history}
          location={location}
          routeParams={match.params}
        />
      </TabPane> */}
    </Tabs>
  );
}

export default withRouter(CheckInTabs);
