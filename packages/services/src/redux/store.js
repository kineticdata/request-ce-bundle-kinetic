import { createContext } from 'react';
import { connect as connectRedux } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext, reachify } from 'redux-first-history';
import { history } from '@kineticdata/react';
import reducers from './reducers';
import sagas from './sagas';

console.log('Configuring services package redux store');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'SERVICES' })
  : compose;

const sagaMiddlware = createSagaMiddleware();

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({ history });

export const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddlware)),
);

export const connectedHistory = reachify(createReduxHistory(store));

sagaMiddlware.run(sagas);

export const context = createContext(null);

export const connect = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {},
) =>
  connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, {
    ...options,
    context,
  });
