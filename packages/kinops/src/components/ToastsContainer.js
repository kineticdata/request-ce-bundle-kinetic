import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import SVGInline from 'react-svg-inline';
import timesIcon from 'font-awesome-svg-png/white/svg/times.svg';
import { actions } from '../redux/modules/toasts';

const defaultTitle = {
  success: 'Success',
  info: 'Info',
  warn: 'Warning',
  error: 'Error',
  normal: 'Info',
};

const Toast = ({ toast, dismiss }) => (
  <div className={`toast ${toast.type}`}>
    <div className="message">
      <div className="headline-copy">
        {toast.title || defaultTitle[toast.type]}
      </div>
      {toast.msg}
    </div>
    <div className="actions">
      <button className="btn btn-link" onClick={dismiss}>
        <SVGInline svg={timesIcon} className="icon" />
      </button>
    </div>
  </div>
);

const Toasts = ({ toasts, dismiss }) => (
  <div className="toasts">
    {toasts.map(n => <Toast key={n.id} toast={n} dismiss={dismiss(n.id)} />)}
  </div>
);

const mapStateToProps = state => ({
  toasts: state.toasts.notifications,
});

const mapDispatchToProps = {
  removeNotification: actions.removeNotification,
};

export const ToastsContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    dismiss: ({ removeNotification }) => id => () => removeNotification(id),
  }),
)(Toasts);
