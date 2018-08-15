import { all, fork } from 'redux-saga/effects';
// import { watchDiscussion, watchJoinDiscussion } from './sagas/discussions';
import { watchDiscussions } from './sagas/discussions.socket';
import { watchDiscussionRest } from './sagas/discussions.rest';

export function* sagas() {
  yield all([watchDiscussions(), watchDiscussionRest()]);
}

// export function* sagas() {
//   yield all([watchDiscussion(), watchJoinDiscussion()]);
// }

// export function combineSagas(allSagas) {
//   console.log(allSagas);
//   return function* combinedSagas() {
//     yield all(allSagas.map(s => fork(s)));
//   };
// }
