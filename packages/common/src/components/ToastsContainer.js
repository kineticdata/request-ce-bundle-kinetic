import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actions } from '../redux/modules/toasts';

const defaultTitle = {
  success: 'Success',
  info: 'Info',
  warn: 'Warning',
  error: 'Error',
  normal: 'Info',
};

const Toast = ({ toast, dismiss }) => (
  <div className={`toast toast--${toast.type} toast--${toast.size || 'large'}`}>
    <div className="toast__wrapper">
      <span className="toast__title">
        {toast.title || defaultTitle[toast.type]}
        {toast.dismissible && (
          <div className="toast__actions">
            <button className="btn btn-link" onClick={dismiss}>
              <i className="fa fa-fw fa-times" />
            </button>
          </div>
        )}
      </span>
      <div className="toast__message"> {toast.msg}</div>
    </div>
  </div>
);

const Toasts = ({ toasts, dismiss }) => (
  <div className="toasts">
    {toasts.map(n => <Toast key={n.id} toast={n} dismiss={dismiss(n.id)} />)}
  </div>
);

const mapStateToProps = state => ({
  toasts: state.common.toasts,
});

const mapDispatchToProps = {
  removeToast: actions.removeToast,
};

export const ToastsContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    dismiss: ({ removeToast }) => id => () => removeToast(id),
  }),
)(Toasts);
