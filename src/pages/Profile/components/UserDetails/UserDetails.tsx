import React from 'react';
import { Typography, Avatar } from 'antd';

import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';

const { Title, Text } = Typography;

const UserDetails: React.FC<{ memberInfo: IAccount | undefined }> = ({ memberInfo }) => {
  return memberInfo ? (
    <div>
      {memberInfo.avatar && (
        <Avatar
          className="mb-3"
          style={{ height: 100, width: 100 }}
          src={memberInfo.avatar}
        />
      )}
      <Title className="fs-16">
        {getDisplayName(memberInfo)}
      </Title>
      <Text>{memberInfo.role}</Text>
    </div>
  ) : null;
}

export default UserDetails;
