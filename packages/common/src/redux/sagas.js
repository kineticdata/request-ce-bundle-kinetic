import { all } from 'redux-saga/effects';
import { watchSchedulers } from './sagas/schedulers';
import { watchSearchHistory } from './sagas/searchHistory';
import { watchDiscussionRest } from './sagas/discussions.rest';
import { watchLocationChange } from './sagas/location';

export default function*() {
  yield all([
    watchSchedulers(),
    watchSearchHistory(),
    watchDiscussionRest(),
    watchLocationChange(),
  ]);
}
