import React from 'react';
import { Switch, Route } from 'react-router-dom';

import FourOhFour from 'pages/FourOhFour';

import RequireAuth from 'HOC/RequireAuth';
import LoadableComponent from 'config/LoadableComponent';
import { PastCheckInProvider } from 'contexts/PastCheckInContext';
import { CheckInScheduleProvider } from 'contexts/CheckInScheduleContext';

const CheckIns = LoadableComponent({ componentPathName: 'pages/CheckIns/CheckIns' });
const NewCheckIn = LoadableComponent({ componentPathName: 'pages/CheckIns/pages/NewCheckIn' });
const CheckInDetails = LoadableComponent({ componentPathName: 'pages/CheckIns/pages/CheckInDetails' });
const EditCheckIn = LoadableComponent({ componentPathName: 'pages/CheckIns/pages/EditCheckIn' });

CheckIns.preload();
NewCheckIn.preload();
CheckInDetails.preload();
EditCheckIn.preload();

export default () => (
  <CheckInScheduleProvider>
    <PastCheckInProvider>
      <Switch>
        <Route exact path="/checkins" component={RequireAuth(CheckIns)} />
        <Route exact path="/checkins/new" component={NewCheckIn} />
        <Route exact path="/checkins/:checkin_id" component={CheckInDetails} />
        <Route exact path="/checkins/:checkin_id/edit" component={EditCheckIn} />
        <Route exact path="/checkins/:checkin_id/:past_checkin_id" component={CheckInDetails} />
        <Route component={FourOhFour} />
      </Switch>
    </PastCheckInProvider>
  </CheckInScheduleProvider>
);
