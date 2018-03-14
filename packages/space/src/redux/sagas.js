import { all } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchDatastore } from './sagas/datastore';
import { watchProfiles } from './sagas/profiles';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/forms';
import { watchApp } from './sagas/app';

export function* sagas() {
  yield all([
    watchApp(),
    watchAbout(),
    watchDatastore(),
    watchProfiles(),
    watchTeams(),
    watchForms(),
  ]);
}
