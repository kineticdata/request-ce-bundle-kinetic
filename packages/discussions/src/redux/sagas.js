import { all } from 'redux-saga/effects';
import { watchDiscussions } from './sagas/discussions';

export default function*() {
  yield all([watchDiscussions()]);
}
