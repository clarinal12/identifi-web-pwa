import React, { useState, useEffect } from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Row, Col, Typography, Button, Tabs, Tooltip } from 'antd';

import AppLayout from 'components/AppLayout';
import { Spinner } from 'components/PageSpinner';
import ConnectSlack from './components/ConnectSlack';
import CheckInList from './components/CheckInList';
import { useUserContextValue } from 'contexts/UserContext'
import { useCheckInScheduleContextValue } from 'contexts/CheckInScheduleContext'
import { useMessageContextValue } from 'contexts/MessageContext';
import { INTEGRATE_SLACK } from 'apollo/mutations/integration';
import { ACCOUNT } from 'apollo/queries/user';
import { MEMBERS } from 'apollo/queries/member';
import { ERROR_MAP } from 'utils/errorUtils';

const { Title } = Typography;
const { TabPane } = Tabs;

const StyledTabs = styled(Tabs)`
  .ant-tabs-bar {
    margin-bottom: 24px;
  }
`;

const CheckIns: React.FC<RouteComponentProps> = ({ location }) => {
  const [integrateSlack] = useMutation(INTEGRATE_SLACK);
  const { alertSuccess, alertError } = useMessageContextValue();
  const { checkInSchedules } = useCheckInScheduleContextValue();
  const { account } = useUserContextValue();
  const activeCompany = account && account.activeCompany;
  const memberInfo = account && account.memberInfo;

  const [loadingState, setLoadingState] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');
  const errorCode = queryParams.get('error');

  const slackIntegration = async () => {
    try {
      await integrateSlack({
        variables: {
          input: {
            code,
            companyId: activeCompany && activeCompany.id,
            callbackURL: `${window.location.origin}${location.pathname}`,
          },
        },
        refetchQueries: [{
          query: ACCOUNT,
        }, {
          query: MEMBERS,
          variables: { companyId: activeCompany && activeCompany.id },
        }],
        awaitRefetchQueries: true,
      });
      alertSuccess('Slack integration success');
      setLoadingState(false);
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
    if (code && !(activeCompany && activeCompany.slackEnabled)) {
      setLoadingState(true);
      slackIntegration();
    }
    if (errorCode) {
      alertError(ERROR_MAP[errorCode]);
      setLoadingState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <Row className="mb-4">
        <Col sm={12}>
          <Title level={3}>Check-ins</Title>
        </Col>
        <Col sm={12}>
          {(checkInSchedules.length > 0) && (
            <Link className="float-right" to="/checkins/new">
              <Button
                size="large"
                type="primary"
              >
                New check-in
              </Button>
            </Link>
          )}
        </Col>
      </Row>
      {loadingState ? (
        <Spinner loading label="Verifying slack integration" />
      ) : (
        <>
          {!(activeCompany && activeCompany.slackEnabled) ? (
            <ConnectSlack />
          ) : (
            <StyledTabs defaultActiveKey={(memberInfo && memberInfo.isOwner) ? '2' : '1'}>
              <TabPane
                key="1"
                tab={(
                  <Tooltip title="All check-ins I am participating in.">
                    <Title style={{ fontSize: 16 }}>My check-ins</Title>
                  </Tooltip>
                )}
              >
                <CheckInList participatingOnly />
              </TabPane>
              <TabPane
                key="2"
                tab={(
                  <Tooltip title="All check-ins across the company.">
                    <Title style={{ fontSize: 16 }}>All check-ins</Title>
                  </Tooltip>
                )}
              >
                <CheckInList />
              </TabPane>
            </StyledTabs>
          )}
        </>
      )}
    </AppLayout>
  );
}

export default withRouter(CheckIns);
