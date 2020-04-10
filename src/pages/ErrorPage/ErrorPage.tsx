import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Result, Button, Typography } from 'antd';

const { Title } = Typography;

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ({ errorMessage }: { errorMessage: string }) => (
  <StyledWrapper>
    <Result
      status="error"
      title={<Title level={1}>Something went wrong</Title>}
      subTitle={<Title type="secondary" level={4}>{errorMessage}</Title>}
      extra={(
        <Link to="/">
          <Button size="large" type="primary">Go back to {process.env.REACT_APP_NAME}</Button>
        </Link>
      )}
    />
  </StyledWrapper>
);
