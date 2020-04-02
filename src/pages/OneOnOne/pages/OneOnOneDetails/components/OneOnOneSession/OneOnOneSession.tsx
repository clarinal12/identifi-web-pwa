import React from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Card, Typography, Alert } from 'antd';

import { Spinner } from 'components/PageSpinner';
import Feedback from './components/Feedback';
import Agenda from './components/Agenda';
import { ONE_ON_ONE_SESSION } from 'apollo/queries/oneOnOne';
import { IOneOnOneSession } from 'apollo/types/oneOnOne';

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
  const { data, loading, error } = useQuery<IOneOnOneSessionQuery>(ONE_ON_ONE_SESSION, {
    variables: { sessionId },
  });

  return (loading && !data) ? (
    <Spinner label="Loading session details" />
  ) : (
    <>
      {error ? (
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
          description="Could not load session details at the moment"
        />
      ) : (
        <>
          {data?.oneOnOneSession?.showFeedback && (
            <StyledCard title={<Title level={4}>Feedback</Title>} className="mb-3">
              <Feedback
                sessionId={sessionId}
                canModifyFeedback={data?.oneOnOneSession?.canModifyFeedback}
                feedbackInfo={data?.oneOnOneSession?.feedbackInfo}
              />
            </StyledCard>
          )}
          <StyledCard title={<Title level={4}>Agenda</Title>} className="mb-3">
            <Agenda
              canModifyAgenda={data?.oneOnOneSession?.canModifyAgenda}
              agenda={data?.oneOnOneSession?.agenda}
            />
          </StyledCard>
        </>        
      )}
    </>
  );
}

export default OneOnOneSession;
