import React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import moment from 'moment';
import { Card, Typography, Icon, Button, Tag } from 'antd';

import { COLOR_MAP } from 'utils/colorUtils';
import { useUserContextValue } from 'contexts/UserContext';
import { TCurrentCheckIn } from 'apollo/types/checkin';

const { Title, Text } = Typography;

interface ICheckInHeader extends RouteComponentProps<{ checkin_id: string }> {
  data: TCurrentCheckIn,
  checkInName: string,
  checkInState: string,
}

const CheckInHeader: React.FC<ICheckInHeader> = ({ data, checkInName, checkInState, match }) => {
  const { account } = useUserContextValue();
  return (
    <Card style={{ background: '#006D75' }} className="mb-3">
      <div className="d-flex mb-2" style={{ justifyContent: 'space-between' }}>
        <div className="d-flex" style={{ alignItems: 'center' }}>
          <Title className="mb-0 mr-3" level={3} style={{ color: '#FFFFFF' }}>
            {checkInName}
          </Title>
        </div>
        {(account?.isOwner) && (
          <Link to={`/checkins/${match.params.checkin_id}/edit`}>
            <Button
              type="link"
              htmlType="button"
              size="large"
              className="p-0"
              style={{ fontSize: 20, color: '#E6FFFB' }}
            >
              <Icon type="setting" />
            </Button>
          </Link>
        )}
      </div>
      <div
        className="d-flex mt-2"
        style={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Text className="fs-16" style={{ color: '#E6FFFB' }}>
          {moment(data.date).format('MMM DD, hh:mm a')}
        </Text>
        <div>
          <Tag className="m-0" color={COLOR_MAP[checkInState]}>
            <Text>{checkInState}</Text>
          </Tag>
        </div>
      </div>
    </Card>
  );
}

export default withRouter(CheckInHeader);
