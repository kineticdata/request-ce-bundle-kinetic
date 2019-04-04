import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from '@reach/router';

import { Router } from '../../../SpaceApp';
import { Notification } from './Notification';
import { DateFormat } from './DateFormat';
import { NotificationsNotFound } from './NotificationsNotFound';
import { NotificationsList } from './NotificationsList';
import {
  NOTIFICATIONS_FORM_SLUG,
  NOTIFICATIONS_DATE_FORMAT_FORM_SLUG,
} from '../../../redux/modules/settingsNotifications';
import { context } from '../../../redux/store';

export const NotificationsComponent = ({ appLocation, showNotifications }) =>
  showNotifications ? (
    <Router>
      <DateFormat path="date-formats/:id" />
      <Notification path=":type/:id" />
      <NotificationsList path=":type" />
      <Redirect
        from="/"
        to={`${appLocation}/settings/notifications/templates`}
        noThrow
      />
    </Router>
  ) : (
    <NotificationsNotFound />
  );

export const mapStateToProps = state => ({
  showNotifications:
    state.settingsDatastore.forms
      .map(form => form.slug)
      .toSet()
      .intersect([NOTIFICATIONS_FORM_SLUG, NOTIFICATIONS_DATE_FORMAT_FORM_SLUG])
      .size === 2,
  appLocation: state.app.location,
});

export const Notifications = connect(
  mapStateToProps,
  null,
  null,
  { context },
)(NotificationsComponent);
