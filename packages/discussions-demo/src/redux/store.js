import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { Record } from 'immutable';
import { Utils } from 'common';
import commonReducers from 'common/src/redux/reducers';
import { sagas } from 'app/src/redux/sagas';
import reducers from 'app/src/redux/reducers';
import { actions } from 'app/src/redux/modules/profile';
import {
  sagas as discussionSagas,
  reducers as discussionReducers,
} from 'discussions';
// import { sagas } from './sagas';
import commonSagas from 'common/src/redux/sagas';

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
        app: combineReducers(reducers),
        common: combineReducers(commonReducers),
        // services: combineReducers(servicesReducers),
        // queue: combineReducers(queueReducers),
        // space: combineReducers(spaceReducers),
        discussions: combineReducers(discussionReducers),
      }),
    ),
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
    ),
  );

  const mockProfile = Record({ username: null })({ username: 'user' });
  store.dispatch(actions.setProfile(mockProfile));

  // After we've created the store using the saga middleware we will start
  // the run it and pass it the saga watcher so that it can start watching
  // for applicable actions.
  sagaMiddleware.run(
    Utils.combineSagas([
      sagas,
      commonSagas,
      // servicesSagas,
      // queueSagas,
      // spaceSagas,
      discussionSagas,
    ]),
  );

  // Enable hot module replacement so that file changes are automatically
  // communicated to the browser when running in development mode
  // if (module.hot) {
  //   module.hot.accept('./reducers', () =>
  //     store.replaceReducer(connectRouter(history)(combineReducers(reducers))),
  //   );
  // }
  return store;
};
