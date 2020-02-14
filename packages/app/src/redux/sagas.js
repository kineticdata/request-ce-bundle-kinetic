import { all, fork } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchAlerts } from './sagas/alerts';
import { watchApp } from './sagas/app';
import { watchProfile } from './sagas/profile';
import { watchTeams } from './sagas/teams';

export function* sagas() {
  yield all([
    watchAbout(),
    watchAlerts(),
    watchApp(),
    watchProfile(),
    watchTeams(),
  ]);
}

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}
