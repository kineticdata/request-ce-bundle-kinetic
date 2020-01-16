import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchSurveyApp } from './sagas/surveyApp';
import { watchSettingsForms } from './sagas/settingsForms';
import { watchSubmissions } from './sagas/submissions';

export default function*() {
  yield all([
    watchApp(),
    watchSurveyApp(),
    watchSettingsForms(),
    watchSubmissions(),
  ]);
}
