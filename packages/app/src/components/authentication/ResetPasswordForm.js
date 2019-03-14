import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import { createSubmission } from '@kineticdata/react';
import { I18n } from '../../I18nProvider';

const ResetPassword = ({
  handleResetPassword,
  email,
  handleEmail,
  showConfirmation,
  error,
  invitationToken,
  location,
}) =>
  showConfirmation ? (
    <div className="login-form-container">
      <h3 className="form-title">
        <I18n>Password Reset Requested</I18n>
      </h3>
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
  ) : (
    <form className="login-form-container" onSubmit={handleResetPassword}>
      <div>
        <h3 className="form-title">
          <I18n>Reset Password</I18n>
        </h3>
        <div className="form-group">
          <label htmlFor="email">
            <I18n>Email Address</I18n>
          </label>
          <input
            type="text"
            id="email"
            autoFocus
            className="form-control"
            placeholder="wally@kineticdata.com"
            value={email}
            onChange={handleEmail}
          />
        </div>
        <span className="text-danger">{error}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button type="submit" className="btn btn-primary">
          <I18n>Reset</I18n>
        </button>
        <hr />
        <Link
          className="btn btn-link"
          to={`/login${invitationToken ? location.search : ''}`}
        >
          &larr; <I18n>Back to Sign In</I18n>
        </Link>
      </div>
    </form>
  );

const handleResetPassword = ({
  email,
  setError,
  setShowConfirmation,
}) => async e => {
  e.preventDefault();

  try {
    await createSubmission({
      kappSlug: 'admin',
      formSlug: 'account-password-reset',
      values: {
        Username: email,
        'Display Name': null,
        'Password Reset URL': null,
      },
      authAssumed: false,
    });

    setShowConfirmation(true);
  } catch (_) {
    setError(
      'There was a problem requesting a password reset, try again later.',
    );
  }
};

export const ResetPasswordForm = compose(
  withState('error', 'setError', ''),
  withState('showConfirmation', 'setShowConfirmation', false),
  withHandlers({
    handleResetPassword,
  }),
)(ResetPassword);
