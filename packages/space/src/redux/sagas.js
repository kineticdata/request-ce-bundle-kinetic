import { all } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchProfiles } from './sagas/profiles';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/spaceForms';
import { watchApp } from './sagas/app';
import { watchSettingsUsers } from './sagas/settingsUsers';

export default function* sagas() {
  yield all([
    watchApp(),
    watchAbout(),
    watchSettingsDatastore(),
    watchProfiles(),
    watchTeams(),
    watchForms(),
    watchSettingsUsers(),
  ]);
}
