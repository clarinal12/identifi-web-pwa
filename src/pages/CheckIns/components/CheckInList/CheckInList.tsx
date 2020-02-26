import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Typography, Button, Icon } from 'antd';

import { Spinner } from 'components/PageSpinner';
import CheckInCard from 'components/CheckInCard';
import { ICheckinData } from 'apollo/types/graphql-types';
import { useUserContextValue } from 'contexts/UserContext';
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext';

const { Title } = Typography;

interface ICheckInList {
  participatingOnly?: boolean,
}

interface IEmptyState {
  participatingOnly: boolean,
  isOwner?: boolean,
}

const StyledRow = styled(Row)`
  justify-content: center;
  align-items: center;
`;

const EmptyState: React.FC<IEmptyState> = ({ participatingOnly, isOwner }) => (
  <StyledRow className="d-flex">
    <Col sm={24} md={12} className="text-center">
      <Title level={1}>
        {participatingOnly ? 'You are not assigned to any check-ins yet' : 'Create your first check-in'}
      </Title>
      <Title level={4} type="secondary" className="my-4">
        Use check-ins to get regular input from your teammates on things you care about. You could run daily standups, weekly retrospectives, or something that works for your team.
      </Title>
      {(!participatingOnly && isOwner) && (
        <Link to="/checkins/new">
          <Button
            size="large"
            type="primary"
          >
            New check-in
          </Button>
        </Link>
      )}
      <div className="my-4">
        <Icon
          style={{
            color: '#E8E8E8',
            fontSize: 120,
          }}
          type="inbox"
        />
      </div>
    </Col>
  </StyledRow>
);

const CheckInList: React.FC<ICheckInList> = ({ participatingOnly = false }) => {
  const { checkInCards, loading: contextLoadingState } = useCheckInScheduleContextValue();
  const { account } = useUserContextValue();
  const memberInfo = account && account.memberInfo;

  const checkInScheduleSource = participatingOnly ? checkInCards.myCheckIns : checkInCards.allCheckIns;

  return contextLoadingState ? (
    <Spinner />
  ) : (
    <>
      {(checkInScheduleSource || []).length === 0 ? (
        <EmptyState participatingOnly={participatingOnly} isOwner={memberInfo && memberInfo.isOwner} />
      ): (
        <Row gutter={[24, 24]}>
          {checkInScheduleSource.map((item: ICheckinData, idx: number) => (
            <Col xs={24} sm={24} md={8} key={idx}>
              <CheckInCard
                isLastItem={(checkInScheduleSource.length - 1) === idx}
                item={item}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default CheckInList;
