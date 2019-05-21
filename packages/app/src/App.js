import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';
import './assets/styles/master.scss';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import {
  Utils,
  ToastsContainer,
  ModalFormContainer,
  selectCurrentKapp,
} from 'common';
import { LoginModal } from './components/authentication/LoginModal';
import { HeaderContainer } from './components/HeaderContainer';
import { actions } from './redux/modules/app';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';
import { ServicesApp } from 'services/src/ServicesApp';
import { QueueApp } from 'queue/src/QueueApp';
import { SpaceApp } from 'space/src/SpaceApp';
import { TechBarApp } from 'tech-bar/src/TechBarApp';

export const AppComponent = props =>
  !props.loading && (
    <Fragment>
      <ToastsContainer duration={5000} />
      <LoginModal />
      <ModalFormContainer />
      <props.AppProvider
        appState={{
          ...props.app.toObject(),
          location: `${
            props.kappSlug === null ? '' : `/kapps/${props.kappSlug}`
          }`,
          actions: {
            refreshApp: props.refreshApp,
          },
          layoutSize: props.layoutSize,
        }}
        render={({ main, sidebar, header }) => (
          <div className="app-wrapper">
            {!props.headerHidden && (
              <div className="app-header">
                <HeaderContainer
                  hasSidebar={!props.sidebarHidden}
                  toggleSidebarOpen={props.toggleSidebarOpen}
                />
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
              {sidebar && (
                <div className="app-sidebar-container">{sidebar}</div>
              )}
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
    </Fragment>
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapps: state.app.kapps,
  sidebarOpen: state.layout.sidebarOpen,
  suppressedSidebarOpen: state.layout.suppressedSidebarOpen,
  layoutSize: state.layout.size,
  kappSlug: state.app.kappSlug,
  kapp: selectCurrentKapp(state),
  pathname: state.router.location.pathname,
  locale: state.app.locale,
  profile: state.app.profile,
  space: state.app.space,
  locales: state.app.locales,
  timezones: state.app.timezones,
  version: state.app.coreVersion,
  app: state.app,
});
export const mapDispatchToProps = {
  loadApp: actions.fetchApp,
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
    case 'tech-bar':
      return TechBarApp;
    default:
      return SpaceApp;
  }
};

export const App = compose(
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
    const headerHidden =
      AppProvider.shouldHideHeader &&
      AppProvider.shouldHideHeader(props.pathname, props.kappSlug);
    const sidebarHidden =
      AppProvider.shouldHideSidebar &&
      AppProvider.shouldHideSidebar(props.pathname, props.kappSlug);
    return {
      AppProvider,
      shouldSuppressSidebar,
      sidebarOpen,
      headerHidden,
      sidebarHidden,
    };
  }),
  withHandlers({
    toggleSidebarOpen: props => () =>
      props.shouldSuppressSidebar
        ? props.setSuppressedSidebarOpen(!props.sidebarOpen)
        : props.setSidebarOpen(!props.sidebarOpen),
    refreshApp: props => () => props.loadApp(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.loadApp(true);
      this.props.fetchAlerts();
    },
  }),
)(AppComponent);
