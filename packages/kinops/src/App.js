import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { ToastsContainer } from './components/ToastsContainer';
import { HeaderContainer } from './components/HeaderContainer';
import { ModalFormContainer } from './components/ModalFormContainer';
import { actions as kinopsActions } from './redux/modules/kinops';
import { actions as alertsActions } from './redux/modules/alerts';
import { AppRouter } from './AppRouter';

import 'bootstrap/scss/bootstrap.scss';
import 'font-awesome/css/font-awesome.css';
import './styles/master.scss';

export const AppComponent = props => (
  <Fragment>
    <ToastsContainer />
    <ModalFormContainer />
    <HeaderContainer
      hasSidebar
      toggleSidebarOpen={() => console.log('toggle')}
    />
    <div className="App" style={{ marginTop: '49px' }}>
      {!props.loading && <AppRouter kapps={props.kapps} />}
    </div>
  </Fragment>
);

export const mapStateToProps = state => ({
  loading: state.loading,
  kapps: state.kinops.kapps,
});
export const mapDispatchToProps = {
  loadApp: kinopsActions.loadApp,
  fetchAlerts: alertsActions.fetchAlerts,
};

export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      this.props.loadApp();
      this.props.fetchAlerts();
    },
  }),
)(AppComponent);
