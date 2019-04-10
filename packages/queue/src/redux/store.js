import { createContext } from 'react';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext, reachify } from 'redux-first-history';
import reducers from './reducers';
import saga from './sagas';

export let store = null;
export let history = null;
export let actions = null;

export const configureStore = (hashHistory, appActions) => {
  if (!store && !history && !actions) {
    console.log('Configuring queue package redux store');

    actions = appActions;

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'QUEUE' })
      : compose;

    const sagaMiddlware = createSagaMiddleware();

    const {
      createReduxHistory,
      routerMiddleware,
      routerReducer,
    } = createReduxHistoryContext({ history: hashHistory });

    store = createStore(
      combineReducers({
        ...reducers,
        router: routerReducer,
      }),
      composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddlware)),
    );

    history = reachify(createReduxHistory(store));

    sagaMiddlware.run(saga);
  }
};

export const context = createContext(null);
