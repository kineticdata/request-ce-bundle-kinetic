import React from 'react';
import { connect } from '../redux/store';
import { compose, withHandlers } from 'recompose';
import isarray from 'isarray';
import { actions } from '../redux/modules/toasts';
import { I18n } from '@kineticdata/react';

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
        <I18n
          render={translate =>
            toast.title
              ? isarray(toast.title)
                ? toast.title.map(t => translate(t)).join(' ')
                : translate(toast.title)
              : translate(defaultTitle[toast.type])
          }
        />
        {toast.dismissible && (
          <div className="toast__actions">
            <button className="btn btn-link" onClick={dismiss}>
              <i className="fa fa-fw fa-times" />
            </button>
          </div>
        )}
      </span>
      <div className="toast__message">
        <I18n
          render={translate =>
            isarray(toast.msg)
              ? toast.msg.map(m => translate(m)).join(' ')
              : translate(toast.msg)
          }
        />
      </div>
    </div>
  </div>
);

const Toasts = ({ toasts, dismiss }) => (
  <div className="toasts">
    {toasts.map(n => <Toast key={n.id} toast={n} dismiss={dismiss(n.id)} />)}
  </div>
);

const mapStateToProps = state => ({
  toasts: state.toasts,
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
