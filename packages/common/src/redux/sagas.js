import { all } from 'redux-saga/effects';
import { watchSchedulers } from './sagas/schedulers';
import { watchSearchHistory } from './sagas/searchHistory';
import { watchToasts } from './sagas/toasts';
import { watchDiscussionRest } from './sagas/discussions.rest';

export default function*() {
  yield all([
    watchSchedulers(),
    watchSearchHistory(),
    watchToasts(),
    watchDiscussionRest(),
  ]);
}
