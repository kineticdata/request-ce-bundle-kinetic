import { all } from 'redux-saga/effects';
import { watchSocket, watchToken } from './sagas/socket';
import { watchDiscussionRest } from './sagas/discussions.rest';

export function* sagas() {
  yield all([watchSocket(), watchToken(), watchDiscussionRest()]);
}
