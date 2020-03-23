import React from 'react';
import moment from 'moment-timezone';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Table, List, Avatar, Typography, Icon, Button } from 'antd';

import { Spinner } from 'components/PageSpinner';
import ScheduleOneOnOneModal from '../ScheduleOneOnOneModal';
import { getDisplayName } from 'utils/userUtils';
import { IOneOnOnes } from 'apollo/types/oneOnOne';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

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

const OneOnOneList: React.FC<RouteComponentProps> = ({ history }) => {
  const { oneOnOnes, loading } = useOneOnOneContextValue();
  return loading ? (
    <Spinner />
  ) : (
    <Card>
      <StyledTable
        showHeader={false}
        pagination={{ hideOnSinglePage: true }}
        dataSource={oneOnOnes}
        rowKey={({ teammate }: any) => teammate.id}
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
            render: ({ info }: IOneOnOnes) => info?.upcomingSessionDate && (
              <Text className="text-muted">
                <Icon type="clock-circle" className="mr-2" />
                {moment(info.upcomingSessionDate).format('MMM DD, hh:mm A')}
              </Text>
            ),
          },
          {
            key: 'frequency',
            title: 'Frequency',
            render: ({ info }: IOneOnOnes) => info?.frequency && (
              <Text className="text-muted text-capitalize">
                <Icon type="reload" className="mr-2" />
                {info.frequency.toLowerCase().replace('_', '-')}
              </Text>
            ),
          },
          {
            key: 'action',
            title: 'Action',
            render: ({ teammate, info, isManager }: IOneOnOnes) => {
              return info ? (
                <div>
                  {info.scheduleId.includes('optimistic') ? (
                    <Text className="float-right" type="secondary">
                      <Icon type="loading" className="mr-2" />
                      Processing...
                    </Text>
                  ) : (
                    <Button
                      type="link"
                      className="float-right fs-16"
                      style={{ fontWeight: 500 }}
                      onClick={() => history.push({
                        pathname: `/1-on-1s/${teammate.id}`,
                        state: {
                          direct_report_id_alias: getDisplayName(teammate),
                        },
                      })}
                    >
                      View agenda
                    </Button>                  
                  )}
                </div>
              ) : (
                <div>
                  {isManager ? (
                    <ScheduleOneOnOneModal
                      directReportId={teammate.id}
                      title={`Schedule 1-1 with ${getDisplayName(teammate)}`}
                    />
                    ) : (
                    <Text className="text-muted fs-16 float-right">No details yet</Text>
                  )}
                </div>
              );
            },
          }
        ]}
      />
    </Card>
  );
}

export default withRouter(OneOnOneList);
