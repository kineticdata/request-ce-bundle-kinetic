import React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { withRouter } from 'react-router';
import { login } from '../../utils/authentication';

const coreOauthAuthorizeUrl = location => {
  console.log(location);
  const clientId = 'kinops';
  const state = location.pathname;
  return `/app/oauth/authorize?client_id=${clientId}&response_type=code&state=${state}`;
};

export const Login = ({
  handleLogin,
  toResetPassword,
  toCreateAccount,
  email,
  password,
  handleEmail,
  handlePassword,
  error,
  routed,
  location,
}) => (
  <form className="login-form-container" onSubmit={handleLogin}>
    <h3>
      Sign In
      <small>
        <a href={coreOauthAuthorizeUrl(location)}>Login with Kinops</a>
        {' or '}
        <a role="button" tabIndex="0" onClick={toCreateAccount(routed)}>
          Create Account
        </a>
      </small>
    </h3>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          autoFocus
          className="form-control"
          id="email"
          placeholder="wally@kineticdata.com"
          value={email}
          onChange={handleEmail}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="password"
          value={password}
          onChange={handlePassword}
        />
      </div>
      <span className="text-danger">{error || ' '}</span>
    </div>
    <div className="button-group">
      <button className="btn btn-primary">Sign In</button>
      <hr />
      <button
        type="button"
        className="btn btn-link"
        onClick={toResetPassword(routed)}
      >
        Reset Password
      </button>
    </div>
  </form>
);

const handleLogin = ({ tryAuthentication, email, password }) => e => {
  e.preventDefault();
  tryAuthentication(email, password);
};
const tryAuthentication = ({
  setError,
  setPassword,
  handleAuthenticated,
  routed,
  push,
}) => async (username, password) => {
  try {
    await login(username, password);

    handleAuthenticated();

    if (routed) {
      push('/');
    }
  } catch (error) {
    setError('Invalid username or password.');
    setPassword('');
  }
};

export const LoginForm = compose(
  withRouter,
  withState('windowHandle', 'setWindowHandle', null),
  withState('popupBlocked', 'setPopupBlocked', false),
  withHandlers({
    tryAuthentication,
  }),
  withHandlers({
    handleLogin,
  }),
  lifecycle({
    componentDidMount() {
      const windowHandle = window.open(
        coreOauthAuthorizeUrl(this.props.location),
        'KINOPS_WindowName',
        'menubar=no,location=no,resizable=yes,status=yes',
      );

      if (windowHandle) {
        window.__OAUTH_CALLBACK__ = token => {
          window.console.log(token);
          localStorage.setItem('token', token);
          windowHandle.close();
          this.props.setAuthenticated(true);
          this.props.setToken(token);
        };
      } else {
        this.props.setPopupBlocked(true);
      }

      console.log(windowHandle);
    },
  }),
)(Login);
