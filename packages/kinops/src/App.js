import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';
import Sidebar from 'react-sidebar';
import { ToastsContainer } from './components/ToastsContainer';
import { HeaderContainer } from './components/HeaderContainer';
import { ModalFormContainer } from './components/ModalFormContainer';
import { actions as kinopsActions } from './redux/modules/kinops';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';
import { AppRouter } from './AppRouter';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import './styles/master.scss';

export const AppComponent = props => (
  <Fragment>
    <ToastsContainer />
    <ModalFormContainer />
    <HeaderContainer hasSidebar toggleSidebarOpen={props.toggleSidebarOpen} />
    <Sidebar
      sidebar={<div style={{ marginTop: '49px' }}>Sidebar Content</div>}
      shadow={false}
      open={props.sidebarOpen && props.layoutSize === 'small'}
      docked={props.sidebarOpen && props.layoutSize !== 'small'}
      onSetOpen={props.setSidebarOpen}
      sidebarClassName={`sidebar ${true ? 'drawer' : 'overlay'}`}
    >
      <div className="App" style={{ marginTop: '49px' }}>
        {!props.loading && <AppRouter kapps={props.kapps} />}
      </div>
    </Sidebar>
  </Fragment>
);

export const mapStateToProps = state => ({
  loading: state.loading,
  kapps: state.kinops.kapps,
  sidebarOpen: state.layout.sidebarOpen,
  layoutSize: state.layout.size,
});
export const mapDispatchToProps = {
  loadApp: kinopsActions.loadApp,
  fetchAlerts: alertsActions.fetchAlerts,
  setSidebarOpen: layoutActions.setSidebarOpen,
};

export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    toggleSidebarOpen: props => () => props.setSidebarOpen(!props.sidebarOpen),
  }),
  lifecycle({
    componentDidMount() {
      this.props.loadApp();
      this.props.fetchAlerts();
    },
  }),
)(AppComponent);
