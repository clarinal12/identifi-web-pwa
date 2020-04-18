import React from 'react';
import loadable from '@loadable/component';
import { Spin } from 'antd';

import { LoadingIcon } from 'components/PageSpinner';

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
