import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchSurveyApp } from './sagas/surveyApp';
import { watchSettingsDatastore } from './sagas/settingsDatastore';
import { watchSettingsNotifications } from './sagas/settingsNotifications';

export default function*() {
  yield all([
    watchApp(),
    watchSurveyApp(),
    watchSettingsDatastore(),
    watchSettingsNotifications(),
  ]);
}
