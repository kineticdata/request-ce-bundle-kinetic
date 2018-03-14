import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { KinopsModule } from 'react-kinops-common';
import { App } from './App';

import { actions } from '../redux/modules/app';

const { actions: kinopsActions } = KinopsModule;

const mapStateToProps = state => ({
  loading: state.kinops.loading || state.app.appLoading,
});

const mapDispatchToProps = {
  loadApp: kinopsActions.loadApp,
  fetchSettings: actions.fetchAppSettings,
};

export const AppContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.loadApp();
      this.props.fetchSettings();
    },
  }),
)(App);
