import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { KinopsModule } from 'react-kinops-common';
import { actions } from '../redux/modules/app';

import { App } from './App';

const { actions: kinopsActions } = KinopsModule;

const mapStateToProps = state => ({
  loading: state.app.loading || state.kinops.loading,
});

const mapDispatchToProps = {
  loadApp: kinopsActions.loadApp,
  loadAppSettings: actions.loadAppSettings,
};

export const AppContainer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.loadApp();
      this.props.loadAppSettings();
    },
  }),
)(App);
