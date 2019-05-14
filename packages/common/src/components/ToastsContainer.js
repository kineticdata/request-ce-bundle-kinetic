import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { actions } from '../redux/modules/toasts';
import { I18n } from '@kineticdata/react';
const { removeToast, removeToastAlert, setToastDuration } = actions;

const icon = {
  success: 'check-circle',
  info: 'info-circle',
  warning: 'exclamation-triangle',
  danger: 'exclamation-circle',
};

const ToastComponent = ({ toast, dismiss, showing, duration }) => (
  <div className={`toast toast--${toast.severity} ${showing}`}>
    <div className="toast__icon">
      <span className={`fa fa-${icon[toast.severity]}`} />
    </div>
    <div className="toast__message">
      <I18n>{toast.message}</I18n>
    </div>
    <div className="toast__close">
      <span className="fa fa-fw fa-times" role="button" onClick={dismiss} />
    </div>
  </div>
);

const Toast = compose(
  connect(
    ({ toasts: { duration } }) => ({ duration }),
    { removeToast },
  ),
  withState('showing', 'setShowing', ''),
  withState('timeoutId', 'setTimeoutId', null),
  withHandlers({
    dismiss: ({ toast, removeToast, setShowing }) => () => {
      // Hide and then remove after 300ms to allow time for animation
      setShowing('');
      setTimeout(() => removeToast(toast.id), 300);
    },
  }),
  lifecycle({
    componentDidMount() {
      // Delay by 100ms to make sure component renders before showing is set
      // to true to make the animation work
      setTimeout(() => this.props.setShowing('showing'), 100);
      this.props.setTimeoutId(
        setTimeout(this.props.dismiss, this.props.duration),
      );
    },
    componentWillUnmount() {
      clearTimeout(this.props.timeoutId);
    },
  }),
)(ToastComponent);

const ToastAlertComponent = ({ alert, dismiss, showing }) => (
  <div className={`toast-alert toast-alert--${alert.severity} ${showing}`}>
    <div className="toast-alert__content">
      {alert.title && (
        <div className="toast-alert__title">
          <I18n>{alert.title}</I18n>
        </div>
      )}
      {alert.message && (
        <div className="toast-alert__message">
          <I18n>{alert.message}</I18n>
        </div>
      )}
      {alert.actions && (
        <div className="toast-alert__actions">
          <div className="btn-group" role="group">
            {alert.actions.map((a, i) => (
              <button
                key={`action-${i}`}
                className={`btn btn-sm btn-outline-dark`}
                onClick={a.onClick}
              >
                <I18n>{a.label}</I18n>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    <div className="toast-alert__close">
      <span className="fa fa-fw fa-times" role="button" onClick={dismiss} />
    </div>
  </div>
);

const ToastAlert = compose(
  connect(
    null,
    { removeToastAlert },
  ),
  withState('showing', 'setShowing', ''),
  withState('timeoutId', 'setTimeoutId', null),
  withHandlers({
    dismiss: ({ alert, removeToastAlert, setShowing }) => () => {
      setShowing('');
      setTimeout(() => removeToastAlert(alert.id), 300);
    },
  }),
  lifecycle({
    componentDidMount() {
      // Delay by 100ms to make sure component renders before showing is set
      // to true to make the animation work
      setTimeout(() => this.props.setShowing('showing'), 100);
      if (this.props.alert.duration) {
        this.props.setTimeoutId(
          setTimeout(this.props.dismiss, this.props.alert.duration),
        );
      }
    },
    componentDidUpdate(prevProps) {
      // If remove prop was set to true, call dismiss to close old alert
      if (this.props.remove && !prevProps.remove) {
        this.props.dismiss();
        // setTimeout(() => this.props.dismiss(), 100);
      }
    },
    componentWillUnmount() {
      clearTimeout(this.props.timeoutId);
    },
  }),
)(ToastAlertComponent);

export const ToastsContainer = compose(
  connect(
    ({ toasts }) => ({ toasts: toasts.list, toastAlerts: toasts.alerts }),
    { setToastDuration },
  ),
  lifecycle({
    componentDidMount() {
      // Set duration for all toasts in redux
      this.props.setToastDuration(
        Math.min(
          Math.max(parseInt(this.props.duration, 10), 1000) || 3000,
          30000,
        ),
      );
    },
  }),
)(({ toasts, toastAlerts }) => (
  <Fragment>
    <div className="toasts">
      {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
    </div>
    <div className="toast-alerts">
      {toastAlerts.map((alert, i) => (
        <ToastAlert
          key={alert.id}
          alert={alert}
          // Remove if this alert is not the most recent one
          remove={toastAlerts.size > i + 1}
        />
      ))}
    </div>
  </Fragment>
));
