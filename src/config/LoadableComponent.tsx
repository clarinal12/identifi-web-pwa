import React from 'react';
import loadable from '@loadable/component';
import { Spin, Icon } from 'antd';

interface ILoadableComponentProps {
  componentPathName: string,
  loadingComponent?: any,
}

const DefaultLoader = (
  <Spin
    size="large"
    className="code-splitting-spinner"
    indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
  />
);

const LoadableComponent = ({ componentPathName, loadingComponent }: ILoadableComponentProps) => {
  return loadable<any>(() => import(`../${componentPathName}`), {
    fallback: loadingComponent || DefaultLoader,
  });
};

export default LoadableComponent;
