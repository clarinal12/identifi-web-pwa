import React from 'react';
import { Select } from 'antd';

import { useMentionSourceContextValue } from 'contexts/MentionSourceContext';
import { useCheckInResponseFilterContextValue } from 'contexts/CheckInResponseFilterContext';
import { getDisplayName } from 'utils/userUtils';

const { Option } = Select;

const CheckInFilter = () => {
  const { filterSource, loading } = useMentionSourceContextValue();
  const { responseFilterState, setResponseFilterState } = useCheckInResponseFilterContextValue();
  return (
    // <Affix offsetTop={24}>
      <div className="mb-3">
        <Select<string | string[]>
          allowClear
          loading={loading}
          size="large"
          showSearch
          className="text-capitalize w-100"
          placeholder="Select respondent"
          optionFilterProp="label"
          value={responseFilterState.memberId}
          onChange={v => {
            setResponseFilterState({
              ...responseFilterState,
              commentId: undefined,
              memberId: v,
            });
          }}
        >
          {filterSource.map((member) => (
            <Option
              key={member.id}
              value={member.id}
              label={getDisplayName(member)}
            >
              {getDisplayName(member)}
            </Option>
          ))}
        </Select>
      </div>
    // </Affix>
  );
}

export default CheckInFilter;
