import React from "react";
import { Select, Alert } from "antd";

import { useMentionSourceContextValue } from "contexts/MentionSourceContext";
import { useCheckInResponseFilterContextValue } from "contexts/CheckInResponseFilterContext";
import { getDisplayName } from "utils/userUtils";

const { Option } = Select;

const CheckInFilter = () => {
  const { filterSource, loading, error } = useMentionSourceContextValue();
  const {
    responseFilterState,
    setResponseFilterState,
  } = useCheckInResponseFilterContextValue();
  return (
    // <Affix offsetTop={24}>
    <div className="mb-3">
      {error && error.graphQLErrors.length ? (
        <Alert
          showIcon
          type="warning"
          message={(function () {
            let errorMessage = "Network error";
            if (error.graphQLErrors[0]) {
              errorMessage = error.graphQLErrors[0].message;
            }
            return errorMessage;
          })()}
          description="Could not load filter at the moment"
        />
      ) : (
        <Select<string | string[]>
          allowClear
          loading={loading}
          size="large"
          showSearch
          className="text-capitalize w-100"
          placeholder="Select respondent"
          optionFilterProp="label"
          value={responseFilterState.memberId}
          onChange={(v) => {
            setResponseFilterState({
              ...responseFilterState,
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
      )}
    </div>
    // </Affix>
  );
};

export default CheckInFilter;
