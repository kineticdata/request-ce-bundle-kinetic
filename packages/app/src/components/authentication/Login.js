import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { logout, I18n } from '@kineticdata/react';
import { LoginWrapper } from './LoginWrapper';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Helmet } from 'react-helmet';

export const Login = ({ loginProps }) => {
  let location = useLocation();
  return (
    <LoginWrapper>
      <Helmet>
        <title>signin | kinops </title>
      </Helmet>
      <LoginForm {...loginProps}>
        {({ fields, buttons }) => (
          <>
            <h3>
              <I18n>Sign In</I18n>
              <small>
                <Link to={`/create-account${location.search}`}>
                  <I18n>Create Account</I18n>
                </Link>
              </small>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {fields.username}
              {fields.password}

              <span className="text-danger">
                <I18n>{loginProps.error || ' '}</I18n>
              </span>
            </div>
            <div className="button-group">
              {buttons.login}
              <hr />
              {buttons.ssoLogin && (
                <>
                  {buttons.ssoLogin}
                  <hr />
                </>
              )}
              <Link
                className="btn btn-link"
                to={`/reset-password${location.search}`}
              >
                <I18n>Reset Password</I18n>
              </Link>
            </div>
          </>
        )}
      </LoginForm>
    </LoginWrapper>
  );
};

export const LoginModal = ({ loginProps }) => (
  <Modal isOpen toggle={logout} size="lg" backdrop="static">
    <LoginForm {...loginProps}>
      {({ fields, buttons }) => (
        <>
          <div className="modal-header">
            <h4 className="modal-title">
              <button type="button" className="btn btn-link" onClick={logout}>
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Your Session Timed Out</I18n>
              </span>
            </h4>
          </div>
          <ModalBody>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {fields.username}
              {fields.password}

              <span className="text-danger">
                <I18n>{loginProps.error || ' '}</I18n>
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            {buttons.login}
            {buttons.ssoLogin}
          </ModalFooter>
        </>
      )}
    </LoginForm>
  </Modal>
);

export const LoginForm = ({
  error,
  username,
  onChangeUsername,
  password,
  onChangePassword,
  onLogin,
  onSso,
  pending,
  children,
}) => {
  const fields = {
    username: (
      <div className="form-group">
        <label htmlFor="username">
          <I18n>Email Address</I18n>
        </label>
        <input
          type="text"
          autoFocus
          className="form-control"
          id="username"
          placeholder="wally@kineticdata.com"
          value={username}
          onChange={onChangeUsername}
        />
      </div>
    ),
    password: (
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
          onChange={onChangePassword}
        />
      </div>
    ),
  };
  const buttons = {
    login: (
      <button
        className="btn btn-primary"
        type="submit"
        disabled={pending || !username || !password}
      >
        <I18n>Sign In</I18n>
      </button>
    ),
    ssoLogin: onSso ? (
      <button
        className="btn btn-primary"
        type="button"
        onClick={onSso}
        disabled={pending}
      >
        <I18n>Enterprise Sign In</I18n>
      </button>
    ) : (
      undefined
    ),
  };
  return (
    <form className="login-form-container" onSubmit={onLogin}>
      {typeof children === 'function' ? (
        children({ fields, buttons })
      ) : (
        <>
          <div>{Object.values(fields)}</div>
          <div>{Object.values(buttons)}</div>
        </>
      )}
    </form>
  );
};
