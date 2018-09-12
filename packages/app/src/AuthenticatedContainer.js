import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import qs from 'qs';
import axios from 'axios';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bundle } from 'react-kinetic-core';

import {
  actions as socketActions,
  TOKEN_KEY,
} from 'discussions/src/redux/modules/socket';

import logoImage from './assets/images/login-background.png';
import logoName from './assets/images/login-name.png';

import { ResetTokenForm } from './components/authentication/ResetTokenForm';
import { ResetPasswordForm } from './components/authentication/ResetPasswordForm';
import { LoginForm } from './components/authentication/LoginForm';
import { CreateAccountForm } from './components/authentication/CreateAccountForm';
import { UnauthenticatedForm } from './components/authentication/UnauthenticatedForm';

export const LoginScreen = props => (
  <div className="login-container">
    <div className="login-wrapper">
      {props.children}
      <div
        className="login-image-container"
        style={{ backgroundImage: `url(${logoImage})` }}
      >
        <div className="kinops-text">
          <img
            src={logoName}
            alt="Kinops - streamline everyday work for teams"
          />
          <h3>Welcome to kinops</h3>
          <p>Streamline everyday work for teams.</p>
        </div>
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

export const handleUnauthorized = props => () => {
  props.setDisplay('login');
};

// const fetchCode = ({
//   location,
//   setCode,
//   setProcessing,
//   processOAuthToken,
// }) => () => {
//   const params = qs.parse(location.search);

//   if (params['?code']) {
//     // setCode(params['?code']);
//     // console.log('got oauth code', params['?code']);
//     // props.push(params.state);

//     processOAuthToken(params['?code'], params.state);
//   } else {
//     setProcessing(false);
//   }
// };
// const processOAuthCode = async (code, state, push) => {
//   const clientId = 'kinops';
//   const clientSecret = 'kinops';

//   const results = await axios.request({
//     method: 'post',
//     url: '/app/oauth/token',
//     auth: {
//       username: clientId,
//       password: clientSecret,
//     },
//     params: {
//       response_type: 'code',
//       grant_type: 'authorization_code',
//       code,
//     },
//     config: { headers: { 'Content-Type': 'application/json' } },
//   });

//   window.opener.__OAUTH_CALLBACK__(results.data);
// };

const processOAuthToken = (token, state, push, setToken) => {
  setToken(token);
  push(state);
};

const CatchAllRoute = props => (
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
);

const Authenticated = props => {
  const {
    children,
    authenticated,
    attempting,
    isPublic,
    setToken,
    push,
  } = props;

  const params = qs.parse(window.location.hash);

  if (params['access_token']) {
    console.log('access token!!!', params['access_token']);
    // oauth
    processOAuthToken(params['access_token'], params.state, push, setToken);
    return null;
  }

  return authenticated && !isPublic ? (
    children
  ) : attempting ? null : (
    <div>
      {props.display === 'none' ? (
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
            path="/kapps/:kappSlug/forms/:formSlug"
            exact
            render={route => (
              <UnauthenticatedForm {...props} {...route} routed />
            )}
          />
          <Route
            path="/kapps/:kappSlug/submissions/:id"
            exact
            render={route => (
              <UnauthenticatedForm {...props} {...route} routed />
            )}
          />
          <Route
            path="/kapps/:kappSlug/forms/:formSlug/submissions/:id"
            exact
            render={route => (
              <UnauthenticatedForm {...props} {...route} routed />
            )}
          />
          <CatchAllRoute {...props} />
        </Switch>
      ) : (
        <CatchAllRoute {...props} />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  location: state.router.location,
  pathname: state.router.location.pathname,
  isPublic: state.router.location.search.includes('public'),
});

const mapDispatchToProps = {
  push,
  setToken: socketActions.setToken,
};

export const AuthenticatedContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  // withState('token', 'setToken', null),
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
    handleUnauthorized,
  }),

  lifecycle({
    componentWillMount() {
      const token = localStorage.getItem(TOKEN_KEY);

      // If there's a valid token, go ahead and set it.
      if (token) {
        this.props.setToken(token);
      }

      // If the bundle says we're anonymous on our initial visit then assume unauthenticated.
      // Otherwise we're authenticated with Core.
      if (bundle.identity() !== 'anonymous' && token) {
        this.props.setAuthenticated(true);
      }

      this.props.setAttempting(false);
    },
  }),
)(Authenticated);
