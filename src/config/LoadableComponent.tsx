import React from 'react';
import loadable from '@loadable/component';
import { Spin, Icon } from 'antd';

const LoadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

interface ILoadableComponentProps {
  componentPathName: string,
  loadingComponent?: any,
}

const DefaultLoader = (
  <Spin
    size="large"
    className="code-splitting-spinner"
    indicator={LoadingIcon}
  />
);

const LoadableComponent = ({ componentPathName, loadingComponent }: ILoadableComponentProps) => {
  return loadable<any>(() => import(`../${componentPathName}`), {
    fallback: loadingComponent || DefaultLoader,
  });
};

export default LoadableComponent;
