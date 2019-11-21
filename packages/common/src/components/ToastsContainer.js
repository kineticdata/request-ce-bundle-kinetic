import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { actions } from '../redux/modules/toasts';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from '@kineticdata/react';
const {
  removeToast,
  clearToasts,
  removeToastAlert,
  setToastDuration,
  resolveConfirm,
} = actions;

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
    {toast.message && (
      <div className="toast__message">
        <I18n>{toast.message}</I18n>
      </div>
    )}
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
                onClick={() => {
                  a.onClick();
                  dismiss();
                }}
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

const ConfirmationModalComponent = props => {
  if (props.confirm === null) {
    return null;
  }

  const {
    size = 'md',
    title = 'Confirm Action',
    body = 'Are you sure you want to proceed?',
    actionName = 'OK',
    actionType = 'success',
    confirmationText,
    confirmationTextLabel = 'text',
  } = props.confirm;

  const ok = () => props.resolveConfirm(true);
  const cancel = () => props.resolveConfirm(false);

  const renderBody = body =>
    typeof body === 'function' ? (
      <I18n render={translate => body(translate)} />
    ) : (
      <I18n>{body}</I18n>
    );

  return (
    <Modal isOpen={true} toggle={cancel} size={size}>
      <div className="modal-header">
        <h4 className="modal-title">
          <button className="btn btn-link btn-delete" onClick={cancel}>
            <I18n>Cancel</I18n>
          </button>
          <span>
            <I18n>{title}</I18n>
          </span>
        </h4>
      </div>
      <ModalBody className="p-3">
        {renderBody(body)}
        {confirmationText && (
          <Fragment>
            <p>
              <I18n
                render={translate => (
                  <Fragment>
                    {translate('Please enter the %s below to confirm.').replace(
                      '%s',
                      `${translate(
                        confirmationTextLabel,
                      )} (${confirmationText})`,
                    )}
                  </Fragment>
                )}
              />
            </p>
            <input
              className="form-control"
              type="text"
              value={props.confirmationValue}
              onChange={e => props.setConfirmationValue(e.target.value)}
            />
          </Fragment>
        )}
      </ModalBody>
      <ModalFooter className="modal-footer--full-width">
        <button
          className={`btn btn-${actionType}`}
          onClick={ok}
          disabled={
            confirmationText && props.confirmationValue !== confirmationText
          }
        >
          <I18n>{actionName}</I18n>
        </button>
      </ModalFooter>
    </Modal>
  );
};

const ConfirmationModal = compose(
  connect(
    null,
    { resolveConfirm },
  ),
  withState('confirmationValue', 'setConfirmationValue', ''),
)(ConfirmationModalComponent);

export const ToastsContainer = compose(
  connect(
    ({ toasts }) => ({
      toasts: toasts.list,
      toastAlerts: toasts.alerts,
      confirm: toasts.confirm,
    }),
    { setToastDuration, clearToasts },
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
    componentWillUnmount() {
      this.props.clearToasts();
    },
  }),
)(({ toasts, toastAlerts, confirm }) => (
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
    {confirm && <ConfirmationModal confirm={confirm} />}
  </Fragment>
));

export const LocalToast = compose(
  connect(({ toasts: { duration } }) => ({ duration })),
  withState('showing', 'setShowing', ''),
  withState('timeoutId', 'setTimeoutId', null),
  withHandlers({
    dismiss: ({ toast, setShowing }) => () => {
      setShowing('');
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

export const LocalToastsContainer = props => (
  <div className="toasts">{props.children}</div>
);
