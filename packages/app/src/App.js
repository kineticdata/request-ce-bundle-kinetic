import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { Utils } from 'common';
import { actions } from './redux/modules/app';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';

import { Header } from './components/header/Header';
import { AppProvider } from './AppProvider';
// Import available packages
import ServicesApp from 'services';
import QueueApp from 'queue';
import TechBarApp from 'tech-bar';
import DiscussionsApp from 'discussions';
import SettingsApp from 'settings';
import ScaffoldApp from 'scaffold';

// Mapping of Bundle Package kapp attribute values to App Components
const BUNDLE_PACKAGE_PROVIDERS = {
  services: ServicesApp,
  queue: QueueApp,
  'tech-bar': TechBarApp,
  scaffold: ScaffoldApp,
};

// List of available static packages
const STATIC_PACKAGE_PROVIDERS = [SettingsApp, DiscussionsApp];

// Determine the correct AppProvider based on the kapp/route
const getAppProvider = ({ kapp, pathname }) => {
  if (kapp) {
    return (
      BUNDLE_PACKAGE_PROVIDERS[
        Utils.getAttributeValue(kapp, 'Bundle Package', kapp.slug)
      ] || AppProvider
    );
  } else {
    return (
      STATIC_PACKAGE_PROVIDERS.find(provider =>
        matchPath(pathname, { path: provider.location }),
      ) || AppProvider
    );
  }
};

export const AppComponent = props =>
  !props.loading && (
    <props.AppProvider
      appState={{
        ...props.app.toObject(),
        location: props.appLocation,
        actions: {
          refreshApp: props.refreshApp,
        },
        layoutSize: props.layoutSize,
        bundleName: 'request-ce-bundle-kinetic',
      }}
      location={props.location}
      render={({ main, sidebar, header }) => (
        <div className="app-wrapper">
          {!props.headerHidden && (
            <div className="app-header">
              <Header toggleSidebarOpen={sidebar && props.toggleSidebarOpen} />
            </div>
          )}
          <div
            className={`app-body ${
              sidebar
                ? props.sidebarOpen
                  ? 'open-sidebar'
                  : 'closed-sidebar'
                : ''
            }`}
          >
            {sidebar && <div className="app-sidebar-container">{sidebar}</div>}
            <div
              className="app-main-container"
              onClick={
                sidebar && props.sidebarOpen && props.layoutSize === 'small'
                  ? props.toggleSidebarOpen
                  : undefined
              }
            >
              {main}
            </div>
          </div>
        </div>
      )}
    />
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  kapps: state.app.kapps,
  sidebarOpen: state.layout.sidebarOpen,
  suppressedSidebarOpen: state.layout.suppressedSidebarOpen,
  layoutSize: state.layout.size,
  kappSlug: state.app.kappSlug,
  kapp: state.app.kapp,
  location: state.router.location,
  app: state.app,
});

export const mapDispatchToProps = {
  push,
  loadApp: actions.fetchApp,
  fetchAlertsRequest: alertsActions.fetchAlertsRequest,
  setSidebarOpen: layoutActions.setSidebarOpen,
  setSuppressedSidebarOpen: layoutActions.setSuppressedSidebarOpen,
};

export const App = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    getLocation: ({ kappSlug }) => app =>
      `${kappSlug !== null ? `/kapps/${kappSlug}` : app.location || '/'}`,
  }),
  withProps(({ authenticated, location, kapp, ...props }) => {
    const app = getAppProvider({ kapp, pathname: location.pathname });
    const appLocation = props.getLocation(app);
    const headerHidden = app
      ? app.shouldHideHeader &&
        app.shouldHideHeader({ appLocation, authenticated, location, kapp })
      : true;
    const sidebarHidden = app
      ? app.shouldHideSidebar &&
        app.shouldHideSidebar({ appLocation, authenticated, location, kapp })
      : true;
    const shouldSuppressSidebar =
      app &&
      app.shouldSuppressSidebar &&
      app.shouldSuppressSidebar({ appLocation, authenticated, location, kapp });
    const sidebarOpen = shouldSuppressSidebar
      ? props.suppressedSidebarOpen
      : props.sidebarOpen;
    return {
      AppProvider: app,
      headerHidden,
      sidebarHidden,
      shouldSuppressSidebar,
      sidebarOpen,
      appLocation,
    };
  }),
  withHandlers({
    toggleSidebarOpen: props =>
      !props.sidebarHidden
        ? () =>
            props.shouldSuppressSidebar
              ? props.setSuppressedSidebarOpen(!props.sidebarOpen)
              : props.setSidebarOpen(!props.sidebarOpen)
        : undefined,
    refreshApp: props => () => props.loadApp(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.authenticated !== null && this.props.loadApp(true);
    },
    componentDidUpdate(prevProps) {
      if (this.props.authenticated !== prevProps.authenticated) {
        this.props.loadApp(true);
      }
      if (
        !this.props.loading &&
        !this.props.authenticated &&
        !this.props.AppProvider.hasPublicRoutes
      ) {
        this.props.push(this.props.authRoute);
      }
    },
  }),
)(AppComponent);
