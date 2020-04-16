import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Typography, List, Card, Switch, Popconfirm } from 'antd';

import { Spinner } from 'components/PageSpinner';
import { useMessageContextValue } from 'contexts/MessageContext';
import { DISABLE_GOOGLE_CALENDAR, INTEGRATE_GOOGLE } from 'apollo/mutations/integration';

const { Title, Text } = Typography;

const StyledList = styled(List)`
  .ant-list-item {
    cursor: pointer;
    border-bottom: 1px solid #F5F5F5 !important;
    &:hover {
      background: #F5F5F5 !important;
    }
    &:last-of-type {
      border-bottom: none !important;
    }
  }
`;

const Integrations  = () => {
  const { alertSuccess, alertError, alertWarning } = useMessageContextValue();
  const [toggleState, setToggleState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [integrateGoogleMutation] = useMutation(INTEGRATE_GOOGLE);
  const [disableGoogleCalendarMutation] = useMutation(DISABLE_GOOGLE_CALENDAR);

  const integrateGoogleAction = async () => {
    setLoadingState(true);
    try {
      await integrateGoogleMutation({
        variables: {
          code: '', // ask code from chris
          scopes: ['CALENDAR'],
        }
      });
      alertSuccess('Google calendar integration success!');
    } catch (error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  const disableGoogleCalendarMutationAction = async () => {
    setLoadingState(true);
    try {
      await disableGoogleCalendarMutation();
      alertWarning('Removed Google calendar integration.');
    } catch (error) {
      let errorMessage = "Network error";
      if (error.graphQLErrors[0]) {
        errorMessage = error.graphQLErrors[0].message;
      }
      alertError(errorMessage);
    }
    setLoadingState(false);
  }

  return false ? (
    <Spinner label="Loading integrations..." />
  ) : (
    <>
      <Title className="mb-3" level={4}>Integrations</Title>
      <Card>
        <StyledList>
          <List.Item
            className="px-3"
            actions={[
              <Popconfirm
                placement="topRight"
                title="Connect your Google account to activate this integration."
                onConfirm={() => {
                  // redirect shit here
                }}
                onCancel={() => setToggleState(false)}
                okText="Proceed"
                cancelText="Cancel"
              >
                <Switch loading={loadingState} checked={toggleState} onChange={setToggleState} />
              </Popconfirm>
            ]}
          >
            <Text className="fs-16">Google Calendar</Text>
          </List.Item>
        </StyledList>
      </Card>
    </>
  );
}

export default Integrations;
