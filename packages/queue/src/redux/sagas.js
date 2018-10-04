import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/queueApp';
import { watchQueue } from './sagas/queue';
import { watchErrors } from './sagas/errors';
import { watchForms } from './sagas/forms';
import { watchSettingsQueue } from './sagas/settingsQueue';
import { watchSettingsForms } from './sagas/settingsForms';

export default function* sagas() {
  yield all([
    watchErrors(),
    watchApp(),
    watchQueue(),
    watchForms(),
    watchSettingsQueue(),
    watchSettingsForms(),
  ]);
}
