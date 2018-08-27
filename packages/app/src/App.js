import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';
import './assets/styles/master.scss';
import 'discussions/src/assets/styles/master.scss';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
} from 'recompose';
import { withRouter } from 'react-router';
import { push } from 'connected-react-router';
import qs from 'qs';
import axios from 'axios';
import Sidebar from 'react-sidebar';
import { Utils, ToastsContainer, ModalFormContainer } from 'common';
import { LoginModal } from './components/authentication/LoginModal';
import { HeaderContainer } from './components/HeaderContainer';
import { actions as loadActions } from './redux/modules/loading';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';
import { App as ServicesApp } from 'services/src/App';
import { App as QueueApp } from 'queue/src/App';
import { App as SpaceApp } from 'space/src/App';

// const coreOauthTokenUrl = state => {};

// const coreOauthAuthorizeUrl = state => {
//   const clientId = 'kinops';
//   const clientSecret = 'kinops';
//   const redirectUri = 'http%3A%2F%2Flocalhost%3A3000';
//   return `/app/oauth/token?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
// };

export const OAuthAppWrapper = props => {
  return props.processing ? null : <AppView {...props} />;
};

const fetchCode = ({
  location,
  setCode,
  setProcessing,
  processOAuthToken,
}) => () => {
  const params = qs.parse(location.search);

  if (params['?code']) {
    // setCode(params['?code']);
    // console.log('got oauth code', params['?code']);
    // props.push(params.state);

    processOAuthToken(params['?code'], params.state);
  } else {
    setProcessing(false);
  }
};
const processOAuthToken = ({ setProcessing, push }) => async (code, state) => {
  const clientId = 'kinops';
  const clientSecret = 'kinops';

  const results = await axios.request({
    method: 'post',
    url: '/app/oauth/token',
    auth: {
      username: clientId,
      password: clientSecret,
    },
    params: {
      response_type: 'code',
      grant_type: 'authorization_code',
      code,
    },
    config: { headers: { 'Content-Type': 'application/json' } },
  });

  console.log('results', results.data);
  // if (window.opener) {
  window.opener.__OAUTH_CALLBACK__(results.data);
  // } else if (state) {
  // push(state);
  // }

  // setProcessing(false);
  // push(state);
};

const wrapperDispatch = {
  push,
};
export const App = compose(
  withRouter,
  connect(
    null,
    wrapperDispatch,
  ),
  withState('processing', 'setProcessing', true),
  withState('code', 'setCode', null),
  withHandlers({
    processOAuthToken,
  }),
  withHandlers({
    fetchCode,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchCode();
    },
  }),
)(OAuthAppWrapper);

export const AppComponent = props =>
  !props.loading && (
    <Fragment>
      <ToastsContainer />
      <LoginModal />
      <ModalFormContainer />
      <HeaderContainer hasSidebar toggleSidebarOpen={props.toggleSidebarOpen} />
      <props.AppProvider
        render={({ main, sidebar }) =>
          sidebar ? (
            <Sidebar
              sidebar={sidebar}
              shadow={false}
              open={props.sidebarOpen && props.layoutSize === 'small'}
              docked={props.sidebarOpen && props.layoutSize !== 'small'}
              onSetOpen={props.setSidebarOpen}
              rootClassName="sidebar-layout-wrapper"
              sidebarClassName={`sidebar-container ${
                true ? 'drawer' : 'overlay'
              }`}
              contentClassName={`main-container ${
                props.sidebarOpen ? 'open' : 'closed'
              }`}
            >
              {main}
            </Sidebar>
          ) : (
            main
          )
        }
      />
    </Fragment>
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapps: state.app.kapps,
  sidebarOpen: state.app.layout.sidebarOpen,
  suppressedSidebarOpen: state.app.layout.suppressedSidebarOpen,
  layoutSize: state.app.layout.size,
  kappSlug: state.app.config.kappSlug,
  pathname: state.router.location.pathname,
});
export const mapDispatchToProps = {
  loadApp: loadActions.loadApp,
  fetchAlerts: alertsActions.fetchAlerts,
  setSidebarOpen: layoutActions.setSidebarOpen,
  setSuppressedSidebarOpen: layoutActions.setSuppressedSidebarOpen,
};

const getAppProvider = kapp => {
  const bundlePackage = kapp
    ? Utils.getAttributeValue(kapp, 'Bundle Package', kapp.slug)
    : SpaceApp;
  switch (bundlePackage) {
    case 'services':
      return ServicesApp;
    case 'queue':
      return QueueApp;
    default:
      return SpaceApp;
  }
};

export const AppView = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    const AppProvider = getAppProvider(
      props.kapps.find(kapp => kapp.slug === props.kappSlug),
    );
    const shouldSuppressSidebar =
      AppProvider.shouldSuppressSidebar &&
      AppProvider.shouldSuppressSidebar(props.pathname, props.kappSlug);
    const sidebarOpen = shouldSuppressSidebar
      ? props.suppressedSidebarOpen
      : props.sidebarOpen;
    return {
      AppProvider,
      shouldSuppressSidebar,
      sidebarOpen,
    };
  }),
  withHandlers({
    toggleSidebarOpen: props => () =>
      props.shouldSuppressSidebar
        ? props.setSuppressedSidebarOpen(!props.sidebarOpen)
        : props.setSidebarOpen(!props.sidebarOpen),
  }),
  lifecycle({
    componentDidMount() {
      this.props.loadApp();
      this.props.fetchAlerts();
    },
  }),
)(AppComponent);
