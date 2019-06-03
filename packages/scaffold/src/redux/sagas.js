import { all } from 'redux-saga/effects';
import { watchScaffoldApp } from './sagas/scaffoldApp';

export default function*() {
  yield all([watchScaffoldApp()]);
}
