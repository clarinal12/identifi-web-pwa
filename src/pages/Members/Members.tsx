import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Row, Col, Avatar, Typography, Button } from 'antd';

import AppLayout from 'components/AppLayout';
import { getDisplayName } from 'utils/userUtils';
import { MembersProvider, MembersConsumer } from 'contexts/MembersContext';

const { Text } = Typography;

const StyledList = styled(List)``;

const Members = () => (
  <MembersProvider>
    <AppLayout>
      <Row>
        <Col>
          <MembersConsumer>
            {({ members }) => (
              <StyledList>
                {members.map((member, idx) => (
                  <List.Item
                    key={idx}
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
            )}
          </MembersConsumer>
        </Col>
      </Row>
    </AppLayout>
  </MembersProvider>
)

export default Members;
