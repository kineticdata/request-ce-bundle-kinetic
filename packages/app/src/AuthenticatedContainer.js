import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import qs from 'qs';
import { parse } from 'query-string';
import { Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bundle } from 'react-kinetic-core';
import { login } from './utils/authentication';
import { actions as socketActions } from 'discussions/src/redux/modules/socket';
import logoImage from './assets/images/login-background.png';
import logoName from './assets/images/login-name.png';
import { ResetTokenForm } from './components/authentication/ResetTokenForm';
import { ResetPasswordForm } from './components/authentication/ResetPasswordForm';
import { LoginForm } from './components/authentication/LoginForm';
import { CreateAccountForm } from './components/authentication/CreateAccountForm';
import { RequestAccountForm } from './components/authentication/RequestAccountForm';
import { UnauthenticatedForm } from './components/authentication/UnauthenticatedForm';
import { RetrieveJwtIframe } from './components/authentication/RetrieveJwtIframe';
import { OAuthPopup } from './components/authentication/OAuthPopup';

const LoginLogo = () => (
  <div
    className="login-image-container"
    style={{ backgroundImage: `url(${logoImage})` }}
  >
    <div className="kinops-text">
      <img src={logoName} alt="Kinops - streamline everyday work for teams" />
      <h3>Welcome to kinops</h3>
      <p>Streamline everyday work for teams.</p>
    </div>
  </div>
);

const LoginLoading = ({ setToken }) => (
  <div>
    <span>Loading!!!</span>
    <RetrieveJwtIframe onSuccess={props.setToken} />
  </div>
);

export const LoginScreen = props => (
  <div className="login-container">
    <div className="login-wrapper">
      {bundle.config.loginPopup && !props.token ? (
        <div className="login-form-container">
          <h3 className="form-title">Authenticate with your provider</h3>
          {props.popupBlocked && (
            <h3>
              <span className="text-danger">
                Our pop-up window was blocked.
              </span>
            </h3>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={props.openPopup}
          >
            Open Login Popup
          </button>
          <OAuthPopup
            ref={props.setPopupRef}
            onSuccess={props.handleAuthenticated}
            onPopupBlocked={props.setPopupBlocked}
          />
        </div>
      ) : props.authenticated ? (
        props.token ? null : (
          <LoginLoading setToken={props.setToken} />
        )
      ) : (
        <Fragment>
          {props.children}
          <LoginLogo />
        </Fragment>
      )}
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

const handleLogin = ({
  tryAuthentication,
  email,
  password,
  setError,
  setPassword,
  handleAuthenticated,
  routed,
  push,
}) => async e => {
  e && e.preventDefault();
  try {
    await login(email, password);
    handleAuthenticated();
    if (routed) {
      push('/');
    }
  } catch (error) {
    console.log(error);
    setError('Invalid username or password.');
    setPassword('');
  }
};

const handleAuthenticated = ({
  setError,
  setDisplay,
  setEmail,
  setPassword,
  setAttempting,
  setAuthenticated,
  setToken,
}) => token => {
  setError('');
  setDisplay('none');
  setEmail('');
  setPassword('');
  setAttempting(false);
  setAuthenticated(true);

  if (token) {
    setToken(token);
  }
};

export const handleUnauthorized = props => () => {
  props.setDisplay('login');
};

const processOAuthToken = (token, state, push, setToken) => {
  if (window.opener && window.opener.__OAUTH_CALLBACK__) {
    // If it was opened in a popup, this is being executed in another window so we
    // needed to store the callback to the full React app on `window.opener`.
    window.opener.__OAUTH_CALLBACK__(token);
  } else if (window.parent && window.parent.__OAUTH_CALLBACK__) {
    // This was performed in an iframe. Similar to the popup - the React app being
    // executed right now is now the full React app. The full app set a callback on
    // itself and we'll inform it of our token.
    window.parent.__OAUTH_CALLBACK__(token);
  }
};

const CatchAllRoute = props => (
  <Route
    path="/"
    render={route => (
      <LoginScreen {...props}>
        {props.display === 'reset' ? (
          <ResetPasswordForm {...props} />
        ) : props.display === 'reset-token' ? (
          <ResetTokenForm {...props} />
        ) : props.display === 'create-account' ? (
          <RequestAccountForm {...props} />
        ) : props.invitationToken ? (
          <CreateAccountForm {...props} />
        ) : (
          <LoginForm {...props} />
        )}
      </LoginScreen>
    )}
  />
);

const Authenticated = props => {
  const { children, authenticated, attempting, isPublic, push, token } = props;

  // First we need to check to see if this is a redirect with an OAuth token.
  // If it is we need to process the token and save it in Redux. Since this
  // is actually rendered in a popup or iframe, we will block further rendering.
  const params = qs.parse(window.location.hash);
  if (params['access_token']) {
    processOAuthToken(params['access_token'], params.state, push);
    return null;
  }

  return authenticated && token && !isPublic ? (
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
                <RequestAccountForm {...props} {...route} routed />
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
  token: state.discussions.socket.token,
  invitationToken: parse(state.router.location.search).invitationToken,
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
  withState('display', 'setDisplay', 'none'),
  withState('error', 'setError', ''),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('attempting', 'setAttempting', true),
  withState('authenticated', 'setAuthenticated', false),
  withState('popupBlocked', 'setPopupBlocked', false),
  withHandlers({ handleAuthenticated }),
  withHandlers({
    toResetPassword,
    toSignIn,
    toCreateAccount,
    handleEmail,
    handlePassword,
    handleLogin,
    handleUnauthorized,
  }),
  withHandlers(() => {
    let popupEl = null;
    return {
      setPopupRef: () => el => {
        popupEl = el;
      },
      popupRef: () => () => popupEl,
      openPopup: () => () => {
        popupEl.openPopup();
      },
    };
  }),
  lifecycle({
    componentWillMount() {
      // If the bundle says we're anonymous on our initial visit then assume unauthenticated.
      // Otherwise we're authenticated with Core.
      if (bundle.identity() !== 'anonymous') {
        this.props.setAuthenticated(true);
      }

      this.props.setAttempting(false);
    },
  }),
)(Authenticated);
