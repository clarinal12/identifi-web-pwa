import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Row, Col, Typography, Button, Icon } from 'antd';
import queryString from 'query-string';

import { Spinner } from 'components/PageSpinner';
import { useUserContextValue } from 'contexts/UserContext'
import { useMessageContextValue } from 'contexts/MessageContext';
import { INTEGRATE_SLACK } from 'apollo/mutations/integration';
import { ACCOUNT } from 'apollo/queries/user';
import { MEMBERS } from 'apollo/queries/member';
import { ERROR_MAP } from 'utils/errorUtils';
import env from 'config/env';
import { INTEGRATION_URLS } from 'config/appConfig';

const { Title } = Typography;

interface IConnectSlack extends RouteComponentProps {
  slackMessage: string
}

const StyledRow = styled(Row)`
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 128px);
`;

const ConnectSlack: React.FC<IConnectSlack> = ({ slackMessage, location }) => {
  const [integrateSlack] = useMutation(INTEGRATE_SLACK);
  const { alertSuccess, alertError } = useMessageContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account?.activeCompany;

  const [loadingState, setLoadingState] = useState(false);

  const { code, errorCode } = queryString.parse(location.search);

  const slackIntegration = async () => {
    try {
      await integrateSlack({
        variables: {
          input: {
            code,
            companyId: activeCompany?.id,
            callbackURL: `${window.location.origin}${location.pathname}`,
          },
        },
        refetchQueries: [{
          query: ACCOUNT,
        }, {
          query: MEMBERS,
          variables: { companyId: activeCompany?.id },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess('Slack integration success');
    } catch(error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
      setLoadingState(false);
    }
  }

  useEffect(() => {
    if (code && !(activeCompany?.slackEnabled)) {
      setLoadingState(true);
      slackIntegration();
    }
    if (errorCode) {
      alertError(ERROR_MAP[errorCode.toString()]);
      setLoadingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loadingState ? (
    <Spinner label="Verifying slack integration" />
  ) : (
    <StyledRow className="d-flex">
      <Col sm={24} md={12} className="text-center">
        <Title level={1}>Connect your Slack</Title>
        <Title level={4} type="secondary" className="my-4">
          {slackMessage}
        </Title>
        <Button
          icon="slack"
          size="large"
          type="primary"
          onClick={() => {
            const queryParams = queryString.stringify({
              client_id: process.env[`REACT_APP_${env}_SLACK_CLIENT_ID`],
              scope: "channels:history,channels:join,channels:read,chat:write,commands,groups:history,groups:read,groups:write,im:history,im:write,mpim:write,users.profile:read,users:read,users:read.email",
              user_scope: "channels:read,groups:read,team:read,users:read,users:read.email",
              redirect_uri: `${window.location.origin}${window.location.pathname}`,
            });
            const slackURL = `${INTEGRATION_URLS.SLACK}?${queryParams}`;
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
  );
}

export default withRouter(ConnectSlack);
