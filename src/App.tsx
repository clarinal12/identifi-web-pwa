import React, { PropsWithChildren, useEffect, useState } from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";
import routes from "./config/routes";
import FourOhFour from "./pages/FourOhFour";
import PageSpinner from "components/PageSpinner";
import { ApolloProvider } from "react-apollo";
import getApolloClient from "config/apolloClient";

import { MessageProvider } from "contexts/MessageContext";

const AppProviders: React.FC<PropsWithChildren<any>> = ({ children }) => (
  <MessageProvider>{children}</MessageProvider>
);

const App = () => {
  const [client, setClient] = useState(null) as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApolloClient().then((newClient) => {
      setClient(newClient);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <AppProviders>
      <ApolloProvider client={client}>
        <Switch>
          {routes.map(({ component: Component, path, ...rest }) => (
            <Route
              key={path}
              path={path}
              render={(props: RouteComponentProps & any) => (
                <Component {...props} {...rest} />
              )}
            />
          ))}
          <Redirect exact from="/" to="/checkins" />
          <Route component={FourOhFour} />
        </Switch>
      </ApolloProvider>
    </AppProviders>
  );
};

export default App;
