import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Typography, Switch, Icon } from 'antd';

const { Text } = Typography;

interface IGoalTracker {
  isSubmitting: boolean,
  goalsEnabled: boolean,
  mergeGoalStatusToState: (value: boolean) => void,
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

const GoalTracker: React.FC<IGoalTracker> = ({ isSubmitting, goalsEnabled, mergeGoalStatusToState }) => {
  const [switchState, setSwitchState] = useState(goalsEnabled);
  return (
    <StyledCard
      title="🎯 Goal tracker"
      extra={(
        <Switch
          disabled={isSubmitting}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={switchState}
          onChange={() => {
            const reversedState = !switchState;
            setSwitchState(reversedState);
            mergeGoalStatusToState(reversedState);
          }}
        />
      )}
    >
      <div>
        <Text style={{ fontSize: 16 }}>
          Ask recepients if they managed to complete the goals they set the day before.
        </Text>
      </div>
      {switchState && (
        <div className="tracking-questions mt-3">
          <div className="mb-3">
            <Text className="text-muted">Question 1</Text>
            <Text className="d-block mt-1" style={{ fontSize: 16 }}>What did you accomplish yesterday?</Text>
          </div>
          <div>
            <Text className="text-muted">Question 2</Text>
            <Text className="d-block mt-1" style={{ fontSize: 16 }}>What do you plan on doing today?</Text>
          </div>
        </div>
      )}
    </StyledCard>
  );
};

export default GoalTracker;
