import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { types, actions } from '../modules/discussions';
import {
  fetchDiscussions,
  createDiscussionList,
  sortByLastMessageAt,
} from '@kineticdata/react';
import { Utils } from 'common';
import moment from 'moment';

export function* fetchDiscussionsRequestSaga(action) {
  const { title, archived, dateRange, pageSize, pageToken } = yield select(
    state => state.discussions,
  );

  const dateParams = archived
    ? Utils.calculateDateRange(yield call(() => moment()), dateRange)
    : {};

  const { discussions, nextPageToken, error } = yield call(fetchDiscussions, {
    limit: pageSize,
    pageToken,
    title,
    isArchived: archived,
    ...dateParams,
  });

  if (error) {
    yield put(actions.fetchDiscussionsFailure(error));
  } else {
    const data = createDiscussionList(discussions).sort(sortByLastMessageAt);
    yield put(actions.fetchDiscussionsSuccess({ data, nextPageToken }));
  }
}

export function* watchDiscussions() {
  yield all([
    takeEvery(
      [
        types.FETCH_DISCUSSIONS_REQUEST,
        types.FETCH_DISCUSSIONS_NEXT,
        types.FETCH_DISCUSSIONS_PREVIOUS,
      ],
      fetchDiscussionsRequestSaga,
    ),
  ]);
}
