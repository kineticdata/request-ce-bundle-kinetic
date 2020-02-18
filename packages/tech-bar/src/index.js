import React, { Component } from 'react';
import { Provider } from 'react-redux';
import matchPath from 'rudy-match-path';
import { LocationProvider, Router } from '@reach/router';
import { CommonProvider, ModalFormContainer, ToastsContainer } from 'common';
import { is } from 'immutable';
import { connectedHistory, context, store } from './redux/store';
import { syncAppState } from './redux/modules/app';
import { App } from './App';

export default class extends Component {
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

  static shouldSuppressSidebar = ({ appLocation, location }) =>
    matchPath(location.pathname, { path: appLocation }) &&
    !matchPath(location.pathname, { path: `${appLocation}/settings` });

  static shouldHideHeader = ({ appLocation, location }) =>
    matchPath(location.pathname, { path: `${appLocation}/display` });

  // Set to true if package allows public (unauthenticated) routes
  static hasPublicRoutes = false;
}
