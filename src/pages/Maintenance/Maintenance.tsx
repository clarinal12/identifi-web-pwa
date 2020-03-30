import React from 'react';
import styled from 'styled-components';
import { Result, Layout, Button } from 'antd';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh !important;
`;

const Maintenance = () => {
  return (
    <StyledLayout>
      <Content className="d-flex align-items-center justify-content-center">
        <Result
          status="warning"
          title="Site currently under maintenance!"
          subTitle="Deployment configuration takes 5-10 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Please try again later
            </Button>,
          ]}
        />
      </Content>
    </StyledLayout>
  )
}

export default Maintenance;
