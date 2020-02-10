import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchSurveyApp } from './sagas/surveyApp';
import { watchSurveys } from './sagas/surveys';
import { watchNotifications } from './sagas/notifications';

export default function*() {
  yield all([
    watchApp(),
    watchSurveyApp(),
    watchSurveys(),
    watchNotifications(),
  ]);
}
