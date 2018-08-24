import { all } from 'redux-saga/effects';
import { watchSocket } from './sagas/socket';
import { watchDiscussionsSocket } from './sagas/discussions.socket';
import { watchDiscussionRest } from './sagas/discussions.rest';

export function* sagas() {
  yield all([watchSocket(), watchDiscussionsSocket(), watchDiscussionRest()]);
}
