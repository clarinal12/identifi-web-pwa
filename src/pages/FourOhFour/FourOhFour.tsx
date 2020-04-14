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

export default () => (
  <StyledWrapper>
    <Result
      status="404"
      title={<Title level={1}>404</Title>}
      subTitle={<Title type="secondary" level={4}>Sorry, the page you visited does not exist.</Title>}
      extra={(
        <Link to="/">
          <Button size="large" type="primary">Go back to {process.env.REACT_APP_NAME}</Button>
        </Link>
      )}
    />
  </StyledWrapper>
);
