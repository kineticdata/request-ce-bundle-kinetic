import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { withRouter } from 'react-router';

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
  popupBlocked,
}) => (
  <Fragment>
    <form className="login-form-container" onSubmit={handleLogin}>
      <h3>
        Sign In
        <small>
          <a role="button" tabIndex="0" onClick={toCreateAccount(routed)}>
            Create Account
          </a>
        </small>
      </h3>
      {popupBlocked ? (
        <h3>
          <span className="text-danger">Our pop-up window was blocked.</span>
        </h3>
      ) : null}
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
  </Fragment>
);

export const LoginForm = compose(
  withRouter,
  withState('windowHandle', 'setWindowHandle', null),
)(Login);
