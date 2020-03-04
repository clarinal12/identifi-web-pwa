import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { List, Avatar, Typography, Table, Card, Row, Col, Input } from 'antd';

import { Spinner } from 'components/PageSpinner';
import { getDisplayName } from 'utils/userUtils';
import { useMembersContextValue } from 'contexts/MembersContext';

const { Text } = Typography;
const { Search } = Input;
// const { Option } = Select;

const StyledTable = styled(Table)`
  table {
    border-collapse: collapse !important;
    .ant-table-row {
      border-bottom: 1px solid #F5F5F5;
      &:last-of-type {
        border-bottom: none;
      }
      &:hover > td {
        background: #c5dbd8cc !important;
      }
      td {
        border-bottom: none;
      }
    }
  }
`;

const MembersTable: React.FC = () => {
  const { members, loading } = useMembersContextValue();
  const [searchString, setSearchString] = useState<string | undefined>(undefined);

  const dataSource = searchString ? members
    .filter(member => (getDisplayName(member) || '').toUpperCase()
    .includes(searchString.toUpperCase()))
  : members;

  return loading ? (
    <Spinner />
  ) : (
    <Card bodyStyle={{ padding: 32 }}>
      <Row className="mb-5">
        <Col md={12} className="d-flex align-items-center">
          <Text className="mr-3 flex-grow-1 flex-shrink-0">Filter by name</Text>
          <Search
            className="w-100"
            placeholder="Start typing a name..."
            allowClear
            onChange={e => setSearchString(e.target.value)}
          />
        </Col>
        {/* <Col md={12} className="d-flex align-items-center justify-content-end">
          <Text className="mr-3">Show</Text>
          <Select
            showSearch
            style={{ width: 200 }}
            value="all"
          >
            <Option value="all">All active</Option>
            <Option value="archived">Archived</Option>
          </Select>
        </Col> */}
      </Row>
      <StyledTable
        showHeader={false}
        dataSource={dataSource}
        rowKey="id"
        columns={[
          {
            key: 'name',
            title: 'Name',
            render: member => (
              <List.Item.Meta
                avatar={member.avatar && <Avatar size="large" src={member.avatar} />}
                title={getDisplayName(member)}
                description={<Text className="text-muted" style={{ fontSize: 12 }}>{member.role}</Text>}
              />
            ),
          },
          {
            key: 'type',
            title: 'Type',
            render: member => <Text className="text-muted">
              {member.isGuest ? 'Guest' : 'Member'}
            </Text>,
          },
          {
            key: 'action',
            title: 'Action',
            render: member => (
              <Link className="float-right" style={{ fontWeight: 600 }} to={`/profile/${member.id}`}>
                View profile
              </Link>
            ),
          }
        ]}
      />
    </Card>
  );
}

export default MembersTable;
