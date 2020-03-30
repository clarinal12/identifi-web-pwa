import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Affix, Card, Icon, Typography } from 'antd';
import { OneOnOneProviderWithRouter } from 'contexts/OneOnOneContext';

import AppLayout from 'components/AppLayout';
import OneOnOneHeader from './components/OneOnOneHeader';
import OneOnOneSession from './components/OneOnOneSession';
import OneOnOneHistory from './components/OneOnOneHistory';
import { useOneOnOneContextValue } from 'contexts/OneOnOneContext';

const { Title } = Typography;

const StyledCard = styled(Card)`
  .ant-card-head {
    padding: 0 16px;
    border: none;
  }
  .ant-card-body {
    padding: 0 0 16px;
  }
`;

const OneOnOneDetails: React.FC<RouteComponentProps<{ session_id: string }>> = ({ match }) => {
  const { selectedUserSession } = useOneOnOneContextValue();
  const derivedSessionId = match.params.session_id || selectedUserSession?.info?.currentSessionId;

  return (
    <AppLayout>
      <Row className="mx-0" gutter={24}>
        <Col sm={24} md={17} className="pl-0">
          {derivedSessionId && (
            <OneOnOneHeader sessionId={derivedSessionId} />
          )}
          {selectedUserSession?.info && (
            <OneOnOneSession sessionId={match.params.session_id || selectedUserSession.info.currentSessionId} />
          )}
        </Col>
        <Col sm={24} md={7} className="pr-0">
          <Affix offsetTop={24}>
            <StyledCard
              className="mb-3"
              title={(
                <div className="d-flex" style={{ alignItems: 'center' }}>
                  <Icon type="calendar" className="mr-2 text-muted" />
                  <Title className="mb-0 fs-16">
                    1-1 history
                  </Title>
                </div>
              )}
            >
              <OneOnOneHistory />
            </StyledCard>
          </Affix>
        </Col>
      </Row>
    </AppLayout>
  );
}

const OneOnOneDetailsWithRouter = withRouter(OneOnOneDetails);

export default () => (
  <OneOnOneProviderWithRouter>
    <OneOnOneDetailsWithRouter />
  </OneOnOneProviderWithRouter>
);
