import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import qs from 'qs';
import { parse } from 'query-string';
import { withRouter } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bundle } from 'react-kinetic-core';
import { login } from './utils/authentication';
import { actions as socketActions } from 'discussions/src/redux/modules/socket';
import { actions as authActions } from './redux/modules/auth';
import logoImage from './assets/images/login-background.png';
import logoName from './assets/images/login-name.png';
import { WallySpinner } from 'common';
import { ResetTokenForm } from './components/authentication/ResetTokenForm';
import { ResetPasswordForm } from './components/authentication/ResetPasswordForm';
import { LoginForm } from './components/authentication/LoginForm';
import { CreateAccountForm } from './components/authentication/CreateAccountForm';
import { RequestAccountForm } from './components/authentication/RequestAccountForm';
import { UnauthenticatedForm } from './components/authentication/UnauthenticatedForm';
import { RetrieveJwtIframe } from './components/authentication/RetrieveJwtIframe';
import { OAuthPopup } from './components/authentication/OAuthPopup';
import { I18n } from './I18nProvider';

const LoginLogo = () => (
  <div
    className="login-image-container"
    style={{ backgroundImage: `url(${logoImage})` }}
  >
    <div className="kinops-text">
      <img src={logoName} alt="Kinops - streamline everyday work for teams" />
      <h3>
        <I18n>Welcome to kinops</I18n>
      </h3>
      <p>
        <I18n>Streamline everyday work for teams.</I18n>
      </p>
    </div>
  </div>
);

const LoginLoading = ({ setToken }) => (
  <div className="wally-loader-wrapper">
    <WallySpinner />
    <RetrieveJwtIframe onSuccess={setToken} />
  </div>
);

export const LoginScreen = props => (
  <div className="login-container">
    <div className="login-wrapper">
      {bundle.config.loginPopup && !props.token ? (
        <div className="login-form-container">
          <h3 className="form-title">
            <I18n>Authenticate with your provider</I18n>
          </h3>
          {props.popupBlocked && (
            <h3>
              <span className="text-danger">
                <I18n>Our pop-up window was blocked.</I18n>
              </span>
            </h3>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={props.openPopup}
          >
            <I18n>Open Login Popup</I18n>
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

const handleEmail = ({ setEmail }) => e => setEmail(e.target.value);
const handlePassword = ({ setPassword }) => e => setPassword(e.target.value);

const handleLogin = ({
  email,
  password,
  setError,
  setPassword,
  handleAuthenticated,
}) => async e => {
  e && e.preventDefault();
  try {
    await login(email, password);
    handleAuthenticated();
  } catch (error) {
    console.log(error);
    setError('Invalid username or password.');
    setPassword('');
  }
};

const handleAuthenticated = ({
  setError,
  setEmail,
  setPassword,
  setAttempting,
  setAuthenticated,
  setToken,
}) => token => {
  setError('');
  setEmail('');
  setPassword('');
  setAttempting(false);
  setAuthenticated(true);

  if (token) {
    setToken(token);
  }
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

const mapStateToProps = state => ({
  location: state.router.location,
  pathname: state.router.location.pathname,
  isPublic: state.router.location.search.includes('public'),
  token: state.discussions.socket.token,
  destinationRoute: state.app.auth.destinationRoute,
  invitationToken: parse(state.router.location.search).invitationToken,
  invitationEmail: parse(state.router.location.search).email || '',
});

const mapDispatchToProps = {
  push,
  setToken: socketActions.setToken,
  setDestinationRoute: authActions.setDestinationRoute,
};

const AuthenticatedComponent = props => {
  const {
    children,
    authenticated,
    isPublic,
    push,
    token,
    invitationToken,
  } = props;

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
  ) : (
    <Switch>
      <Route
        path="/login"
        exact
        render={() => (
          <LoginScreen {...props}>
            <LoginForm {...props} />
          </LoginScreen>
        )}
      />
      <Route
        path="/reset-password"
        exact
        render={() => (
          <LoginScreen {...props}>
            <ResetPasswordForm {...props} />{' '}
          </LoginScreen>
        )}
      />
      <Route
        path="/reset-password/:token"
        exact
        render={routeProps => (
          <LoginScreen {...props}>
            <ResetTokenForm {...props} {...routeProps} />
          </LoginScreen>
        )}
      />
      <Route
        path="/create-account"
        exact
        render={() => (
          <LoginScreen {...props}>
            {invitationToken ? (
              <CreateAccountForm {...props} />
            ) : (
              <RequestAccountForm {...props} />
            )}
          </LoginScreen>
        )}
      />
      <Route
        path="/kapps/:kappSlug/forms/:formSlug"
        exact
        render={() => <UnauthenticatedForm {...props} />}
      />
      <Route
        path="/kapps/:kappSlug/submissions/:id"
        exact
        render={() => <UnauthenticatedForm {...props} />}
      />
      <Route
        path="/kapps/:kappSlug/forms/:formSlug/submissions/:id"
        exact
        render={() => <UnauthenticatedForm {...props} />}
      />
      <Redirect to={defaultRedirect(props)} />
    </Switch>
  );
};
const defaultRedirect = props =>
  props.invitationToken ? `/create-account${props.location.search}` : '/login';
const shouldRenderApp = props =>
  props.authenticated && props.token !== null && !props.isPublic;
const INVALID_PUSH_ROUTES = ['/login', '/reset-password', '/create-account'];
const shouldOverridePath = pathname =>
  INVALID_PUSH_ROUTES.find(p => pathname.startsWith(p));

export const AuthenticatedContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
  withState('error', 'setError', ''),
  withState('email', 'setEmail', props => props.invitationEmail),
  withState('password', 'setPassword', ''),
  withState('attempting', 'setAttempting', true),
  withState('authenticated', 'setAuthenticated', false),
  withState('popupBlocked', 'setPopupBlocked', false),
  withHandlers({ handleAuthenticated }),
  withHandlers({
    handleEmail,
    handlePassword,
    handleLogin,
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

      // Preserve the original route.
      this.props.setDestinationRoute(
        `${this.props.pathname}${this.props.location.search}`,
      );
    },

    componentWillReceiveProps(nextProps) {
      const current = shouldRenderApp(this.props);
      const next = shouldRenderApp(nextProps);

      if (next && !current) {
        const destination = shouldOverridePath(this.props.destinationRoute)
          ? '/'
          : this.props.destinationRoute;

        this.props.push(destination);
      }
    },
  }),
)(AuthenticatedComponent);
