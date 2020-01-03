import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Avatar, Button, Typography } from 'antd';

import { getDisplayName } from 'utils/userUtils';
import { useMembersContextValue } from 'contexts/MembersContext';

const { Text } = Typography;

const StyledList = styled(List)`
  .antd-list-item {
    border: 1px solid #D9D9D9;
  }
`;

const MemberList: React.FC = () => {
  const { members } = useMembersContextValue();
  return (
    <StyledList>
        {members.map((member) => (
          <List.Item
            key={member.memberId}
            actions={[
              <Link to={`/profile/${member.memberId}`}>
                <Button htmlType="button">
                  View profile
                </Button>
              </Link>
            ]}
          >
            <List.Item.Meta
              avatar={member.avatar && <Avatar src={member.avatar} />}
              title={getDisplayName(member)}
              description={<Text className="text-muted" style={{ fontSize: 12 }}>{member.role}</Text>}
            />
          </List.Item>
        ))}
      </StyledList>
  );
}

export default MemberList;
