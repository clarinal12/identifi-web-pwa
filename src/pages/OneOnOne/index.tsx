import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OneOnOne from './OneOnOne';
import FourOhFour from 'pages/FourOhFour';

export default () => (
  <Switch>
    <Route exact path="/1-on-1s" component={OneOnOne} />
    <Route component={FourOhFour} />
  </Switch>
);
