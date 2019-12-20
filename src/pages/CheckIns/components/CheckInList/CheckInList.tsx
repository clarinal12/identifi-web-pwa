import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Row, Col, Typography, Button, Icon } from 'antd';

import { Spinner } from 'components/PageSpinner';
import CheckInCard from 'components/CheckInCard';
import { ICheckinData } from 'apollo/types/graphql-types';
import { CHECKIN_SCHEDULES } from 'apollo/queries/checkin';
import { useUserContextValue } from 'contexts/UserContext';

const { Title } = Typography;

interface ICheckInList {
  setCheckInButtonState: (state: boolean) => void,
  participatingOnly?: boolean,
}

const StyledRow = styled(Row)`
  justify-content: center;
  align-items: center;
`;

const EmptyState = () => (
  <StyledRow className="d-flex">
    <Col sm={24} md={12} className="text-center">
      <Title level={1}>Create your first check-in</Title>
      <Title level={4} type="secondary" className="my-4">
        Use check-ins to get regular input from your teammates on things you care about. You could run daily standups, weekly retrospectives, or something that works for your team.
      </Title>
      <Link to="/checkins/new">
        <Button
          size="large"
          type="primary"
        >
          New check-in
        </Button>
      </Link>
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

const CheckInList: React.FC<ICheckInList> = ({ setCheckInButtonState, participatingOnly = false }) => {
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;

  const { loading, data } = useQuery(CHECKIN_SCHEDULES, {
    variables: {
      filter: {
        companyId: activeCompany && activeCompany.id,
        participatingOnly,
      }
    },
    onCompleted: data => setCheckInButtonState(!!data.checkInSchedules.length),
  });

  useEffect(() => {
    if (data) {
      setCheckInButtonState(!!data.checkInSchedules.length);
    }
  }, [data, setCheckInButtonState]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      {(data.checkInSchedules || []).length === 0 ? (
        <EmptyState />
      ): (
        <Row gutter={[24, 24]}>
          {data.checkInSchedules.map((item: ICheckinData, idx: number) => (
            <Col xs={24} sm={24} md={8} key={idx}>
              <CheckInCard
                isLastItem={(data.checkInSchedules.length - 1) === idx}
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
