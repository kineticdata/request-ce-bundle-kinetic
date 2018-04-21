import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import 'common/src/assets/styles/master.scss';
import './assets/styles/master.scss';
import 'discussions/src/assets/styles/master.scss';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import Sidebar from 'react-sidebar';

import { ToastsContainer } from './components/ToastsContainer';
import { HeaderContainer } from './components/HeaderContainer';
import { ModalFormContainer } from './components/ModalFormContainer';
import { actions as kinopsActions } from './redux/modules/kinops';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';
import { App as ServicesApp } from 'services/src/App';
import { App as QueueApp } from 'queue/src/App';
import { App as SpaceApp } from 'space/src/App';

export const AppComponent = props =>
  !props.loading && (
    <Fragment>
      <ToastsContainer />
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
              sidebarClassName={`sidebar-container ${
                true ? 'drawer' : 'overlay'
              }`}
              contentClassName="main-container"
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
  loading: state.kinops.loading,
  kapps: state.kinops.kapps,
  sidebarOpen: state.layout.sidebarOpen,
  suppressedSidebarOpen: state.layout.suppressedSidebarOpen,
  layoutSize: state.layout.size,
  kappSlug: state.kinops.kappSlug,
  pathname: state.router.location.pathname,
});
export const mapDispatchToProps = {
  loadApp: kinopsActions.loadApp,
  fetchAlerts: alertsActions.fetchAlerts,
  setSidebarOpen: layoutActions.setSidebarOpen,
  setSuppressedSidebarOpen: layoutActions.setSuppressedSidebarOpen,
};

export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(props => {
    const AppProvider =
      props.kappSlug === 'services'
        ? ServicesApp
        : props.kappSlug === 'queue' ? QueueApp : SpaceApp;
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
