import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { useLocation, Link } from 'react-router-dom';
import { bundle, createSubmission, I18n } from '@kineticdata/react';
import { parse } from 'query-string';
import axios from 'axios';
import { LoginWrapper } from './LoginWrapper';
import Helmet from 'react-helmet';

export const CreateAccount = () => {
  let location = useLocation();
  const { invitationToken, email } = parse(location.search);

  return (
    <LoginWrapper>
      <Helmet>
        <title>Create Account | kinops</title>
      </Helmet>
      {invitationToken ? (
        <CreateAccountForm
          invitationToken={invitationToken}
          email={email}
          location={location}
        >
          {({ fields, buttons, messages }) => (
            <>
              <h3>
                <I18n>Create Account</I18n>
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="form-group__columns">
                  {fields.firstName}
                  {fields.lastName}
                </div>
                {fields.email}
                {fields.password}
                {fields.confirmPassword}
                {messages.validations}
                {messages.error}
              </div>
              <div className="button-group">
                {buttons.submit}
                <hr />
                <Link className="btn btn-link" to={`/login${location.search}`}>
                  <I18n>Already have an account? Sign In</I18n>
                </Link>
              </div>
            </>
          )}
        </CreateAccountForm>
      ) : (
        <RequestAccountForm email={email}>
          {({ fields, buttons, messages }) => (
            <>
              <h3>
                <I18n>Get Started</I18n>
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {messages.success || (
                  <>
                    <div className="form-group__columns">
                      {fields.firstName}
                      {fields.lastName}
                    </div>
                    {fields.email}
                    {fields.phoneNumber}
                    {fields.comments}
                    {messages.error}
                  </>
                )}
              </div>
              <div className="button-group">
                {buttons.submit}
                <hr />
                <Link className="btn btn-link" to={`/login${location.search}`}>
                  &larr; <I18n>Back to Sign In</I18n>
                </Link>
              </div>
            </>
          )}
        </RequestAccountForm>
      )}
    </LoginWrapper>
  );
};

const RequestAccountForm = ({ children, email: defaultEmail }) => {
  let [pending, setPending] = useState(false);
  let [success, setSuccess] = useState(false);
  let [error, setError] = useState(null);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState(defaultEmail || '');
  let [phoneNumber, setPhoneNumber] = useState('');
  let [comments, setComments] = useState('');

  const handleResetRequest = useCallback(
    async e => {
      e.preventDefault();
      setPending(true);
      setSuccess(false);
      setError(null);
      try {
        const response = await createSubmission({
          kappSlug: 'admin',
          formSlug: 'account-request',
          values: {
            'First Name': firstName,
            'Last Name': lastName,
            Email: email,
            'Phone Number': phoneNumber,
            Comments: comments,
          },
          public: true,
        });

        setPending(false);
        if (response.error) {
          setError(
            response.error.fieldConstraintViolations &&
            response.error.fieldConstraintViolations['Email']
              ? 'You must enter a valid email address.'
              : 'There was a problem requesting your new account. Please verify the information you entered.',
          );
        } else {
          setSuccess(email);
        }
      } catch (_) {
        setPending(false);
        setError(
          'There was a problem requesting your new account. Please verify the information you entered.',
        );
      }
    },
    [
      firstName,
      lastName,
      email,
      phoneNumber,
      comments,
      setError,
      setPending,
      setSuccess,
    ],
  );

  const fields = {
    firstName: (
      <div className="form-group">
        <label htmlFor="firstName" className="required">
          <I18n>First Name</I18n>
        </label>
        <input
          type="text"
          autoFocus
          className="form-control"
          id="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    lastName: (
      <div className="form-group">
        <label htmlFor="lastName" className="required">
          <I18n>Last Name</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    email: (
      <div className="form-group">
        <label htmlFor="email" className="required">
          <I18n>Email Address</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    phoneNumber: (
      <div className="form-group">
        <label htmlFor="phoneNumber">
          <I18n>Phone Number</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="phoneNumber"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />
      </div>
    ),
    comments: (
      <div className="form-group">
        <label htmlFor="comments">
          <I18n>Comments</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="comments"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
      </div>
    ),
  };
  const buttons = {
    submit: (
      <button
        className="btn btn-primary"
        type="submit"
        disabled={
          pending || !firstName || !lastName || !email || success === email
        }
      >
        <I18n>Request Account</I18n>
      </button>
    ),
  };
  const messages = {
    error: error && (
      <div className="text-danger">
        <p>
          <I18n>{error}</I18n>
        </p>
      </div>
    ),
    success: success && (
      <div className="text-info">
        <p>
          <strong>
            <I18n>Your request for a new account has been received.</I18n>
          </strong>
        </p>
        <p>
          <I18n>
            Your request for a new account is being reviewed by the team. Once
            approved you will receive an email with further instructions.
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

const CreateAccountForm = connect(
  null,
  { push },
)(({ children, invitationToken, email: defaultEmail, location }) => {
  let [pending, setPending] = useState(false);
  let [error, setError] = useState(null);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState(defaultEmail || '');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [confirmBlurred, setConfirmBlurred] = useState(false);

  const handleLogin = useCallback(
    async () => {
      try {
        await axios.post(
          `${bundle.spaceLocation()}/app/login.do`,
          {
            j_username: email,
            j_password: password,
          },
          {
            __bypassAuthInterceptor: true,
          },
        );
      } catch (error) {
        push(`/login${location.search}`);
      }
    },
    [email, password, location],
  );

  const handleResetRequest = useCallback(
    async e => {
      e.preventDefault();
      setPending(true);
      setError(null);
      try {
        await axios.post(
          `${bundle.apiLocation()}/users?token=${invitationToken}`,
          {
            username: email,
            email,
            password,
            displayName: `${firstName} ${lastName}`,
            invitationToken,
          },
        );
        handleLogin();
      } catch (error) {
        const errorMessage =
          error.response.status === 404
            ? 'Invitation expired.'
            : error.response.status === 400
              ? error.response.data.error
              : '';
        setError(
          `There was a problem creating your new account. ${errorMessage}`,
        );
      }
    },
    [
      firstName,
      lastName,
      email,
      password,
      invitationToken,
      setError,
      setPending,
      handleLogin,
    ],
  );

  const fields = {
    firstName: (
      <div className="form-group">
        <label htmlFor="firstName" className="required">
          <I18n>First Name</I18n>
        </label>
        <input
          type="text"
          autoFocus
          className="form-control"
          id="firstName"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    lastName: (
      <div className="form-group">
        <label htmlFor="lastName" className="required">
          <I18n>Last Name</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    email: (
      <div className="form-group">
        <label htmlFor="email" className="required">
          <I18n>Email Address</I18n>
        </label>
        <input
          type="text"
          className="form-control"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-required="true"
        />
      </div>
    ),
    password: (
      <div className="form-group">
        <label htmlFor="password" className="required">
          <I18n>New Password</I18n>
        </label>
        <input
          type="password"
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
        <label htmlFor="confirm-password" className="required">
          <I18n>Confirm Password</I18n>
        </label>
        <input
          type="password"
          className="form-control"
          id="confirm-password"
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
    submit: (
      <button
        className="btn btn-primary"
        type="submit"
        disabled={
          pending ||
          !firstName ||
          !lastName ||
          !email ||
          password !== confirmPassword ||
          !password
        }
      >
        <I18n>Accept Invitation</I18n>
      </button>
    ),
  };
  const messages = {
    validations: password !== confirmPassword &&
      (password || confirmPassword) &&
      confirmBlurred && (
        <div className="text-danger">
          <p>
            <I18n>Passwords must match.</I18n>
          </p>
        </div>
      ),
    error: error && (
      <div className="text-danger">
        <p>
          <I18n>{error}</I18n>
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
});
