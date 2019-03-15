import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { bundle } from '@kineticdata/react';

import { OAuthPopup } from './OAuthPopup';
import { RetrieveJwtIframe } from './RetrieveJwtIframe';

import { login } from '../../utils/authentication';
import { actions } from '../../redux/modules/auth';
import { I18n } from '../../I18nProvider';

const PopupForm = props => (
  <Fragment>
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={props.cancelled}
        >
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>Sign In</I18n>
        </span>
        <span />
      </h4>
    </div>
    <div className="login-form-container">
      <ModalBody>
        {props.popupBlocked && (
          <h3>
            <span className="text-danger">
              <I18n>Our pop-up window was blocked.</I18n>
            </span>
          </h3>
        )}
        <h3>
          <span>
            <I18n>Authenticate with your provider.</I18n>
          </span>
        </h3>
      </ModalBody>
    </div>
    <ModalFooter>
      <button
        type="button"
        className="btn btn-primary"
        onClick={props.openPopup}
      >
        <I18n>Open Login Popup</I18n>
      </button>
    </ModalFooter>
    <OAuthPopup
      ref={props.setPopupRef}
      onSuccess={props.handleAuthSuccess}
      onPopupBlocked={props.setPopupBlocked}
    />
  </Fragment>
);

const LoginForm = props => (
  <Fragment>
    <div className="modal-header">
      <h4 className="modal-title">
        <button
          type="button"
          className="btn btn-link"
          onClick={props.cancelled}
        >
          <I18n>Cancel</I18n>
        </button>
        <span>
          <I18n>Sign In</I18n>
        </span>
        <span />
      </h4>
    </div>
    {props.popupBlocked ? (
      <h3>
        <span className="text-danger">
          <I18n>Our pop-up window was blocked.</I18n>
        </span>
      </h3>
    ) : null}
    <form className="login-form-container" onSubmit={props.handleLogin}>
      <ModalBody>
        <div className="form-group">
          <label htmlFor="email">
            <I18n>Email Address</I18n>
          </label>
          <input
            type="text"
            autoFocus
            className="form-control"
            id="email"
            placeholder="wally@kineticdata.com"
            value={props.email}
            onChange={props.handleEmail}
            ref={props.setEmailEl}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <I18n>Password</I18n>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="password"
            value={props.password}
            onChange={props.handlePassword}
          />
        </div>
        <span className="text-danger">
          <I18n>{props.error || ' '}</I18n>
        </span>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary">
          <I18n>Sign In</I18n>
        </button>
      </ModalFooter>
    </form>
  </Fragment>
);

export const LoginModalComponent = props =>
  props.showing && (
    <Fragment>
      <Modal isOpen toggle={props.cancelled} size="lg">
        {props.authenticated && !props.receivedToken ? (
          <RetrieveJwtIframe onSuccess={props.handleAuthSuccess} />
        ) : bundle.config.loginPopup ? (
          <PopupForm {...props} />
        ) : (
          <LoginForm {...props} />
        )}
      </Modal>
      )}
    </Fragment>
  );

export const mapStateToProps = state => ({
  showing: state.app.auth.modalLogin,
  // token: state.discussions.socket.token,
});

const mapDispatchToProps = {
  cancelled: actions.modalLoginCancelled,
  success: actions.modalLoginSuccess,
  setToken: actions.setToken,
};

const handleLogin = props => event => {
  event.preventDefault();
  login(props.email, props.password)
    .then(() => props.setAuthenticated(true))
    .catch(props.handleAuthError);
};

export const LoginModal = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('authenticated', 'setAuthenticated', false),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('error', 'setError', ''),
  withState('popupBlocked', 'setPopupBlocked', false),
  withState('receivedToken', 'setReceivedToken', false),
  withHandlers({
    handleEmail: props => event => props.setEmail(event.target.value),
    handlePassword: props => event => props.setPassword(event.target.value),
    handleAuthError: props => error => {
      props.setError(error.response.data.error);
      props.setPassword('');
    },
    handleAuthSuccess: props => token => {
      if (token) {
        props.setToken(token);
        props.setReceivedToken(true);
      }
      props.success();
    },
  }),
  withHandlers({ handleLogin }),
  withHandlers(() => {
    let emailEl = null;
    let popupEl = null;
    return {
      setEmailEl: () => el => {
        emailEl = el;
      },
      focusEmailEl: () => () => {
        if (emailEl) {
          emailEl.focus();
        }
      },
      setPopupRef: () => el => {
        popupEl = el;
      },
      popupRef: () => () => popupEl,
      openPopup: () => () => {
        popupEl.openPopup();
      },
    };
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.showing && !nextProps.showing) {
        this.props.setEmail('');
        this.props.setPassword('');
        this.props.setError('');
      }
    },
    componentDidUpdate(prevProps) {
      if (this.props.showing && !prevProps.showing) {
        this.props.focusEmailEl();
      }
    },
  }),
)(LoginModalComponent);
