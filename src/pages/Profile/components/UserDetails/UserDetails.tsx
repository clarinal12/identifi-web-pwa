import React from 'react';
import { Typography, Avatar } from 'antd';

import { IAccount } from 'apollo/types/user';
import { getDisplayName } from 'utils/userUtils';

const { Title, Text } = Typography;

const UserDetails: React.FC<{ memberInfo: IAccount }> = ({ memberInfo }) => {
  return memberInfo ? (
    <div>
      <div style={{ marginBottom: 34 }}>
        {memberInfo.avatar && (
          <Avatar
            className="mb-3"
            style={{ height: 100, width: 100 }}
            src={memberInfo.avatar}
          />
        )}
        <Title level={4} className="mb-1">
          {getDisplayName(memberInfo)}
        </Title>
        <Text>{memberInfo.role}</Text>
      </div>
      {memberInfo.role && (
        <div className="mb-3">
          <Text className="d-block text-muted mb-1">Department</Text>
          <Text className="fs-16">{memberInfo.role}</Text>
        </div>
      )}
      <div className="mb-3">
        <Text className="d-block text-muted mb-1">Email</Text>
        <Text className="fs-16">{memberInfo.email}</Text>
      </div>
      {memberInfo.manager && (
        <div className="mb-3">
          <Text className="d-block text-muted mb-1">Manager</Text>
          <Text className="fs-16">{getDisplayName(memberInfo.manager)}</Text>
        </div>
      )}
    </div>
  ) : null;
}

export default UserDetails;
