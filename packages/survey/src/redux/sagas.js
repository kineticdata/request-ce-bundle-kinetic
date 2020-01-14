import { all } from 'redux-saga/effects';
import { watchSurveyApp } from './sagas/surveyApp';

export default function*() {
  yield all([watchSurveyApp()]);
}
