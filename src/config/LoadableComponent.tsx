import React from 'react';
import loadable from '@loadable/component';

import PageSpinner from 'components/PageSpinner';

interface ILoadableComponentProps {
  componentPathName: string,
  loadingComponent?: any,
}

const LoadableComponent = ({ componentPathName, loadingComponent }: ILoadableComponentProps) => {
  return loadable<any>(() => import(`../${componentPathName}`), {
    fallback: loadingComponent || <PageSpinner label='' />,
  });
};

export default LoadableComponent;
