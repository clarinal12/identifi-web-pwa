import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

const StyledWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default () => (
  <StyledWrapper>
    <Result
      status="error" // https://github.com/ant-design/ant-design/issues/21592
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={(
        <Link to="/">
          <Button type="primary">Go back to {process.env.REACT_APP_NAME}</Button>
        </Link>
      )}
    />
  </StyledWrapper>
);
