import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

import AppMenu from './components/AppMenu';
import UserMenu from './components/UserMenu';
import AppBreadcrumb from './components/AppBreadcrumb';
import AccountVerifier from 'HOC/AccountVerifier';
import { BreadcrumbProviderWithRouter } from 'contexts/BreadcrumbContext';

const { Sider, Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh !important;
  .main-content {
    background: #F5F5F5;
    @media (min-width: 576px) {
      margin-left: 256px;
    }
  }
`;

const StyledHeader = styled(Header)`
  background: #FFF !important;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: center;
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
  width: 256px !important;
  position: fixed !important;
  min-height: 100vh;
  left: 0;
`;

const StyledMainWrapper = styled.div`
  max-width: 1020px;
  margin: 0 auto;
`;

const AppLayout: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <BreadcrumbProviderWithRouter>
    <StyledLayout>
      <StyledSider className="d-none d-sm-block">
        <StyeldBrandLogo className="mb-4" />
        <AppMenu />
      </StyledSider>
      <Layout className="main-content">
        <StyledHeader className="px-4 d-flex">
          <AppBreadcrumb />
          <UserMenu />
        </StyledHeader>
        <Content className="p-4">
          <StyledMainWrapper>
            {children}
          </StyledMainWrapper>
        </Content>
      </Layout>
    </StyledLayout>
  </BreadcrumbProviderWithRouter>
);

export default AccountVerifier(AppLayout);
