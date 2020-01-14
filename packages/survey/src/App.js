import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { LocationProvider, Router } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import {
  CommonProvider,
  ErrorUnexpected,
  Loading,
  ModalFormContainer,
  ToastsContainer,
} from 'common';
import { is } from 'immutable';
import { I18n } from '@kineticdata/react';
import { connectedHistory, connect, context, store } from './redux/store';
import { syncAppState } from './redux/modules/app';

import { Sidebar } from './components/Sidebar';
import { SurveyHome } from './components/home/SurveyHome';
import { Form } from './components/Form';
import { Settings } from './components/settings/Settings';
import { Sidebar as SettingsSidebar } from './components/settings/Sidebar';
import { actions } from './redux/modules/surveyApp';

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      sidebar: (
        <Router>
          <SettingsSidebar path="settings/*" />
          <Sidebar path="*" />
        </Router>
      ),
      main: (
        <I18n>
          <main className={`package-layout package-layout--survey`}>
            <Router>
              <Settings path="/settings/*" homePath="../" />
              <SurveyHome
                path="/"
                homePageMode={props.homePageMode}
                homePageItems={props.homePageItems}
              />
              <Form
                path="/forms/:formSlug/submissions/:id"
                homePath="../../../../"
              />
              <Form path="/forms/:formSlug" homePath="../../../../" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.surveyApp.loading,
  error: state.surveyApp.error,
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

  // Used for matching pathname to display this App
  // Not used if package is set as Bundle Package of a Kapp
  static location = '/survey';
}
