import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Notification } from './Notification';
import { NotificationsList } from './NotificationsList';
import { actions } from '../../../redux/modules/settingsNotifications';


export const NotificationsRouter = ({ match, loading }) =>
  !loading && (
    <Switch>
      <Route
        exact
        path={`${match.path}/new`}
        component={Notification}
      />
      <Route
        exact
        path={`${match.path}/:id`}
        component={Notification}
      />
      <Route
        exact
        path={`${match.path}/:id/:mode`}
        component={Notification}
      />
      <Route component={NotificationsList} />
    </Switch>
  );

export const mapStateToProps = state => ({
  loading: state.settingsNotifications.loading,
});

export const mapDispatchToProps = {
  fetchNotifications: actions.fetchNotifications,
};

export const Notifications = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchNotifications();
    },
  }),
)(NotificationsRouter);
