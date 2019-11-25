import React, { PropsWithChildren } from 'react';
import { Switch, Route, RouteComponentProps, Redirect } from 'react-router-dom';
import routes from './config/routes';
import FourOhFour from './pages/FourOhFour';

import { MessageProvider } from 'contexts/MessageContext';

const AppProviders: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <MessageProvider>
    {children}
  </MessageProvider>
);

const App = () => (
  <AppProviders>
    <Switch>
      {routes.map(({ component: Component, path, ...rest }) => (
        <Route
          key={path}
          path={path}
          render={(props: RouteComponentProps & any) => <Component {...props} {...rest} />}
        />
      ))}
      <Redirect exact from="/" to="/timeline"/>
      <Route component={FourOhFour} />
    </Switch>
  </AppProviders>
);

export default App;
