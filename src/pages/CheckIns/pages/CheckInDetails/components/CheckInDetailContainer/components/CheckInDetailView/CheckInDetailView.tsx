import React from 'react';
import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';

import CheckInHeader from './components/CheckInHeader';
import CheckInStats from './components/CheckInStats';
import RespondentCard from './components/RespondentCard';
import { TCurrentCheckIn } from 'apollo/types/graphql-types';

const { Title, Text } = Typography;

const IconMessage = () => (
  <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.5">
      <path
        fill="#BFC5D0"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1666 7.58337H75.8333C80.0041 7.58337 83.4166 10.9959 83.4166 15.1667V60.6667C83.4166 64.8375 80.0041 68.25 75.8333 68.25H22.7499L7.58325 83.4167L7.62117 15.1667C7.62117 10.9959 10.9958 7.58337 15.1666 7.58337ZM26.5416 41.7084H34.1249V34.125H26.5416V41.7084ZM49.2916 41.7084H41.7083V34.125H49.2916V41.7084ZM56.8749 41.7084H64.4582V34.125H56.8749V41.7084Z"
      />
    </g>
  </svg>
);

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
    <Col sm={6} className="text-center">
      <IconMessage />
      <Title className="mt-4" level={2}>No replies {done ? '' : 'yet'}</Title>
      {!done && <Text>Once replies start coming in they’ll appear here.</Text>}
    </Col>
  </StyledEmptyRow>
);

const CheckInDetailView: React.FC<ICheckInDetailView> = ({ data, checkInName, checkInStatus, done }) => {
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
      />
      {(data.responses.length > 0) ? (
        <div>
          {data.responses.map((response, idx) => (
            <RespondentCard key={idx} response={response} />
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
