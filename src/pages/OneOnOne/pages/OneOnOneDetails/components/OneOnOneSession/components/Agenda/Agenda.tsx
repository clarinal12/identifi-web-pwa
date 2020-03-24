import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Empty, Typography, Avatar, Table } from 'antd';

import AgendaModal from './components/AgendaModal';
import { getDisplayName } from 'utils/userUtils';
import { TAgenda } from 'apollo/types/oneOnOne';
import { useUserContextValue } from 'contexts/UserContext';

const { Text } = Typography;

interface IAgenda extends RouteComponentProps<{ past_session_id: string }> {
  canModifyAgenda?: boolean,
  agenda?: TAgenda[],
}

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
        .ant-btn {
          display: block;
        }
      }
      td {
        border-bottom: none;
        .ant-btn {
          display: none;
          width: auto;
          height: auto;
          margin-right: 16px;
          line-height: 16px;
        }
      }
    }
  }
  .ant-table-footer {
    background: transparent;
  }
`;

const Agenda: React.FC<IAgenda> = ({ agenda, canModifyAgenda, match }) => {
  const { account } = useUserContextValue();
  if (!Boolean(agenda?.length)) {
    return (
      <Empty
        className="mb-3"
        description={(
          <Text type="secondary">
            {match.params.past_session_id
              ? 'No talking points was set for this session.'
              : 'Add talking points you want to talk about with your manager.'
            }
          </Text>
        )}
      >
        {canModifyAgenda && <AgendaModal isEmpty />}
      </Empty>
    )
  } 
  return (
    <StyledTable
      showHeader={false}
      {...(canModifyAgenda && {
        footer: () => <AgendaModal />,
      })}
      pagination={{ hideOnSinglePage: true }}
      dataSource={agenda}
      rowKey="id"
      columns={[
        {
          key: 'agenda',
          title: 'agenda',
          render: ({ topic }: TAgenda) => <Text className="fs-16">{topic}</Text>,
        },
        {
          key: 'action',
          title: 'Action',
          render: (singleAgenda: TAgenda) => {
            const { author } = singleAgenda;
            const isOwner = author.id === account?.id;
            return author.avatar && (
              <div className="d-flex align-items-center float-right" title={getDisplayName(author)}>
                {(isOwner && canModifyAgenda) && (
                  <AgendaModal agenda={singleAgenda} />
                )}
                <Avatar size="small" src={author.avatar} />
              </div>
            );
          },
        }
      ]}
    />
  );
}

export default withRouter(Agenda);
