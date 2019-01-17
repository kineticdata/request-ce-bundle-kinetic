import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../../redux/modules/errors';
import { I18n } from '../../../../app/src/I18nProvider';

const defaultTitle = {
  success: 'Success',
  info: 'Info',
  warn: 'Warning',
  error: 'Error',
  normal: 'Info',
};

const Notification = ({ notification, dismiss }) => (
  <div className={`notification ${notification.type}`}>
    <div className="message">
      <div className="headline-copy">
        <I18n>{notification.title || defaultTitle[notification.type]}</I18n>
      </div>
      <I18n>{notification.msg}</I18n>
    </div>
    <div className="actions">
      <button className="btn btn-link" onClick={dismiss}>
        <span className="fa fa-fw fa-times" />
      </button>
    </div>
  </div>
);

const NotificationsComponent = ({ notifications, dismiss }) => (
  <div className="notifications">
    {notifications.map(n => (
      <Notification key={n.id} notification={n} dismiss={dismiss(n.id)} />
    ))}
  </div>
);

const mapStateToProps = state => ({
  notifications: state.space.errors.notifications,
});

const mapDispatchToProps = {
  removeNotification: actions.removeNotification,
};

export const Notifications = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    dismiss: ({ removeNotification }) => id => () => removeNotification(id),
  }),
)(NotificationsComponent);
