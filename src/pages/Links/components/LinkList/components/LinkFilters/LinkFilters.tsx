import React from 'react';
import { useQuery } from 'react-apollo';
import { Row, Col, Select, Button, Icon } from 'antd';

import { useMembersContextValue } from 'contexts/MembersContext';
import { LINK_CATEGORIES } from 'apollo/queries/links';
import { getDisplayName } from 'utils/userUtils';

const { Option } = Select;

export type TFilterState = {
  memberId?: string,
  categoryId?: string,
}

interface ILinkFilters {
  companyId?: string,
  filterState: TFilterState,
  setFilterState: (filterState: TFilterState) => void,
}

const LinkFilters: React.FC<ILinkFilters> = ({ companyId, filterState, setFilterState }) => {
  const { loading: membersLoading, members } = useMembersContextValue();
  const { loading, data } = useQuery<{ categories: Array<{ id: string, keyword: string }> }>(LINK_CATEGORIES, {
    variables: { companyId },
    skip: !companyId,
  });
  const hasFilters = Boolean(filterState.categoryId || filterState.memberId);
  const categorySource = !loading && data ? data.categories : [];
  return (
    <Row gutter={16} className="mb-3">
      <Col lg={10}>
        <Select<string | undefined>
          showSearch
          size="large"
          className="w-100"
          placeholder="Filter by member"
          loading={membersLoading}
          value={filterState.memberId}
          optionFilterProp="label"
          onChange={v => {
            setFilterState({ ...filterState, memberId: v });
          }}
          allowClear
        >
          {members.map((member) => (
            <Option label={getDisplayName(member)} key={member.id} value={member.id}>{getDisplayName(member)}</Option>
          ))}
        </Select>
      </Col>
      <Col lg={10}>
        <Select<string | undefined>
          showSearch
          size="large"
          className="w-100"
          placeholder="Filter by category"
          loading={loading}
          value={filterState.categoryId}
          optionFilterProp="label"
          onChange={v => {
            setFilterState({ ...filterState, categoryId: v });
          }}
          allowClear
        >
          {categorySource.map((category) => (
            <Option label={category.keyword} key={category.id} value={category.id}>{category.keyword}</Option>
          ))}
        </Select>
      </Col>
      <Col lg={4}>
        {hasFilters && (
          <Button
            className="w-100"
            size="large"
            type="link"
            onClick={() => {
              setFilterState({
                categoryId: undefined,
                memberId: undefined,
              });
            }}
          >
            <Icon type="close" style={{ fontSize: 14 }} />
            Clear all filters
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default LinkFilters;
