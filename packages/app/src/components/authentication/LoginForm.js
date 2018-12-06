import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { Link } from 'react-router-dom';

export const Login = ({
  invitationToken,
  location,
  handleLogin,
  email,
  password,
  handleEmail,
  handlePassword,
  error,
  popupBlocked,
}) => (
  <Fragment>
    <form className="login-form-container" onSubmit={handleLogin}>
      <h3>
        Sign In
        <small>
          <Link to={`/create-account${invitationToken ? location.search : ''}`}>
            Create Account
          </Link>
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
        <Link
          className="btn btn-link"
          to={`/reset-password${invitationToken ? location.search : ''}`}
        >
          Reset Password
        </Link>
      </div>
    </form>
  </Fragment>
);

export const LoginForm = compose(
  withState('windowHandle', 'setWindowHandle', null),
)(Login);
