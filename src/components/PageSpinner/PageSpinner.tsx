import React from 'react';
import styled from 'styled-components';
import { Spin, Icon } from 'antd';

interface IPageSpinner {
  loading?: boolean,
  label?: string,
  children?: any,
}

const StyledPageSpinnerWrapper = styled.div`
  .ant-spin {
    &.page-spinner, &.code-splitting-spinner {
      min-height: 100vh;
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .ant-spin-text {
        padding-top: 12px;
      }
    }
  }
`;

const StyledSpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  min-height: 400px;
  .ant-spin-text {
    padding-top: 12px;
  }
`;

export const LoadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export const Spinner: React.FC<IPageSpinner> = ({ loading = true, label = "Loading..." }) => (
  <StyledSpinnerWrapper className="d-flex mini-spinner">
    <Spin
      indicator={LoadingIcon}
      {...(label && {
        tip: label,
      })}
      size="large"
      spinning={loading}
    />
  </StyledSpinnerWrapper>
);

export default ({ loading = true, children = <div />, label = "Loading..." }: IPageSpinner) => (
  <StyledPageSpinnerWrapper>
    <Spin
      className="page-spinner"
      size="large"
      tip={label}
      indicator={LoadingIcon}
      spinning={loading}
    >
      {children}
    </Spin>
  </StyledPageSpinnerWrapper>
);
