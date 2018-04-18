import { all } from 'redux-saga/effects';
import { watchAbout } from './sagas/about';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchProfiles } from './sagas/profiles';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/spaceForms';
import { watchApp } from './sagas/app';
import { watchSettingsUsers } from './sagas/settingsUsers';
import { watchSettingsNotifications } from './sagas/settingsNotifications';
import { watchSpaceSettings } from './sagas/spaceSettings';

export default function* sagas() {
  yield all([
    watchApp(),
    watchAbout(),
    watchSettingsDatastore(),
    watchSettingsNotifications(),
    watchProfiles(),
    watchTeams(),
    watchForms(),
    watchSettingsUsers(),
    watchSpaceSettings(),
  ]);
}
