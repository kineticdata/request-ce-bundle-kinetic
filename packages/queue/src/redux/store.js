import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import reducers from './reducers';
import {
  reducers as kinopsReducers,
  sagas as kinopsSagas,
  combineSagas,
} from 'react-kinops-common';
import {
  sagas as discussionSagas,
  reducers as discussionReducers,
} from 'react-kinops-discussions';
import { sagas } from './sagas';

export const configureStore = history => {
  // To enable the redux dev tools in the browser we need to conditionally use a
  // special compose method, below we are looking for that and if it does not
  // exist we use the build-in redux 'compose' method.
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // To enable the Saga Middleware to run we need to first create it.
  const sagaMiddleware = createSagaMiddleware();
  // Create the redux store using reducers imported from our 'redux/reducers'
  // module.  Note that we also have some connected react router and redux form
  // setup going on here as well.
  const store = createStore(
    connectRouter(history)(
      combineReducers({
        ...reducers,
        ...kinopsReducers,
        ...discussionReducers,
      }),
    ),
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
    ),
  );

  // After we've created the store using the saga middleware we will start
  // the run it and pass it the saga watcher so that it can start watching
  // for applicable actions.
  sagaMiddleware.run(combineSagas([sagas, kinopsSagas, discussionSagas]));

  // Enable hot module replacement so that file changes are automatically
  // communicated to the browser when running in development mode
  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(connectRouter(history)(combineReducers(reducers))),
    );
  }
  return store;
};
