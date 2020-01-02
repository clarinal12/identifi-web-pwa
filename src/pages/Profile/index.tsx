import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Profile from './Profile';
import FourOhFour from 'pages/FourOhFour';
import { MembersProvider } from 'contexts/MembersContext';

export default () => (
  <MembersProvider>
    <Switch>
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/profile/:profile_id" component={Profile} />
      <Route component={FourOhFour} />
    </Switch>
  </MembersProvider>
);
