import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OneOnOne from './OneOnOne';
import OneOnOneDetails from './pages/OneOnOneDetails';
import FourOhFour from 'pages/FourOhFour';
import { OneOnOneProviderWithRouter } from 'contexts/OneOnOneContext';

export default () => (
  <Switch>
    <Route
      exact
      path="/1-on-1s"
      component={() => (
        <OneOnOneProviderWithRouter>
          <OneOnOne />
        </OneOnOneProviderWithRouter>
      )}
    />
    <Route exact path="/1-on-1s/:direct_report_id/:session_id" component={OneOnOneDetails} />
    <Route component={FourOhFour} />
  </Switch>
);
