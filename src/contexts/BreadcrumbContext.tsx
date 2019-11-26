// should be placed in a component that is being rendered in all parts of the app
// so the `match` can get all updated url params
import React, { createContext, useContext, PropsWithChildren } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type TBreadcrumb = {
  label: string,
  path?: string,
  restorableStates?: any,
}

interface IBreadcrumbContext {
  breadcrumbLinks: TBreadcrumb[],
}

const BreadcrumbContext = createContext<IBreadcrumbContext>({
  breadcrumbLinks: [],
});

const BreadcrumbProvider: React.FC<PropsWithChildren<RouteComponentProps>> = ({ children, match, location }) => {
  const pathSegments = match.path.split("/").filter(v => v);
  const urlSegments = match.url.split("/");
  let restorableStates = {};
  console.log(location.state);

  const links: TBreadcrumb[] = pathSegments.map((segment: string, idx: number) => {
    const formatSegment = `${segment.replace(':', '')}_alias`;
    restorableStates = {
      ...restorableStates,
      ...((location.state && location.state[formatSegment]) && {
        [formatSegment]: location.state[formatSegment],
      }),
    };
    return {
      label: location.state ? (location.state[formatSegment] || segment) : segment,
      ...(pathSegments.length !== (idx + 1) && {
        path: [...urlSegments].splice(0, idx + 2).join("/"),
        restorableStates,
      }),
    };
  });
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbLinks: links }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

const BreadcrumbProviderWithRouter = withRouter(BreadcrumbProvider);

const useBreadcrumbContextValue = () => useContext(BreadcrumbContext);

export { BreadcrumbProviderWithRouter, useBreadcrumbContextValue };

export default BreadcrumbContext;
