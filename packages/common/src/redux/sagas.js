import { all } from 'redux-saga/effects';
import { watchSchedulers } from './sagas/schedulers';
import { watchToasts } from './sagas/toasts';

export default function*() {
  yield all([watchSchedulers(), watchToasts()]);
}
