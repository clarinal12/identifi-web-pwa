import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Button, Typography, Spin, Avatar } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
// import UserStatusAvatar from 'components/UserStatusAvatar';
import { IOneOnOneSchedule } from 'apollo/types/oneOnOne';
import { getDisplayName } from 'utils/userUtils';

const { Title, Text } = Typography;

interface IOneOnOneHeader {
  isManager?: boolean,
  loading: boolean,
  oneOnOneSchedule?: IOneOnOneSchedule,
}

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    margin-top: 24px;
  }
`;

const OneOnOneHeader: React.FC<IOneOnOneHeader> = ({ loading, oneOnOneSchedule, isManager }) => {
  return (
    <Card className="mb-3">
      {loading ? (
        <StyledSpinnerWrapper className="d-flex align-items-center justify-content-center">
          <Spin className="py-3" size="small" indicator={LoadingIcon} />
        </StyledSpinnerWrapper>
      ) : (
        <div className="d-flex">
          {oneOnOneSchedule?.displayMember.avatar && (
            <Avatar
              style={{ width: 64, height: 64 }}
              className="mr-3 flex-shrink-0"
              src={oneOnOneSchedule.displayMember.avatar}
            />
          )}
          <div className="d-flex justify-content-between w-100">
            <div>
              <div className="d-flex" style={{ alignItems: 'center' }}>
                <Title className="mb-0 mr-2 text-capitalize" level={3}>
                  {getDisplayName(oneOnOneSchedule?.displayMember)}
                </Title>
                <Button style={{ color: '#595959' }} type="link" icon="setting" size="large" />
              </div>
              <Text type="secondary" className="fs-16">
                {moment().format('MMM DD, hh:mm a')}
              </Text>
            </div>
            {isManager && (
              <div className="d-flex align-items-end">
                <div>
                  <Button className="mr-3" type="primary" ghost>Reschedule</Button>
                  <Button type="primary">Complete 1-1</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OneOnOneHeader;
