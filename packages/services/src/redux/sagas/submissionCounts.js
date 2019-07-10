import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';
import * as constants from '../../constants';
import { actions, types } from '../modules/submissionCounts';

const buildSearch = (coreState, username) => {
  const searchBuilder = new SubmissionSearch()
    .coreState(coreState)
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(constants.SUBMISSION_COUNT_LIMIT);

  //Add some of the optional parameters to the search based on core state
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
      .eq('submittedBy', username)
      .end();
  }
  return searchBuilder.build();
};

export function* fetchSubmissionCountsRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);
  const username = yield select(state => state.app.profile.username);

  const [draft, submitted, closed] = yield all([
    call(searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_DRAFT, username),
      kapp: kappSlug,
    }),
    call(searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_SUBMITTED, username),
      kapp: kappSlug,
    }),
    call(searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_CLOSED, username),
      kapp: kappSlug,
    }),
  ]);

  yield put(
    actions.fetchSubmissionCountsComplete({
      Draft: draft.submissions ? draft.submissions.length : null,
      Submitted: submitted.submissions ? submitted.submissions.length : null,
      Closed: closed.submissions ? closed.submissions.length : null,
    }),
  );
}

export function* watchSubmissionCounts() {
  yield takeEvery(
    types.FETCH_SUBMISSION_COUNTS_REQUEST,
    fetchSubmissionCountsRequestSaga,
  );
}
