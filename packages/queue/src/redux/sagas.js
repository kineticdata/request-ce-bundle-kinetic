import { all } from 'redux-saga/effects';
import { watchApp } from './sagas/app';
import { watchQueue } from './sagas/queue';
import { watchErrors } from './sagas/errors';

export default function* sagas() {
  yield all([watchErrors(), watchApp(), watchQueue()]);
}
