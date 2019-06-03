import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import { LocationProvider, Router as ReachRouter } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import {
  connectedHistory,
  connect,
  context,
  store,
} from 'discussions/src/redux/store';
import { CommonProvider, ErrorUnexpected, Loading } from 'common';
import { is } from 'immutable';
import { I18n } from '@kineticdata/react';

import { Discussions } from './components/Discussions';
import { Discussion } from './components/Discussion';
import { syncAppState } from './redux/modules/app';
import './assets/styles/master.scss';

export const Router = ({ children, ...props }) => (
  <ReachRouter {...props} primary={false} component={Fragment}>
    {children}
  </ReachRouter>
);

const AppComponent = props => {
  if (props.error) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      main: (
        <I18n>
          <main className={`package-layout package-layout--discussions`}>
            <Router>
              <Discussions path="/" />
              <Discussion path="/:id" />
            </Router>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({});

const mapDispatchToProps = {};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {},
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
            <LocationProvider history={connectedHistory}>
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
  static location = '/discussions';
}
