import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import { Typography, List, Switch, Popconfirm } from 'antd';
import { isDev } from 'config/env';
import queryString from 'query-string';

import { useMessageContextValue } from 'contexts/MessageContext';
import { DISABLE_GOOGLE_INTEGRATION, SETUP_GOOGLE_INTEGRATION } from 'apollo/mutations/integration';
import setupGoogleIntegrationCacheHandler from './cache-handler/setupGoogleIntegration';
import disableGoogleIntegrationCacheHandler from './cache-handler/disableGoogleIntegration';
import { INTEGRATION_URLS } from 'config/appConfig';
import { ERROR_MAP } from 'utils/errorUtils';

const { Text } = Typography;

export interface IGoogleIntegrationInfo {
  scopes: string[],
  calendar: {
    enabled: boolean,
    scope: string,
  }
}

interface IGoogle extends RouteComponentProps {
  integrationInfo: IGoogleIntegrationInfo
}

const Google: React.FC<IGoogle>  = ({ integrationInfo, location }) => {
  // UPDATE THIS BEFORE DEPLOYING TO PRODUCTION
  const redirectURI = isDev ? 'https://web.identifi.com/profile' : `${window.location.origin}${window.location.pathname}`;
  const { code: codeFromURL, scope: scopeFromURL, error: errorFromURL } = queryString.parse(location.search);
  const defaultToggleState = integrationInfo.calendar.enabled || Boolean(codeFromURL && scopeFromURL);

  const { alertSuccess, alertError, alertWarning } = useMessageContextValue();
  const [toggleState, setToggleState] = useState(defaultToggleState);
  const [loadingState, setLoadingState] = useState(false);
  const [setupGoogleIntegrationMutation] = useMutation(SETUP_GOOGLE_INTEGRATION);
  const [disableGoogleIntegrationMutation] = useMutation(DISABLE_GOOGLE_INTEGRATION);

  const url = `${window.location.href}?client_id=${process.env.REACT_APP_DEVELOPMENT_SLACK_CLIENT_ID}&scope=channels:history,channels:join,channels:read,chat:write,commands,groups:history,groups:read,groups:write,im:history,im:write,mpim:write,users.profile:read,users:read,users:read.email&user_scope=channels:read,groups:read,team:read,users:read,users:read.email`

  console.log(queryString.parse(url));

  useEffect(() => {
    if ((codeFromURL && scopeFromURL) && !integrationInfo.calendar.enabled) {
      setupGoogleIntegrationAction();
    }
    if (errorFromURL) {
      alertError(ERROR_MAP[errorFromURL.toString()]);
      setLoadingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupGoogleIntegrationAction = async () => {
    setLoadingState(true);
    try {
      await setupGoogleIntegrationMutation({
        variables: {
          code: codeFromURL,
          scopes: scopeFromURL?.toString().split(' '),
          redirectURI,
        },
        ...setupGoogleIntegrationCacheHandler({
          scope: integrationInfo.calendar.scope,
          scopes: scopeFromURL?.toString().split(' '),
        }),
      });
      alertSuccess('Google calendar integration success!');
    } catch (error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      setToggleState(false);
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  const disableGoogleIntegrationAction = async () => {
    setLoadingState(true);
    try {
      await disableGoogleIntegrationMutation({
        variables: {
          scope: integrationInfo.calendar.scope,
        },
        ...disableGoogleIntegrationCacheHandler({
          scope: integrationInfo.calendar.scope,
          scopes: scopeFromURL?.toString().split(' ').filter(v => v !== integrationInfo.calendar.scope),
        }),
      });
      alertWarning('Removed Google calendar integration.');
    } catch (error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      setToggleState(true);
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  const proceedToGoogleIntegration = () => {
    const allScopes = [...integrationInfo.scopes];
    if (!allScopes.find(singleScope => singleScope === integrationInfo.calendar.scope)) {
      allScopes.push(integrationInfo.calendar.scope);
    }
    const queryParams = queryString.stringify({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: redirectURI,
      response_type: 'code',
      scope: allScopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });
    const googleURL = `${INTEGRATION_URLS.GOOGLE}?${queryParams}`;
    window.location.href = googleURL;
  }

  const popConfirmTitle = integrationInfo.calendar.enabled ?
    'Remove Google calendar integration?' :
    'Connect your Google account to activate this integration.';

  const onConfirmAction = integrationInfo.calendar.enabled ?
    disableGoogleIntegrationAction :
    proceedToGoogleIntegration;

  return (
    <List.Item
      className="px-3"
      actions={[
        <Popconfirm
          placement="topRight"
          title={popConfirmTitle}
          onConfirm={() => {
            setToggleState(!integrationInfo.calendar.enabled);
            onConfirmAction();
          }}
          onCancel={() => {
            setToggleState(integrationInfo.calendar.enabled);
          }}
          okText="Proceed"
          cancelText="Cancel"
        >
          <Switch loading={loadingState} checked={toggleState} />
        </Popconfirm>
      ]}
    >
      <Text className="fs-16">Google Calendar</Text>
    </List.Item>
  );
}

export default withRouter(Google);
