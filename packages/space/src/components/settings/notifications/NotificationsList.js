import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { NotificationListItem } from './NotificationListItem';
import wallyHappyImage from 'common/src/assets/images/wally-happy.svg';

import { actions } from '../../../redux/modules/settingsNotifications';

const WallyNoResultsFoundMessage = ({ type }) => {
  return (
    <div className="wally-empty-state">
      <h5>No Notification {type}s Found</h5>
      <img src={wallyHappyImage} alt="Happy Wally" />
      <h6>Add some {type}s by hitting the new button!</h6>
    </div>
  );
};

const NotificationsListComponent = ({
  notifications,
  notificationType,
}) => (
  <div className="datastore-container">
    <div className="datastore-content pane">
      <div className="page-title-wrapper">
        <div className="page-title">
          <h3>
            <Link to="/">home</Link> /{` `}
            <Link to="/settings">settings</Link> /{` `}
          </h3>
          <h1>Notifications</h1>
        </div>
        <Link
          to={`/settings/notifications/new`}
          className="btn btn-primary"
        >
          Create New {notificationType}
        </Link>
      </div>
      <div>
        {notifications.size > 0 ? (
          <table className="table table-sm table-hover table-datastore">
            <thead className="d-none d-md-table-header-group">
              <tr>
                <th className="d-sm-none d-md-table-cell">Name</th>
                <th>Status</th>
                <th>Subject</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <NotificationListItem key={`trow-${n.id}`} notification={n} />
              ))}
            </tbody>
          </table>
        ) : (
          <WallyNoResultsFoundMessage type={notificationType} />
        )}
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  loading: state.settingsNotifications.loading,
  notifications: state.settingsNotifications.notifications,
  notificationType: state.settingsNotifications.notificationType,
});

export const mapDispatchToProps = {
  fetchNotifications: actions.fetchNotifications,
  setNotificationType: actions.setNotificaitonType,
};

export const NotificationsList = compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NotificationsListComponent);
