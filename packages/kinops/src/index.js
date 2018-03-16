import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { matchPath } from 'react-router';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createHashHistory } from 'history';
import { configureStore } from './redux/store';
import { Helmet } from 'react-helmet';
import { actions as layoutActions } from './redux/modules/layout';
import { actions as kinopsActions } from './redux/modules/kinops';
import { AuthenticatedContainer } from './AuthenticatedContainer';
import { App } from './App';

// Create the history instance that enables client-side application routing.
const history = createHashHistory();

// Create the redux store with the configureStore helper found in redux/store.js
const store = configureStore(history);

ReactDOM.render(
  <Fragment>
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
    </Helmet>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AuthenticatedContainer>
          <Route path="/" component={App} />
        </AuthenticatedContainer>
      </ConnectedRouter>
    </Provider>
  </Fragment>,
  document.getElementById('root'),
);

// Initialize the kappSlug state which is normally set on location change but
// since location changes are not fired on first load we need to do this
// manually.
const match = matchPath(history.location.pathname, {
  path: '/kapps/:kappSlug',
});
store.dispatch(kinopsActions.setKappSlug(match && match.params.kappSlug));

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
