import React from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connect as theirConnect, createProvider } from 'react-redux';
import { create as createAxiosInstance } from 'axios';
import reducer from './reducer';
import saga from './saga';

export const config = {};

export const configure = (socket, getAuthToken) => {
  config.socket = socket;
  config.getAuthToken = getAuthToken;
};

export const axios = createAxiosInstance();
axios.interceptors.request.use(request => {
  if (config.getAuthToken) {
    request.headers.Authorization = `Bearer ${config.getAuthToken()}`;
  }
  return request;
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'Discussions' })
  : compose;

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

export const dispatch = (type, payload) => store.dispatch({ type, payload });
export const dispatcher = type => payload => store.dispatch({ type, payload });

const DiscussionsProvider = createProvider('discussions');
export const Provider = props => (
  <DiscussionsProvider store={store} {...props} />
);
export const connect = mapStateToProps =>
  theirConnect(mapStateToProps, null, null, { storeKey: 'discussions' });

sagaMiddleware.run(saga);
