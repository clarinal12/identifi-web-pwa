import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-apollo";
import { Typography, Button, List, Row, Col, Alert, Empty, Card } from "antd";

import { Spinner } from "components/PageSpinner";
import GoalActions from "./components/GoalActions";
import GoalFormModal from "./components/GoalFormModal";
import { IGoalFormValues } from "./components/GoalFormModal/components/GoalForm/GoalForm";
import { GOALS } from "apollo/queries/goals";
import { IGoal } from "apollo/types/user";
import { useUserContextValue } from "contexts/UserContext";

const { Title, Text, Paragraph } = Typography;

const StyledList = styled(List)`
  .ant-list-item {
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5 !important;
    &:hover {
      background: #f5f5f5 !important;
    }
    &:last-of-type {
      border-bottom: none !important;
    }
  }
`;

const Goals: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [editGoalInfo, setEditGoalInfo] = useState<IGoalFormValues | undefined>(
    undefined
  );
  const [visibility, setVisibility] = useState(false);
  const [updateProgressState, setUpdateProgressState] = useState(false);
  const { account } = useUserContextValue();
  const isGoalOwner = account?.id === memberId;
  const { data, loading, error } = useQuery(GOALS, {
    variables: { memberId },
  });

  const contentBody =
    error && error.graphQLErrors.length ? (
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
        description="Could not load user goals at the moment"
      />
    ) : (
      <>
        <Title className="mb-3" level={4}>
          Goals
        </Title>
        {data?.goals.length > 0 ? (
          <>
            <Card className="mb-3">
              <StyledList>
                {data.goals.map((goal: IGoal) => {
                  const { id, title, target, current, unit } = goal;
                  return (
                    <List.Item
                      key={id}
                      className="px-3"
                      {...(isGoalOwner && {
                        actions: [
                          <GoalActions
                            memberId={memberId}
                            goalId={id}
                            updateProgressAction={() => {
                              setEditGoalInfo(goal);
                              setVisibility(true);
                              setUpdateProgressState(true);
                            }}
                            editAction={() => {
                              setEditGoalInfo(goal);
                              setVisibility(true);
                            }}
                          />,
                        ],
                      })}
                    >
                      <Row className="w-100">
                        <Col span={16}>
                          <Text className="fs-16">{title}</Text>
                        </Col>
                        <Col span={8} className="text-right">
                          <Text className="fs-16 mr-2">
                            {current}/{target}
                          </Text>
                          <Text strong className="fs-16">
                            {unit}
                          </Text>
                        </Col>
                      </Row>
                    </List.Item>
                  );
                })}
              </StyledList>
            </Card>
            {isGoalOwner && (
              <Button
                size="large"
                type="primary"
                onClick={() => setVisibility(true)}
              >
                Add new goal
              </Button>
            )}
          </>
        ) : (
          <Card>
            <Empty description="No goals yet">
              {isGoalOwner && (
                <>
                  <Paragraph className="text-muted fs-16">
                    Start adding your goals and track your progress here.
                  </Paragraph>
                  <Button
                    size="large"
                    type="primary"
                    onClick={() => setVisibility(true)}
                  >
                    Add new goal
                  </Button>
                </>
              )}
            </Empty>
          </Card>
        )}
        <GoalFormModal
          editGoalInfo={editGoalInfo}
          memberId={memberId}
          updateProgressState={updateProgressState}
          visibility={visibility}
          onClose={() => {
            setEditGoalInfo(undefined);
            setVisibility(false);
            setUpdateProgressState(false);
          }}
        />
      </>
    );

  return loading ? (
    <Spinner label="Loading user goals..." />
  ) : (
    <div className="mb-4">{contentBody}</div>
  );
};

export default Goals;
