import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { CoreAPI } from 'react-kinetic-core';

const ResetPassword = ({
  handleResetPassword,
  email,
  handleEmail,
  showConfirmation,
  error,
  toSignIn,
  routed,
}) =>
  showConfirmation ? (
    <div className="login-form-container">
      <h3 className="form-title">Password Reset Requested</h3>
      <p>
        In a few moments you should receive an email which will allow you to
        reset your password.
      </p>

      <p>If you don't receieve an email, contact your kinops administrator.</p>
    </div>
  ) : (
    <form className="login-form-container" onSubmit={handleResetPassword}>
      <div>
        <h3 className="form-title">Reset Password</h3>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
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
          Reset
        </button>
        <hr />
        <button
          type="button"
          className="btn btn-link"
          onClick={toSignIn(routed)}
        >
          &larr; Back to Sign In
        </button>
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
    await CoreAPI.createSubmission({
      kappSlug: 'admin',
      formSlug: 'kinops-reset-password',
      values: {
        Username: email,
        'Display Name': null,
        'Password Reset URL': null,
      },
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
