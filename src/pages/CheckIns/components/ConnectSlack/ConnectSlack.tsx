import React from 'react';
import styled from 'styled-components';
import { Row, Col, Typography, Button, Icon } from 'antd';

import env from 'config/env';

const { Title } = Typography;

const StyledRow = styled(Row)`
  justify-content: center;
  align-items: center;
`;

const ConnectSlack = () => (
  <StyledRow className="d-flex">
    <Col sm={24} md={12} className="text-center">
      <Title level={1}>Connect your Slack</Title>
      <Title level={4} type="secondary" className="my-4">
        Identifi uses Slack to run check-ins with your team. Click the button below to connect install our Slack bot and get started.
      </Title>
      <Button
        icon="slack"
        size="large"
        type="primary"
        onClick={() => {
          const slackCallbackURL = `${window.location.origin}/checkins`;
          const slackURL = `https://slack.com/oauth/authorize?client_id=${process.env[`REACT_APP_${env}_SLACK_CLIENT_ID`]}&scope=commands,channels:read,chat:write:bot,groups:read,bot,users:read,users:read.email,team:read,chat:write:user&redirect_uri=${slackCallbackURL}`;
          window.location.href = slackURL;
        }}
      >
        Connect to Slack
      </Button>
      <div className="my-4">
        <Icon
          style={{
            color: '#E8E8E8',
            fontSize: 120,
          }}
          type="api"
        />
      </div>
    </Col>
  </StyledRow>
)

export default ConnectSlack;
