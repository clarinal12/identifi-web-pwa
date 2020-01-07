import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { Typography, Button, List, Row, Col, Alert, Empty } from 'antd';

import { Spinner } from 'components/PageSpinner';
import GoalActions from './components/GoalActions';
import GoalFormModal from './components/GoalFormModal';
import { IGoalFormValues } from './components/GoalFormModal/components/GoalForm/GoalForm';
import { GOALS } from 'apollo/queries/goals';
import {IGoal } from 'apollo/types/graphql-types';

const { Title, Text, Paragraph } = Typography;

const StyledList = styled(List)`
  background: #FFF;
  border-radius: 4px;
  .ant-list-item {
    &:first-of-type {
      border-radius: 4px 4px 0 0;
    }
    &:last-of-type {
      border-radius: 0 0 4px 4px;
    }
    cursor: pointer;
    &:hover {
      background: #F5F5F5 !important;
    }
  }
`;

const Goals: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [editGoalInfo, setEditGoalInfo] = useState<IGoalFormValues | undefined>(undefined);
  const [visibility, setVisibility] = useState(false);
  const { data, loading, error } = useQuery(GOALS, {
    variables: { memberId },
  });

  const contentBody = error ? (
    <Alert
      showIcon
      type="warning"
      message={function() {
        let errorMessage = "Network error";
        if (error.graphQLErrors[0]) {
          errorMessage = error.graphQLErrors[0].message;
        }
        return errorMessage;
      }()}
      description="Could not load user goals at the moment"
    />
  ) : (
    <>
      <Title level={4}>Goals</Title>
      {data && data.goals.length > 0 ? (
        <>
          <StyledList bordered className="my-4">
            {data.goals.map((goal: IGoal) => {
              const { id, title, target, current } = goal;
              return (
                <List.Item
                  key={id}
                  className="px-3"
                  actions={[
                    <GoalActions
                      memberId={memberId}
                      goalId={id}
                      editAction={() => {
                        setEditGoalInfo(goal);
                        setVisibility(true);
                      }}
                    />
                  ]}
                >
                  <Row className="w-100">
                    <Col span={16}>
                      <Text className="fs-16">{title}</Text>
                    </Col>
                    <Col span={8} className="text-right">
                      <Text className="fs-16">{current}/{target}</Text>
                    </Col>
                  </Row>
                </List.Item>
              );
            })}
          </StyledList>
          <Button size="large" type="primary" onClick={() => setVisibility(true)}>Add new goal</Button>
        </>
      ) : (
        <Empty description="No goals yet">
          <Paragraph className="text-muted fs-16">Start adding your goals and track your progress here.</Paragraph>
          <Button size="large" type="primary" onClick={() => setVisibility(true)}>Add new goal</Button>
        </Empty>
      )}
      <GoalFormModal
        editGoalInfo={editGoalInfo}
        memberId={memberId}
        visibility={visibility}
        onClose={() => {
          setEditGoalInfo(undefined);
          setVisibility(false);
        }}
      />
    </>
  );

  return loading ? (
    <Spinner label="Loading user goals..." />
  ) : contentBody;
}

export default Goals;
