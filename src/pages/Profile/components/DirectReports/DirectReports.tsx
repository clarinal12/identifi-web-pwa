import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import cx from 'classnames';
import styled from 'styled-components';
import { Typography, Button, Icon, Popover, Input, List, Spin, Avatar, Badge } from 'antd';

import RemoveDirectReport from './components/RemoveDirectReport';
import { LoadingIcon } from 'components/PageSpinner';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { MEMBER } from 'apollo/queries/member';
import { ADD_DIRECT_REPORT } from 'apollo/mutations/user';
import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';
import { useMessageContextValue } from 'contexts/MessageContext';

const { Text } = Typography;
const { Search } = Input;

const StyledPopover = styled(Popover)`
  &.floating {
    border: 2px solid #E8E8E8 !important;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15) !important;
    .anticon {
      font-size: 20px;
      color: #595959;
      line-height: 0;
      &.closable {
        transform: rotate(45deg);
      }
    }
  }
`;

const StyledPopoverTitleWrapper = styled.div`
  .anticon {
    transform: rotate(45deg);
    color: #595959;
  }
`;

const StyledListWrapper = styled.div`
  max-height: 250px
  overflow: hidden;

  &:hover {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      display: block;
    }
    .ant-list-item {
      width: calc(100% - 1px);
    }
  }

  /* total width */
  &::-webkit-scrollbar {
    width: 6px !important;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #babac0 !important;
    border-radius: 12px !important;
    border: none !important;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none !important;
  }

  .ant-list-item {
    padding: 8px 16px !important;
    border-bottom: 0 !important;
    &:hover {
      background: #F5F5F5;
      cursor: pointer;
    }
    .ant-typography {
      line-height: 16px;
    }
  }
`;

const StyledAvatarWrapper = styled.div`
  .avatar-wrapper {
    &:hover {
      cursor: pointer;
      .ant-badge {
        display: inline-block;
      }
    }
    .ant-avatar {
      border: 2px solid #E8E8E8;
      margin-right: -10px;
    }
    .ant-badge {
      left: 0;
      cursor: pointer;
      display: none;
      .custom-close-btn {
        width: 14px;
        height: 14px;
        background: #FFF;
        border: 1px solid #8C8C8C;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .anticon {
          font-size: 6px;
          color: #8C8C8C;
        }
      }
    }
  }
`;

interface IPopoverContent {
  setVisibility: (visibility: boolean) => void,
  managerId: string,
}

const PopoverContent: React.FC<IPopoverContent> = ({ setVisibility, managerId }) => {
  const [searchString, setSearchString] = useState('');
  const [addDirectReport] = useMutation(ADD_DIRECT_REPORT);
  const { alertError } = useMessageContextValue();
  const { data, loading } = useQuery<{ availableDirectReports: IAccount[] }>(AVAILABE_DIRECT_REPORTS, {
    variables: { managerId },
  });

  const drSource = data?.availableDirectReports
    .filter(member => (getDisplayName(member) || '').toUpperCase()
    .includes(searchString.toUpperCase()))
  || [];

  const addDirectReportAction = (directReport: IAccount) => {
    try {
      addDirectReport({
        variables: {
          managerId,
          directReportId: directReport.id,
        },
        update: (store, { data: { addDirectReport: result } }) => {
          const directReportsCacheData: { availableDirectReports: IAccount[] } | null = store.readQuery({
            query: AVAILABE_DIRECT_REPORTS,
            variables: { managerId },
          });
          const memberCacheData: { member: IAccount } | null = store.readQuery({
            query: MEMBER,
            variables: { memberId: managerId },
          });
          
          if (directReportsCacheData && result) {
            const { availableDirectReports } = directReportsCacheData;
            store.writeQuery({
              query: AVAILABE_DIRECT_REPORTS,
              variables: { managerId },
              data: { availableDirectReports: availableDirectReports.filter(dr => dr.id !== result.id) },
            });
          }

          if (memberCacheData && result) {
            const newMember = { ...memberCacheData.member };
            newMember.directReports.push(result);
            store.writeQuery({
              query: MEMBER,
              variables: { managerId },
              data: { member: newMember },
            });
          }
        },
        optimisticResponse: {
          addDirectReport: {
            ...directReport,
            id: `optimistic-response-${Date.now()}`,
          },
        },
      });
      setVisibility(false);
    } catch(error) {
      let errorMessage = null;
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Search
          allowClear
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
          placeholder="Search member"
        />
      </div>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center">
          <Spin className="py-4" size="small" indicator={LoadingIcon} spinning />
        </div>
      ) : (
        <StyledListWrapper>
          <List<IAccount>
            dataSource={drSource}
            renderItem={item => (
              <List.Item onClick={() => addDirectReportAction(item)}>
                <Text>{getDisplayName(item)}</Text>
              </List.Item>
            )}
          />
        </StyledListWrapper>
      )}
    </div>
  );
}

const DirectReports: React.FC<{ memberInfo: IAccount }> = ({ memberInfo }) => {
  const [visibility, setVisibility] = useState(false);
  return (
    <div className="mb-3">
      <Text className="d-block text-muted mb-3">Direct reports</Text>
      <StyledAvatarWrapper className="d-flex">
        {memberInfo.directReports.map((directReport) => {
          const { id, avatar } = directReport;
          return (
            <div className="avatar-wrapper position-relative d-flex" key={id}>
              <div title={getDisplayName(directReport)}>
                <Avatar size="large" {...(avatar && { src : avatar })} />
              </div>
              <Badge
                className="position-absolute"
                {...(!id.includes('optimistic-response') && {
                  count: <RemoveDirectReport directReport={directReport} managerId={memberInfo.id} />,
                })}
              />
            </div>
          );
        })}
        <StyledPopover
          getPopupContainer={() => document.getElementById('popover-container') || document.body}
          placement="rightBottom"
          content={<PopoverContent managerId={memberInfo.id} setVisibility={setVisibility} />}
          title={(
            <StyledPopoverTitleWrapper className="d-flex justify-content-between align-items-center">
              <Text className="ant-typography mr-5">Add a direct report</Text>
              <Button className="p-0" type="link" onClick={() => setVisibility(false)}>
                <Icon className="fs-16" type="plus" />
              </Button>
            </StyledPopoverTitleWrapper>
          )}
          trigger="click"
          visible={visibility}
          onVisibleChange={v => setVisibility(v)}
        >
          <Button shape="circle" size="large" className="d-flex justify-content-center floating" onClick={e => e.preventDefault()}>
            <Icon className={cx({ 'closable': visibility })} type="plus" />
          </Button>
        </StyledPopover>
      </StyledAvatarWrapper>
    </div>
  );
};

export default DirectReports;
