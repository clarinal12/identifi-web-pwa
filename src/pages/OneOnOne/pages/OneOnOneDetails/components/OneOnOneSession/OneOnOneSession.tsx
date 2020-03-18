import React from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Card, Typography } from 'antd';

import { Spinner } from 'components/PageSpinner';
import Feedback from './components/Feedback';
import Agenda from './components/Agenda';
import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';
// import UserStatusAvatar from 'components/UserStatusAvatar';

const { Title } = Typography;

interface IOneOnOneSessionQuery {
  oneOnOneSession: IOneOnOneSession,
}

const StyledCard = styled(Card)`
  .ant-card-head {
    border: none;
    padding: 0;
    .ant-card-head-title {
      padding: 24px 24px 0 24px;
      .ant-typography {
        margin: 0 !important;
      }
    }
  }
`;

const OneOnOneSession: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { data, loading } = useQuery<IOneOnOneSessionQuery>(ONE_ON_ONE_SESSION, {
    variables: { sessionId },
  });
  return (loading && !data) ? (
    <Spinner label="Loading session details" />
  ) : (
    <>
      <StyledCard title={<Title level={4}>Feedback</Title>} className="mb-3">
        <Feedback />
      </StyledCard>
      <StyledCard title={<Title level={4}>Agenda</Title>} className="mb-3">
        <Agenda agenda={data?.oneOnOneSession?.agenda} />
      </StyledCard>
    </>
  );
}

export default OneOnOneSession;
