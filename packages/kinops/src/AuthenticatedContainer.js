import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bundle } from 'react-kinetic-core';

import logoImage from './login-logo.png';
import logoName from './login-name.png';

import { ResetTokenForm } from './components/authentication/ResetTokenForm';
import { ResetPasswordForm } from './components/authentication/ResetPasswordForm';
import { LoginForm } from './components/authentication/LoginForm';
import { CreateAccountForm } from './components/authentication/CreateAccountForm';

export const LoginScreen = props => (
  <div className="login-screens">
    {props.children}
    <div className="logo-right" style={{}}>
      <img
        src={logoImage}
        alt="Kinops - streamline everyday work for teams"
        className="logo-image"
      />
      <div className="logo-text">
        <img src={logoName} alt="Kinops - streamline everyday work for teams" />
        <h3>Welcome to kinops</h3>
        <p>Streamline everyday work for teams.</p>
      </div>
    </div>
  </div>
);

const toResetPassword = ({ push, setDisplay }) => routed => () =>
  routed ? push('/reset-password') : setDisplay('reset');
const toSignIn = ({ push, setDisplay }) => routed => () =>
  routed ? push('/login') : setDisplay('none');
const toCreateAccount = ({ push, setDisplay }) => routed => () =>
  routed ? push('/create-account') : setDisplay('create-account');

const handleEmail = ({ setEmail }) => e => setEmail(e.target.value);
const handlePassword = ({ setPassword }) => e => setPassword(e.target.value);
const handleAuthenticated = ({
  setError,
  setDisplay,
  setEmail,
  setPassword,
  setAttempting,
  setAuthenticated,
}) => () => {
  setError('');
  setDisplay('none');
  setEmail('');
  setPassword('');
  setAttempting(false);
  setAuthenticated(true);
};

const Authenticated = props => {
  const { children, authenticated, attempting } = props;

  return authenticated ? (
    children
  ) : attempting ? null : (
    <Switch>
      <Route
        path="/login"
        exact
        render={route => (
          <LoginScreen>
            <LoginForm {...props} {...route} routed />
          </LoginScreen>
        )}
      />
      <Route
        path="/reset-password"
        exact
        render={route => (
          <LoginScreen>
            <ResetPasswordForm {...props} {...route} routed />{' '}
          </LoginScreen>
        )}
      />
      <Route
        path="/reset-password/:token"
        exact
        render={route => (
          <LoginScreen>
            <ResetTokenForm {...props} {...route} routed />
          </LoginScreen>
        )}
      />
      <Route
        path="/create-account"
        exact
        render={route => (
          <LoginScreen>
            <CreateAccountForm {...props} {...route} routed />
          </LoginScreen>
        )}
      />
      <Route
        path="/"
        render={route => (
          <LoginScreen>
            {props.display === 'reset' ? (
              <ResetPasswordForm {...props} />
            ) : props.display === 'reset-token' ? (
              <ResetTokenForm {...props} />
            ) : props.display === 'create-account' ? (
              <CreateAccountForm {...props} />
            ) : (
              <LoginForm {...props} />
            )}
          </LoginScreen>
        )}
      />
    </Switch>
  );
};

const mapDispatchToProps = state => ({
  pathname: state.router.location.pathname,
});

export const AuthenticatedContainer = compose(
  connect(mapDispatchToProps, { push }),
  withState('display', 'setDisplay', 'none'),
  withState('error', 'setError', ''),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('attempting', 'setAttempting', true),
  withState('authenticated', 'setAuthenticated', false),

  withHandlers({
    toResetPassword,
    toSignIn,
    toCreateAccount,
    handleEmail,
    handlePassword,
    handleAuthenticated,
  }),

  lifecycle({
    componentWillMount() {
      if (bundle.identity() === 'anonymous') {
        this.props.setAttempting(false);
        this.props.setDisplay('login');
      } else {
        this.props.setAttempting(false);
        this.props.setAuthenticated(true);
      }
    },
  }),
)(Authenticated);
