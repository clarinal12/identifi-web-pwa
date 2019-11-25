import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

import AppMenu from './components/AppMenu';
import UserMenu from './components/UserMenu';
import AccountVerifier from 'HOC/AccountVerifier';

const { Sider, Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh !important;
`;

const StyledHeader = styled(Header)`
  background: #FFF !important;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
`;

const StyeldBrandLogo = styled.div`
  background-image: url(${process.env.PUBLIC_URL}/assets/images/brand-full.png);
  height: 64px;
  width: 100%;
  background-repeat: no-repeat;
  background-position-y: center;
  background-position-x: 24px;
`;

const StyledSider = styled(Sider)`
  flex: 0 0 256px !important;
  max-width: 256px !important;
  min-width: 256px !important;
`;

const AppLayout: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <StyledLayout>
    <StyledSider className="d-none d-sm-block">
      <StyeldBrandLogo className="mb-4" />
      <AppMenu />
    </StyledSider>
    <Layout>
      <StyledHeader className="px-4">
        <UserMenu />
      </StyledHeader>
      <Content className="p-4">
        {children}
      </Content>
    </Layout>
  </StyledLayout>
);

export default AccountVerifier(AppLayout);
