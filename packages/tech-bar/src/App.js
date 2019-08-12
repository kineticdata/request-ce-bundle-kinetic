import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
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
import { Home } from './components/Home';
import { Past } from './components/Past';
import { TechBars } from './components/TechBars';
import { Display } from './components/Display';
import { Form } from './components/Form';
import { AppointmentForm } from './components/AppointmentForm';
import { Settings } from './components/settings/Settings';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { syncAppState } from './redux/modules/app';
import { actions } from './redux/modules/techBarApp';
import './assets/styles/master.scss';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: (
        <Router>
          <SettingsSidebar
            settingsBackPath={props.settingsBackPath}
            path="settings/*"
          />
          <Sidebar
            counts={props.submissionCounts}
            homePageMode={props.homePageMode}
            homePageItems={props.homePageItems}
            openSettings={props.openSettings}
            path="*"
          />
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--tech-bar`}>
            <Router>
              <Settings path="settings/*" />
              <Home path="/" />
              <TechBars path="/tech-bars" />
              <AppointmentForm path="/past/appointment/:techBarId/:id" />
              <Past path="/past" />
              <AppointmentForm path="/appointment/:techBarId/:id" />
              <AppointmentForm path="/appointment/:techBarId" />
              <AppointmentForm path="/appointment/:id" />
              <AppointmentForm path="/appointment" />
              <Form path="/forms/:formSlug/submissions/:id" />
              <Form path="/forms/:formSlug" />
              <Display path="/display/:techBarId/:mode" />
              <Display path="/display/:techBarId" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.techBarApp.loading,
  error: state.techBarApp.error,
  settingsBackPath: `/kapps/${state.app.kappSlug}`,
});

const mapDispatchToProps = {
  fetchAppDataRequest: actions.fetchAppDataRequest,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppDataRequest();
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

  static shouldSuppressSidebar = (pathname, kappSlug) =>
    matchPath(pathname, { path: `/kapps/${kappSlug}` }) &&
    !matchPath(pathname, { path: `/kapps/${kappSlug}/settings` });
  static shouldHideHeader = (pathname, kappSlug) =>
    matchPath(pathname, { path: `/kapps/${kappSlug}/display` });
}
