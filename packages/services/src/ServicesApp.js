import { is } from 'immutable';
import { LocationProvider, Router as ReachRouter } from '@reach/router';
import React, { Component, Fragment } from 'react';
import { connectedHistory, context, store } from 'services/src/redux/store';
import { CommonProvider } from 'common';
import { types } from './redux/modules/app';
import { App } from './App';
import { Provider } from 'react-redux';

export const Router = ({ children, ...props }) => (
  <ReachRouter {...props} primary={false} component={Fragment}>
    {children}
  </ReachRouter>
);

export const syncAppState = ([key, value]) => {
  store.dispatch({ type: types.SYNC_APP_STATE, payload: { key, value } });
};

export class ServicesApp extends Component {
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
}
