import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import cx from 'classnames';
import styled from 'styled-components';
import { Typography, Button, Icon, Popover, Input, List, Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import { useUserContextValue } from 'contexts/UserContext';
import { AVAILABE_DIRECT_REPORTS } from 'apollo/queries/user';
import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';

const { Text } = Typography;
const { Search } = Input;

const StyledPopover = styled(Popover)`
  &.floating {
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
  .ant-list-item {
    padding: 8px 0;
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

interface IPopoverContent {
  setVisibility: (visibility: boolean) => void,
}

const PopoverContent: React.FC<IPopoverContent> = ({ setVisibility }) => {
  const [searchString, setSearchString] = useState('');
  const { account } = useUserContextValue();
  const { data, loading } = useQuery<{ availableDirectReports: IAccount[] }>(AVAILABE_DIRECT_REPORTS, {
    variables: { managerId: account?.id },
    skip: !account,
  });

  const drSource = data?.availableDirectReports
    .filter(member => (getDisplayName(member) || '').toUpperCase()
    .includes(searchString.toUpperCase()))
  || [];

  return (
    <StyledListWrapper>
      <div className="px-3 mb-2">
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
        <List<IAccount>dataSource={drSource}
          renderItem={item => (
            <List.Item className="px-3">
              <Text>{getDisplayName(item)}</Text>
            </List.Item>
          )}
        />
      )}
    </StyledListWrapper>
  );
}

const DirectReports = () => {
  const [visibility, setVisibility] = useState(false);
  return (
    <div className="mb-3">
      <Text className="d-block text-muted mb-3">Direct reports</Text>
      <div className="dr-avatar-wrapper">
      <StyledPopover
        getPopupContainer={() => document.getElementById('popover-container') || document.body}
        placement="rightBottom"
        content={<PopoverContent setVisibility={setVisibility} />}
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
      </div>
    </div>
  );
};

export default DirectReports;
