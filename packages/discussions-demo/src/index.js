import React from 'react';
import ReactDOM from 'react-dom';
import { matchPath } from 'react-router';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createHashHistory } from 'history';
import { configureStore } from './redux/store';
import axios from 'axios';
import { CoreAPI } from 'react-kinetic-core';
import AuthInterceptor from 'app/src/utils/AuthInterceptor';

import { actions as layoutActions } from 'app/src/redux/modules/layout';
import { actions as configActions } from 'app/src/redux/modules/config';
import {
  actions as authActions,
  selectors as authSelectors,
} from 'app/src/redux/modules/auth';

import { AuthenticatedContainer } from 'app/src/AuthenticatedContainer';

import { AppContainer } from './App';

// Create the history instance that enables client-side application routing.
const history = createHashHistory();

// Create the redux store with the configureStore helper found in redux/store.js
const store = configureStore(history);

const authInterceptor = new AuthInterceptor(
  store,
  authActions.timedOut,
  authSelectors.authenticatedSelector,
  authSelectors.cancelledSelector,
);
axios.interceptors.response.use(null, authInterceptor.handleRejected);
CoreAPI.addResponseInterceptor(null, authInterceptor.handleRejected);
CoreAPI.setDefaultAuthAssumed(true);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AuthenticatedContainer>
        <Route path="/" component={AppContainer} />
      </AuthenticatedContainer>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// Initialize the kappSlug state which is normally set on location change but
// since location changes are not fired on first load we need to do this
// manually.
const match = matchPath(history.location.pathname, {
  path: '/kapps/:kappSlug',
});
store.dispatch(configActions.setKappSlug(match && match.params.kappSlug));

// Add global listeners
[
  ['small', window.matchMedia('(max-width: 767px)')],
  ['medium', window.matchMedia('(min-width: 768px) and (max-width: 1200px)')],
  ['large', window.matchMedia('(min-width: 1201px)')],
].forEach(([size, mql]) => {
  mql.addListener(event => {
    if (event.matches) {
      store.dispatch(layoutActions.setSize(size));
    }
  });
  if (mql.matches) {
    store.dispatch(layoutActions.setSize(size));
  }
});
