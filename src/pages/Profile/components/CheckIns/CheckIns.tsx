import React from "react";
import moment from "moment";
import styled from "styled-components";
import { useQuery } from "react-apollo";
import { Link } from "react-router-dom";
import { Typography, List, Row, Col, Alert, Empty, Card, Icon } from "antd";

import { Spinner } from "components/PageSpinner";
import { ICheckinData } from "apollo/types/checkin";
import { MEMBER_CHECKINS } from "apollo/queries/member";

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

const CheckIns: React.FC<{ memberId: string }> = ({ memberId }) => {
  const { data, loading, error } = useQuery(MEMBER_CHECKINS, {
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
          Check-ins
        </Title>
        <Card>
          {data?.memberCheckIns.length > 0 ? (
            <StyledList>
              {data.memberCheckIns.map((checkin: ICheckinData) => {
                const {
                  scheduleId,
                  name,
                  nextCheckInDate,
                  frequency,
                } = checkin;
                return (
                  <List.Item
                    key={scheduleId}
                    className="px-3"
                    actions={[
                      <Link
                        to={`/checkins/${scheduleId}`}
                        className="text-muted"
                      >
                        <Icon type="clock-circle" className="mr-2" />
                        <Text className="text-muted">
                          {moment(nextCheckInDate).format("MMM DD, hh:mm A")}
                        </Text>
                        <Icon type="right" className="ml-5" />
                      </Link>,
                    ]}
                  >
                    <Row className="w-100">
                      <Col span={16}>
                        <Text className="fs-16">{name}</Text>
                      </Col>
                      <Col span={8}>
                        <Text className="fs-16 text-capitalize">
                          {frequency.toLowerCase()}
                        </Text>
                      </Col>
                    </Row>
                  </List.Item>
                );
              })}
            </StyledList>
          ) : (
            <Empty description="No check-ins">
              <Paragraph className="text-muted fs-16">
                This user doesn't have any check-ins yet or you don't have
                access to view user's check-ins.
              </Paragraph>
            </Empty>
          )}
        </Card>
      </>
    );

  return loading ? (
    <Spinner label="Loading user check-ins..." />
  ) : (
    <div className="mb-4">{contentBody}</div>
  );
};

export default CheckIns;
