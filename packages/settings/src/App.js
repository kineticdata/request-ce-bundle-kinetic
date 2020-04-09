import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { LocationProvider, Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { connectedHistory, connect, context, store } from './redux/store';
import {
  CommonProvider,
  ErrorUnexpected,
  Loading,
  ModalFormContainer,
  ToastsContainer,
} from 'common';
import { is } from 'immutable';
import { I18n } from '@kineticdata/react';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { Notifications } from './components/notifications/Notifications';
import { Datastore } from './components/datastore/Datastore';
import { RobotsWrapper } from './components/robots/RobotsWrapper';
import { Users } from './components/users/Users';
import { Teams } from './components/teams/Teams';
import { Translations } from './components/translations/Translations';
import { SchedulerSettings } from './components/SchedulerSettings';
import { SpaceSettings } from './components/space_settings/SpaceSettings';
import { syncAppState } from './redux/modules/app';
import { actions as datastoreActions } from './redux/modules/settingsDatastore';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: !props.isGuest && (
        <Router>
          <Sidebar path="/*" />
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--settings`}>
            <Router>
              <SpaceSettings path="space" />
              <Datastore path="datastore/*" />
              <RobotsWrapper path="robots/*" />
              <Users path="users/*" />
              <Notifications path="notifications/*" />
              <Teams path="teams/*" />
              <SchedulerSettings path="schedulers/*" />
              <Translations path="translations/*" />
              <Settings default />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {
  fetchForms: datastoreActions.fetchForms,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchForms();
    },
  }),
);

const App = enhance(AppComponent);

export class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <CommonProvider>
            <LocationProvider hashRouting history={connectedHistory}>
              <ToastsContainer duration={5000} />
              <ModalFormContainer />
              <Router>
                <App
                  render={this.props.render}
                  path={`${this.props.appState.location}/*`}
                />
              </Router>
            </LocationProvider>
          </CommonProvider>
        </Provider>
      )
    );
  }

  // Used for matching pathname to display this App
  // Not used if package is set as Bundle Package of a Kapp
  static location = '/settings';
}
