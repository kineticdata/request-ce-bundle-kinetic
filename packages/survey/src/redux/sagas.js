import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchNotifications } from './sagas/notifications';
import { watchRobots } from './sagas/robots';
import { watchSettingsForms } from './sagas/settingsForms';
import { watchSurveyApp } from './sagas/surveyApp';

export default function*() {
  yield all([
    watchApp(),
    watchNotifications(),
    watchRobots(),
    watchSettingsForms(),
    watchSurveyApp(),
  ]);
}
