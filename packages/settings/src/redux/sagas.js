import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchTeams } from './sagas/team';
import { watchForms } from './sagas/spaceForms';
import { watchSpaceApp } from './sagas/spaceApp';
import { watchSettingsUsers } from './sagas/settingsUsers';
import { watchSettingsNotifications } from './sagas/settingsNotifications';
import { watchSettingsRobots } from './sagas/settingsRobots';
import { watchSettingsTranslations } from './sagas/settingsTranslations';

export default function* sagas() {
  yield all([
    watchApp(),
    watchSpaceApp(),
    watchSettingsDatastore(),
    watchSettingsNotifications(),
    watchSettingsRobots(),
    watchTeams(),
    watchForms(),
    watchSettingsUsers(),
    watchSettingsTranslations(),
  ]);
}
