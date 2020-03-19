import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { Empty, Typography, Avatar } from 'antd';

import AgendaModal from './components/AgendaModal';
import { getDisplayName } from 'utils/userUtils';
import { TAgenda } from 'apollo/types/oneOnOne';
import { useUserContextValue } from 'contexts/UserContext';

const { Text } = Typography;

interface IAgenda {
  agenda?: TAgenda[],
}

const StyledDiv = styled.div`
  .bordered-div {
    cursor: pointer;
    border-bottom: 1px solid #e1e4e980
    .ant-btn {
      display: none;
      width: auto;
      height: auto;
      margin-right: 16px;
      line-height: 16px;
    }
    &.first {
      padding-top: 0 !important;
    }
    &.last {
      border: none;
      margin-bottom: 16px;
    }
    &:hover {
      .ant-btn {
        display: block;
      }
    }
  }
`;

const Agenda: React.FC<IAgenda> = ({ agenda }) => {
  const { account } = useUserContextValue();
  if (!Boolean(agenda?.length)) {
    return (
      <Empty
        className="mb-3"
        description={<Text type="secondary">Add talking points you want to talk about with your manager.</Text>}
      >
        <AgendaModal />
      </Empty>
    )
  } 
  return (
    <StyledDiv>
      {agenda?.map((singleAgenda, idx) => {
        const { topic, author } = singleAgenda;
        const isOwner = author.id === account?.id;
        return (
          <div
            key={idx}
            className={cx({
              'bordered-div d-flex justify-content-between align-items-center py-3': true,
              'first': idx === 0,
              'last': idx === (agenda.length - 1),
            })}
          >
            <Text className="fs-16">{topic}</Text>
            {author.avatar && (
              <div className="d-flex align-items-center" title={getDisplayName(author)}>
                {isOwner && (
                  <AgendaModal isEditing agenda={singleAgenda} />
                )}
                <Avatar size="small" src={author.avatar} />
              </div>
            )}
          </div>
        );  
      })}
      <AgendaModal />
    </StyledDiv>
  )
}

export default Agenda;
