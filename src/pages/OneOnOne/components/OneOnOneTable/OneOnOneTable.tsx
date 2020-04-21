import React, { useState } from 'react';
import moment from 'moment';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Table, List, Avatar, Typography, Icon, Button, Tag, Empty, Row, Col, Input } from 'antd';

import { Spinner } from 'components/PageSpinner';
import ScheduleOneOnOneModal from '../ScheduleOneOnOneModal';
import { getDisplayName } from 'utils/userUtils';
import { COLOR_MAP } from 'utils/colorUtils';
import { IOneOnOnes, TOneOnOneInfo } from 'apollo/types/oneOnOne';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

const { Text } = Typography;
const { Search } = Input;

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

const getRecursAt = (scheduleInfo: TOneOnOneInfo) => {
  const reference = moment(scheduleInfo.time);
  const day = reference.format('dddd');
  const time = reference.format('h:mm A');
  const frequency = scheduleInfo.frequency === 'BI_WEEKLY' ? 'Bi-weekly' : 'Weekly';
  return `Every ${day} at ${time}, ${frequency}`;
}

const OneOnOneList: React.FC<RouteComponentProps> = ({ history }) => {
  const { oneOnOnes, loading } = useOneOnOneContextValue();
  const [searchString, setSearchString] = useState<string | undefined>(undefined);

  const dataSource = searchString ? oneOnOnes
    .filter(({ teammate }) => (getDisplayName(teammate) || '').toUpperCase()
    .includes(searchString.toUpperCase()))
  : oneOnOnes;

  return loading ? (
    <Spinner />
  ) : (
    <Card bodyStyle={{ padding: 32 }}>
      {!Boolean(oneOnOnes.length) ? (
        <Empty
          className="my-3"
          description={(
            <Text type="secondary">No sessions yet</Text>
          )}
        />
      ) : (
        <>
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
            pagination={{ hideOnSinglePage: true }}
            dataSource={dataSource}
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
                key: 'nextSessionDate',
                title: 'Next check-in date',
                render: ({ info }: IOneOnOnes) => info?.upcomingSessionDate && (
                  <Text className="text-muted">
                    <Icon type="clock-circle" className="mr-2" />
                    {moment(info.upcomingSessionDate).format('MMM DD, hh:mm A')}
                    <Tag className="ml-3" color={COLOR_MAP[info?.currentSessionStatus]}>{info?.currentSessionStatus}</Tag>
                  </Text>
                ),
              },
              {
                key: 'frequency',
                title: 'Frequency',
                render: ({ info }: IOneOnOnes) => info && (
                  <Text className="text-muted">
                    <Icon type="reload" className="mr-2" />
                    {getRecursAt(info)}
                  </Text>
                ),
              },
              // {
              //   key: 'currentSessionStatus',
              //   title: 'Status',
              //   className: 'text-center',
              //   render: ({ info }: IOneOnOnes) => {
              //     return info?.currentSessionStatus && (
              //       <Tag color={COLOR_MAP[info?.currentSessionStatus]}>{info?.currentSessionStatus}</Tag>
              //     );
              //   },
              // },
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
                            pathname: `/1-on-1s/${info.scheduleId}/${info.currentSessionId}`,
                            state: {
                              schedule_id_alias: getDisplayName(teammate),
                              session_id_alias: moment(info.upcomingSessionDate).format('MMM DD, YYYY'),
                              ignore_breadcrumb_link: ['schedule_id_alias'],
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
        </>
      )}
    </Card>
  );
}

export default withRouter(OneOnOneList);
