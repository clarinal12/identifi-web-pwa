import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';

import CheckInHeader from './components/CheckInHeader';
import CheckInStats from './components/CheckInStats';
import RespondentCard from './components/RespondentCard';
import { TCurrentCheckIn } from 'apollo/types/graphql-types';
import { IconMessage } from 'utils/iconUtils';

const { Title, Text } = Typography;

interface ICheckInDetailView extends RouteComponentProps {
  done?: boolean,
  organizationName: string,
  checkInName: string,
  checkInStatus: string,
  data: TCurrentCheckIn,
}

const StyledEmptyRow = styled(Row)`
  min-height: 350px;
  justify-content: center;
  align-items: center;
`;

const EmptyState = ({ done = false }: { done?: boolean }) => (
  <StyledEmptyRow className="d-flex">
    <Col sm={6} md={24} className="text-center">
      <IconMessage />
      <Title className="mt-4" level={2}>No replies {done ? '' : 'yet'}</Title>
      {!done && <Text>Once replies start coming in they’ll appear here.</Text>}
    </Col>
  </StyledEmptyRow>
);

const CheckInDetailView: React.FC<ICheckInDetailView> = ({
  data, organizationName, checkInName, checkInStatus, done, location,
}) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseIdFromURL = queryParams.get('responseId');
    if (responseIdFromURL && document) {
      const expectedElement = document.getElementById(responseIdFromURL);
      expectedElement && expectedElement.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data ? (
    <>
      <CheckInHeader
        data={data}
        organizationName={organizationName}
        checkInName={checkInName}
        checkInState={ done ? 'FINISHED' : checkInStatus}
      />
      <CheckInStats
        goals={data.completedGoals}
        blockers={data.blockers}
        checkins={data.checkedIn}
      />
      {(data.responses.length > 0) ? (
        <div>
          {data.responses.map((response) => (
            <RespondentCard key={`response_${response.id}`} response={response} />
          ))}
        </div>
      ) : (
        <EmptyState done />
      )}
    </>
  ) : (
    <EmptyState />
  );
};

export default withRouter(CheckInDetailView);
