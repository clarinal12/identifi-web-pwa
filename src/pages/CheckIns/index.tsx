import React from 'react';
import { Switch, Route } from 'react-router-dom';

import CheckIns from './CheckIns';
import FourOhFour from 'pages/FourOhFour';
import NewCheckIn from './pages/NewCheckIn';
import CheckInDetails from './pages/CheckInDetails';
import EditCheckIn from './pages/EditCheckIn';

import { PastCheckInProvider } from 'contexts/PastCheckInContext';

export default () => (
  <PastCheckInProvider>
    <Switch>
      <Route exact path="/checkins" component={CheckIns} />
      <Route exact path="/checkins/new" component={NewCheckIn} />
      <Route exact path="/checkins/:checkin_id" component={CheckInDetails} />
      <Route exact path="/checkins/:checkin_id/edit" component={EditCheckIn} />
      <Route exact path="/checkins/:checkin_id/:past_checkin_id" component={CheckInDetails} />
      <Route component={FourOhFour} />
    </Switch>
  </PastCheckInProvider>
);
