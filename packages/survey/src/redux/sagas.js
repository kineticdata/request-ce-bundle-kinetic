import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchNotifications } from './sagas/notifications';
import { watchRobots } from './sagas/settingsRobots';
import { watchSettingsForms } from './sagas/settingsForms';
import { watchSubmissions } from './sagas/submissions';
import { watchSurveyApp } from './sagas/surveyApp';

export default function*() {
  yield all([
    watchApp(),
    watchNotifications(),
    watchRobots(),
    watchSettingsForms(),
    watchSubmissions(),
    watchSurveyApp(),
  ]);
}
