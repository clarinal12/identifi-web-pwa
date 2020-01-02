import React from 'react';
import { Typography } from 'antd';

import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';

const { Title, Text } = Typography;

const UserDetails: React.FC<{ memberInfo: IAccount | undefined }> = ({ memberInfo }) => {
  return memberInfo ? (
    <div>
      <Title style={{ fontSize: 16 }}>
        {getDisplayName(memberInfo)}
      </Title>
      <Text>{memberInfo.role}</Text>
    </div>
  ) : null;
}

export default UserDetails;
