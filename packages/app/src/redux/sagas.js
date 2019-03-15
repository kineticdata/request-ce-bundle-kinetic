import { all, fork } from 'redux-saga/effects';
import { watchAlerts } from './sagas/alerts';
import { watchApp } from './sagas/app';
import { watchAuth } from './sagas/auth';

export function* sagas() {
  yield all([watchAlerts(), watchApp(), watchAuth()]);
}

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}
