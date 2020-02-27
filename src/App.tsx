import React, { PropsWithChildren } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';
import routes from './config/routes';
import FourOhFour from './pages/FourOhFour';
import Maintenance from './pages/Maintenance';

import { MessageProvider } from 'contexts/MessageContext';
import { maintenance } from './config/env';

const AppProviders: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <MessageProvider>
    {children}
  </MessageProvider>
);

const App = () => maintenance ? (
  <Maintenance />
) : (
  <AppProviders>
    <Switch>
      {routes.map(({ component: Component, path, ...rest }) => (
        <Route
          key={path}
          path={path}
          render={(props: RouteComponentProps & any) => <Component {...props} {...rest} />}
        />
      ))}
      <Redirect exact from="/" to="/checkins"/>
      <Route component={FourOhFour} />
    </Switch>
  </AppProviders>
);

export default App;
