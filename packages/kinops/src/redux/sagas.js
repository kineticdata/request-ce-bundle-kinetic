import { all, fork } from 'redux-saga/effects';
import { watchKinops } from './sagas/kinops';
import { watchToasts } from './sagas/toasts';

export function* sagas() {
  yield all([watchKinops(), watchToasts()]);
}

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}
