import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Notification } from './Notification';
import { DateFormat } from './DateFormat';
import { NotificationsNotFound } from './NotificationsNotFound';
import { NotificationsList } from './NotificationsList';
import {
  NOTIFICATIONS_FORM_SLUG,
  NOTIFICATIONS_DATE_FORMAT_FORM_SLUG,
} from '../../../redux/modules/settingsNotifications';

export const NotificationsComponent = ({ match, showNotifications }) =>
  showNotifications ? (
    <Switch>
      <Route path={`${match.path}/date-formats/:id`} component={DateFormat} />
      <Route path={`${match.path}/:type/:id`} component={Notification} />
      <Route path={`${match.path}/:type`} component={NotificationsList} />
      <Route render={() => <Redirect to={`${match.path}/templates`} />} />
    </Switch>
  ) : (
    <NotificationsNotFound />
  );

export const mapStateToProps = state => ({
  showNotifications:
    state.space.settingsDatastore.forms
      .map(form => form.slug)
      .toSet()
      .intersect([NOTIFICATIONS_FORM_SLUG, NOTIFICATIONS_DATE_FORMAT_FORM_SLUG])
      .size === 2,
});

export const Notifications = connect(mapStateToProps)(NotificationsComponent);
