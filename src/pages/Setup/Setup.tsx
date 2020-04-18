import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import createPersistedState from 'use-persisted-state';
import { Row, Col } from 'antd';
import LazyLoad from 'react-lazyload';
import queryString from 'query-string';

import { Spinner } from 'components/PageSpinner';
import SetupTabs from './components/SetupTabs';
import { useUserContextValue } from 'contexts/UserContext';
import { useMessageContextValue } from 'contexts/MessageContext';
import { ACCOUNT } from 'apollo/queries/user';
import { INTEGRATE_SLACK } from 'apollo/mutations/integration';
import { ERROR_MAP } from 'utils/errorUtils';
import { ENTER_COMPANY } from 'apollo/mutations/setup';

const StyledDiv = styled.div`
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  &.right-content {
    background: #FAFAFA;
  }
`;

const useActiveTabState = createPersistedState('activetab');

const Setup: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [integrateSlack] = useMutation(INTEGRATE_SLACK);
  const [enterCompany] = useMutation(ENTER_COMPANY);
  const { alertError, alertSuccess } = useMessageContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account?.activeCompany;

  const [loadingState, setLoadingState] = useState(false);
  const [activeTabKey, setActiveTabKey] = useActiveTabState(1);

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
        }],
      });
      onboardUserAction();
    } catch(error) {
      errorHandler(error);
    }
  }

  const onboardUserAction = async () => {
    try {
      if (activeCompany) {
        await enterCompany({
          variables: {
            companyId: activeCompany.id,
          },
          refetchQueries: [{
            query: ACCOUNT,
          }],
          awaitRefetchQueries: true,
        });
      }
      alertSuccess("Slack integration success! Email invitations has been sent.");
      localStorage.removeItem('activetab');
      history.push("/");
    } catch(error) {
      errorHandler(error);
    }
  }

  const errorHandler = (error: any) => {
    let errorMessage = "Network error";
    if (error.graphQLErrors[0]) {
      errorMessage = error.graphQLErrors[0].message;
    }
    alertError(errorMessage);
    setLoadingState(false);
  }

  useEffect(() => {
    if (code && activeTabKey === 3) {
      setLoadingState(true);
      slackIntegration();
    }
    if (errorCode) {
      alertError(ERROR_MAP[errorCode.toString()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabKey]);

  return (
    <Row>
      <Col sm={24} md={12}>
        <StyledDiv className="d-flex">
          {loadingState ? <Spinner label="Verifying slack integration" /> : (
            <SetupTabs setActiveTabKey={setActiveTabKey} activeTabKey={activeTabKey} />
          )}
        </StyledDiv>
      </Col>
      <Col sm={24} md={12}>
        <StyledDiv className="d-flex right-content">
          <LazyLoad height={200}>
            <img alt="Sign in" src={`${process.env.PUBLIC_URL}/assets/images/illustration-account-setup.png`} />
          </LazyLoad>
        </StyledDiv>
      </Col>
    </Row>
  );
}

export default withRouter(Setup);
