import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { Typography, List, Card, Alert, Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';
import Google from './components/Google';
import { IGoogleIntegrationInfo } from './components/Google/Google';
import { INTEGRATION_INFO } from 'apollo/queries/integration';

const { Title } = Typography;

interface IIntegrationInfoQuery {
  integrationInfo: {
    google: IGoogleIntegrationInfo,
  },
}

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

const StyledSpinnerWrapper = styled.div`
  .ant-spin-text {
    padding-top: 6px;
  }
`;

const Integrations  = () => {
  const { data, loading, error } = useQuery<IIntegrationInfoQuery>(INTEGRATION_INFO);

  if (error ) {
    return (
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
        description="Could not load integrations at the moment"
      />
    );
  }

  return (loading) ? (
    <StyledSpinnerWrapper className="py-4">
      <Spin
        className="d-block"
        indicator={LoadingIcon}
        tip="Loading integrations..."
        size="small"
        spinning
      />
    </StyledSpinnerWrapper>
  ) : (
    <>
      <Title className="mb-3" level={4}>Integrations</Title>
      <Card>
        <StyledList>
          {data && (
            <Google integrationInfo={data.integrationInfo.google} />
          )}
        </StyledList>
      </Card>
    </>
  );
}

export default Integrations;
