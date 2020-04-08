import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Row, Col } from 'antd';

import CheckInHeader from '../../../CheckInHeader';
// import RespondentCard from '../../../RespondentCard';
// import { TCurrentCheckIn } from 'apollo/types/checkin';
import { IconMessage } from 'utils/iconUtils';

const { Title, Text } = Typography;

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

const CheckInDetailView: React.FC<RouteComponentProps> = ({ location }) => {
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const responseIdFromURL = queryParams.get('responseId');
  //   if (responseIdFromURL && document && window) {
  //     const expectedElement = document.getElementById(responseIdFromURL);
  //     expectedElement && window.scrollBy({
  //       top: expectedElement.offsetTop + 88, // 88px for nav height and content padding top
  //       behavior: 'smooth',
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <>
      <CheckInHeader />
      <EmptyState />
      {/* <CheckInStats
        goals={data.completedGoals}
        blockers={data.blockers}
        checkins={data.checkedIn}
      /> */}
      {/* {(data.responses.length > 0) ? (
        <div>
          {data.responses.map((response) => (
            <RespondentCard key={`response_${response.id}`} response={response} isCurrent={data.isCurrent} />
          ))}
        </div>
      ) : (
        <EmptyState done />
      )} */}
    </>
  );
};

export default withRouter(CheckInDetailView);
