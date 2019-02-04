import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { I18n } from '../../I18nProvider';

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
        <I18n>Sign In</I18n>
        <small>
          <Link to={`/create-account${invitationToken ? location.search : ''}`}>
            <I18n>Create Account</I18n>
          </Link>
        </small>
      </h3>
      {popupBlocked ? (
        <h3>
          <span className="text-danger">
            <I18n>Our pop-up window was blocked.</I18n>
          </span>
        </h3>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
            value={email}
            onChange={handleEmail}
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
            value={password}
            onChange={handlePassword}
          />
        </div>
        <span className="text-danger">
          <I18n>{error || ' '}</I18n>
        </span>
      </div>
      <div className="button-group">
        <button className="btn btn-primary">
          <I18n>Sign In</I18n>
        </button>
        <hr />
        <Link
          className="btn btn-link"
          to={`/reset-password${invitationToken ? location.search : ''}`}
        >
          <I18n>Reset Password</I18n>
        </Link>
      </div>
    </form>
  </Fragment>
);

export const LoginForm = compose(
  withState('windowHandle', 'setWindowHandle', null),
)(Login);
