import { all, fork } from 'redux-saga/effects';
import { watchDiscussion, watchJoinDiscussion } from './sagas/discussions';

export function* sagas() {
  yield all([watchDiscussion(), watchJoinDiscussion()]);
}

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}
