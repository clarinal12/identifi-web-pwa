import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Typography, Switch, Icon } from 'antd';

const { Text } = Typography;

interface IMoodTracker {
  isSubmitting: boolean,
  moodsEnabled: boolean,
  mergeMoodStatusToState: (value: boolean) => void,
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

const MoodTracker: React.FC<IMoodTracker> = ({
  isSubmitting, moodsEnabled, mergeMoodStatusToState, setFieldTouched, setFieldValue,
}) => {
  const [switchState, setSwitchState] = useState(moodsEnabled);
  return (
    <StyledCard
      className="mt-2"
      title="🎭️ Mood tracker"
      extra={(
        <Switch
          disabled={isSubmitting}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={switchState}
          onChange={() => {
            const reversedState = !switchState;
            setFieldTouched('moodsEnabled');
            setFieldValue('moodsEnabled', reversedState);
            setSwitchState(reversedState);
            mergeMoodStatusToState(reversedState);
          }}
        />
      )}
    >
      <div>
        <Text className="fs-16">
         Ask recepients how are they feeling today.
        </Text>
      </div>
    </StyledCard>
  );
};

export default MoodTracker;
