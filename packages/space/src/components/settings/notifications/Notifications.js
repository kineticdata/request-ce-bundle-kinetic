import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Notification } from './Notification';
import { DateFormat } from './DateFormat';
import { NotificationsList } from './NotificationsList';

export const Notifications = ({ match }) => (
  <Switch>
    <Route path={`${match.path}/date-formats/:id`} component={DateFormat} />
    <Route path={`${match.path}/:type/:id`} component={Notification} />
    <Route path={`${match.path}/:type`} component={NotificationsList} />
    <Route render={() => <Redirect to={`${match.path}/templates`} />} />
  </Switch>
);
