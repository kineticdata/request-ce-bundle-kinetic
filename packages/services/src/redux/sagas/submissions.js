import { call, put, select, takeEvery } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';

import * as constants from '../../constants';
import { actions, types } from '../modules/submissions';

export function* fetchSubmissionsRequestSaga({ payload }) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const pageToken = yield select(state => state.submissions.pageToken);
  const coreState = yield select(state => state.submissions.coreState);
  const limit = yield select(state => state.submissions.limit);
  const searchBuilder = new SubmissionSearch()
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(limit)
    .includes([
      'details',
      'values',
      'form',
      'form.attributes',
      'form.kapp',
      'form.kapp.attributes',
      'form.kapp.space.attributes',
    ]);

  //Add some of the optional parameters to the search
  if (coreState && coreState === 'Draft') {
    searchBuilder
      .or()
      .eq('createdBy', username)
      .eq(`values[${constants.REQUESTED_BY_FIELD}]`, username)
      .end();
  } else {
    searchBuilder
      .or()
      .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, username)
      .eq(`values[${constants.REQUESTED_BY_FIELD}]`, username)
      .eq('submittedBy', username)
      .eq('createdBy', username)
      .end();
  }
  if (coreState) searchBuilder.coreState(coreState);
  if (pageToken) searchBuilder.pageToken(pageToken);
  const search = searchBuilder.build();

  const { submissions, nextPageToken, error } = yield call(searchSubmissions, {
    search,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchSubmissionsFailure(error));
  } else {
    if (coreState) {
      yield put(
        actions.fetchSubmissionsSuccess({ submissions, nextPageToken }),
      );
    } else {
      // This is needed because we need to filter out Draft Submissions that were Requested For Someone Else but Requested By or Created By me
      const filterDraftNotCreatorOrRequestedBy = submissions.filter(
        s =>
          ['Submitted', 'Closed'].includes(s.coreState) ||
          (s.coreState === 'Draft' &&
            (s.createdBy === username ||
              s.values[`${constants.REQUESTED_BY_FIELD}`] === username)),
      );
      yield put(
        actions.fetchSubmissionsSuccess({
          submissions: filterDraftNotCreatorOrRequestedBy,
          nextPageToken,
        }),
      );
    }
  }
}

export function* watchSubmissions() {
  yield takeEvery(
    [
      types.FETCH_SUBMISSIONS_REQUEST,
      types.FETCH_SUBMISSIONS_NEXT,
      types.FETCH_SUBMISSIONS_PREVIOUS,
      types.FETCH_SUBMISSIONS_CURRENT,
    ],
    fetchSubmissionsRequestSaga,
  );
}
