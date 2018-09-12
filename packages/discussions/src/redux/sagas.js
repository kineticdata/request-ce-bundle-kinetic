import { all } from 'redux-saga/effects';
import { watchSocket, watchToken } from './sagas/socket';
import { watchDiscussionsSocket } from './sagas/discussions.socket';
import { watchDiscussionRest } from './sagas/discussions.rest';

export function* sagas() {
  yield all([
    watchSocket(),
    watchToken(),
    watchDiscussionsSocket(),
    watchDiscussionRest(),
  ]);
}
