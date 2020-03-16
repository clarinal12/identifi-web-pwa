import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OneOnOne from './OneOnOne';
import OneOnOneDetails from './pages/OneOnOneDetails';
import FourOhFour from 'pages/FourOhFour';
import { OneOnOnesProvider } from 'contexts/OneOnOnesContext';

export default () => (
  <OneOnOnesProvider>
    <Switch>
      <Route exact path="/1-on-1s" component={OneOnOne} />
      <Route exact path="/1-on-1s/:direct_report_id" component={OneOnOneDetails} />
      <Route exact path="/1-on-1s/:direct_report_id/:past_session_id" component={OneOnOneDetails} />
      <Route component={FourOhFour} />
    </Switch>
  </OneOnOnesProvider>
);
