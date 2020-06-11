import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { useLocation, useParams, Link } from 'react-router-dom';
import { bundle, createSubmission, I18n } from '@kineticdata/react';
import { parse, stringify } from 'query-string';
import axios from 'axios';
import { LoginWrapper } from './LoginWrapper';
import { Helmet } from 'react-helmet';

export const ResetPassword = () => {
  let location = useLocation();
  let { token } = useParams();
  return (
    <LoginWrapper>
      <Helmet>
        <title>Reset Password | kinops</title>
      </Helmet>
      {token ? (
        <ResetPasswordForm token={token} username={parse(location.search).u}>
          {({ fields, buttons, messages }) => (
            <>
              <h3>
                <I18n>Request Password Reset</I18n>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {fields.username}
                {fields.password}
                {fields.confirmPassword}
                {messages.validations}
                {messages.error}
              </div>
              <div className="button-group">
                {buttons.reset}
                <hr />
                <Link className="btn btn-link" to={`/login${location.search}`}>
                  &larr; <I18n>Back to Sign In</I18n>
                </Link>
              </div>
            </>
          )}
        </ResetPasswordForm>
      ) : (
        <ResetPasswordRequestForm>
          {({ fields, buttons, messages }) => (
            <>
              <h3>
                <I18n>Reset Password</I18n>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {fields.username}
                {messages.error}
                {messages.success}
              </div>
              <div className="button-group">
                {buttons.reset}
                <hr />
                <Link className="btn btn-link" to={`/login${location.search}`}>
                  &larr; <I18n>Back to Sign In</I18n>
                </Link>
              </div>
            </>
          )}
        </ResetPasswordRequestForm>
      )}
    </LoginWrapper>
  );
};

const ResetPasswordRequestForm = ({ children }) => {
  let [pending, setPending] = useState(false);
  let [success, setSuccess] = useState(false);
  let [error, setError] = useState(null);
  let [username, setUsername] = useState('');

  const handleResetRequest = useCallback(
    async e => {
      e.preventDefault();
      setPending(true);
      setSuccess(false);
      setError(null);
      try {
        const response = await createSubmission({
          kappSlug: 'admin',
          formSlug: 'account-password-reset',
          values: {
            Username: username,
            'Display Name': null,
            'Password Reset URL': null,
          },
          public: true,
        });

        setPending(false);
        if (response.error) {
          setError(
            response.error.fieldConstraintViolations &&
            response.error.fieldConstraintViolations['Username']
              ? 'You must enter a valid email address.'
              : 'There was a problem requesting a password reset, try again later.',
          );
        } else {
          setSuccess(username);
        }
      } catch (_) {
        setPending(false);
        setError(
          'There was a problem requesting a password reset, try again later.',
        );
      }
    },
    [username, setError, setPending, setSuccess],
  );

  const fields = {
    username: (
      <div className="form-group">
        <label htmlFor="username" className="required">
          <I18n>Email Address</I18n>
        </label>
        <input
          type="text"
          autoFocus
          className="form-control"
          id="username"
          placeholder="wally@kineticdata.com"
          value={username}
          onChange={e => setUsername(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
  };
  const buttons = {
    reset: (
      <button
        className="btn btn-primary"
        type="submit"
        disabled={pending || !username || success === username}
      >
        <I18n>Request Reset</I18n>
      </button>
    ),
  };
  const messages = {
    error: error && (
      <div className="text-danger">
        <I18n>{error}</I18n>
      </div>
    ),
    success: success && (
      <div className="text-info">
        <p>
          <strong>
            <I18n>Password reset successfully requested.</I18n>
          </strong>
        </p>
        <p>
          <I18n>
            In a few moments you should receive an email which will allow you to
            reset your password.
          </I18n>
        </p>
        <p>
          <I18n>
            If you don't receieve an email, contact your kinops administrator.
          </I18n>
        </p>
      </div>
    ),
  };

  return (
    <form className="login-form-container" onSubmit={handleResetRequest}>
      {typeof children === 'function' ? (
        children({ fields, buttons, messages })
      ) : (
        <>
          <div>{Object.values(fields)}</div>
          <div>{Object.values(messages)}</div>
          <div>{Object.values(buttons)}</div>
        </>
      )}
    </form>
  );
};

const ResetPasswordForm = connect(
  null,
  { push },
)(({ push, token, username, children }) => {
  let [pending, setPending] = useState(false);
  let [error, setError] = useState(null);
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [confirmBlurred, setConfirmBlurred] = useState(false);

  const handleReset = useCallback(
    async e => {
      e.preventDefault();
      setPending(true);
      setError(null);

      try {
        const data = stringify({
          username,
          token,
          password,
          confirmPassword,
        });

        await axios.request({
          method: 'post',
          url: `${bundle.spaceLocation()}/app/reset-password/token`,
          data,
        });
      } catch (error) {
        if (error.response.status !== 302) {
          setError(
            'There was a problem resetting your password! Please note that password reset links may only be used once.',
          );
          return;
        }
      }
      push('/login');
    },
    [username, password, confirmPassword, token, setError, setPending, push],
  );

  const fields = {
    username: (
      <div className="form-group">
        <label htmlFor="email">
          <I18n>Email Address</I18n>
        </label>
        <span className="form-control-static">{username}</span>
      </div>
    ),
    password: (
      <div className="form-group">
        <label htmlFor="password" className="required">
          <I18n>New Password</I18n>
        </label>
        <input
          type="password"
          autoFocus
          className="form-control"
          id="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    confirmPassword: (
      <div className="form-group">
        <label htmlFor="password" className="required">
          <I18n>Confirm Password</I18n>
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmBlurred(true)}
          aria-required="true"
        />
      </div>
    ),
  };
  const buttons = {
    reset: (
      <button
        className="btn btn-primary"
        type="submit"
        disabled={pending || password !== confirmPassword || !password}
      >
        <I18n>Reset</I18n>
      </button>
    ),
  };
  const messages = {
    validations: password !== confirmPassword &&
      (password || confirmPassword) &&
      confirmBlurred && (
        <div className="text-danger">
          <I18n>Passwords must match.</I18n>
        </div>
      ),
    error: error && (
      <div className="text-danger">
        <I18n>{error}</I18n>
      </div>
    ),
  };

  return (
    <form className="login-form-container" onSubmit={handleReset}>
      {typeof children === 'function' ? (
        children({ fields, buttons, messages })
      ) : (
        <>
          <div>{Object.values(fields)}</div>
          <div>{Object.values(messages)}</div>
          <div>{Object.values(buttons)}</div>
        </>
      )}
    </form>
  );
});
