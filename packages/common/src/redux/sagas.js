import { all } from 'redux-saga/effects';
import { watchToasts } from './sagas/toasts';

export default function*() {
  yield all([
    watchToasts(),
  ]);
}
