import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';

import CheckInHeader from './components/CheckInHeader';
import CheckInStats from './components/CheckInStats';
import RespondentCard from './components/RespondentCard';
import { TCurrentCheckIn } from 'apollo/types/graphql-types';
import { IconMessage } from 'utils/iconUtils';

const { Title, Text } = Typography;

interface ICheckInDetailView {
  done?: boolean,
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

const CheckInDetailView: React.FC<ICheckInDetailView> = ({ data, checkInName, checkInStatus, done }) => {
  useEffect(() => {
    console.log('done loading');
  }, []);
  return data ? (
    <>
      <CheckInHeader
        data={data}
        checkInName={checkInName}
        checkInState={ done ? 'FINISHED' : checkInStatus}
      />
      <CheckInStats
        goals={data.completedGoals}
        blockers={data.blockers}
        checkins={data.checkedIn}
        respondentCount={(data.notSubmitted.length + data.submitted.length)}
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

export default CheckInDetailView;
