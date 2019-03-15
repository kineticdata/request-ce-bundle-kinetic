import { all } from 'redux-saga/effects';
import { watchDiscussionRest } from './sagas/discussions.rest';

export function* sagas() {
  yield all([watchDiscussionRest()]);
}
