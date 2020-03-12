import React from 'react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { Card, Table, List, Avatar, Typography, Icon, Button } from 'antd';

import { Spinner } from 'components/PageSpinner';
import { getDisplayName } from 'utils/userUtils';
import { ONE_ON_ONES } from 'apollo/queries/oneOnOne';
import { IOneOnOnes } from 'apollo/types/oneOnOnes';
import { useUserContextValue } from 'contexts/UserContext';

const { Text } = Typography;

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
        .user-details > .ant-list-item-meta-content {
          .ant-list-item-meta-title {
            margin-bottom: 0;
          }
        }
      }
    }
  }
`;

const OneOnOneList = () => {
  const { account } = useUserContextValue();
  const derivedTimezone = account?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data, loading } = useQuery(ONE_ON_ONES);

  return loading ? (
    <Spinner />
  ) : (
    <Card>
      <StyledTable
        showHeader={false}
        dataSource={data.oneOnOnes}
        rowKey="id"
        columns={[
          {
            key: 'name',
            title: 'Name',
            render: ({ teammate }: IOneOnOnes) => (
              <List.Item.Meta
                className="d-flex align-items-center user-details"
                avatar={teammate.avatar && <Avatar size="large" src={teammate.avatar} />}
                title={getDisplayName(teammate)}
                description={<Text className="text-muted" style={{ fontSize: 12 }}>{teammate.role}</Text>}
              />
            ),
          },
          {
            key: 'nextCheckInDate',
            title: 'Next check-in date',
            render: ({ info }: IOneOnOnes) => info?.nextSessionDate && (
              <Text className="text-muted">
                <Icon type="clock-circle" className="mr-2" />
                {moment(info.nextSessionDate).tz(derivedTimezone).format('MMM DD, hh:mm A')}
              </Text>
            ),
          },
          {
            key: 'frequency',
            title: 'Frequency',
            render: ({ info }: IOneOnOnes) => info?.frequency && (
              <Text className="text-muted">
                {info.frequency.toLowerCase()}
              </Text>
            ),
          },
          {
            key: 'action',
            title: 'Action',
            render: ({ teammate, info }: IOneOnOnes) => {
              return info ? (
                <Link className="float-right fs-16" style={{ fontWeight: 500 }} to={`/profile/${teammate.id}`}>
                  View agenda
                </Link>
              ) : (
                <Button className="float-right" type="primary">Schedule 1-1</Button>
              );
            },
          }
        ]}
      />
    </Card>
  );
}

export default OneOnOneList;
