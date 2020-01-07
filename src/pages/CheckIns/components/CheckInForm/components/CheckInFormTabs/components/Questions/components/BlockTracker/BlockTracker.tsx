import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Typography, Switch, Icon } from 'antd';

const { Text } = Typography;

interface IBlockTracker {
  isSubmitting: boolean,
  blockersEnabled: boolean,
  mergeBlockerStatusToState: (value: boolean) => void,
  setFieldValue: (key: string, value: boolean) => void,
  setFieldTouched: (key: string, value?: boolean) => void,
}

const StyledCard = styled(Card)`
  .ant-card-head {
    border: none;
    padding: 0 16px;
    .ant-card-head-title, .ant-card-extra {
      padding: 16px 0;
    }
  }
  .ant-card-body {
    padding: 0 16px 16px;
  }
`;

const BlockTracker: React.FC<IBlockTracker> = ({
  isSubmitting, blockersEnabled, mergeBlockerStatusToState, setFieldTouched, setFieldValue,
}) => {
  const [switchState, setSwitchState] = useState(blockersEnabled);
  return (
    <StyledCard
      className="mt-2"
      title="🚫️ Block tracker"
      extra={(
        <Switch
          disabled={isSubmitting}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={switchState}
          onChange={() => {
            const reversedState = !switchState;
            setFieldTouched('blockersEnabled');
            setFieldValue('blockersEnabled', reversedState);
            setSwitchState(reversedState);
            mergeBlockerStatusToState(reversedState);
          }}
        />
      )}
    >
      <div>
        <Text className="fs-16">
          Ask recepients if they are blocked.
        </Text>
      </div>
    </StyledCard>
  );
};

export default BlockTracker;
