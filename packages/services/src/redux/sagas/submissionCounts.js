import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import * as constants from '../../constants';
import { actions, types } from '../modules/submissionCounts';
import { actions as systemErrorActions } from '../modules/systemError';

const buildSearch = (coreState, username) => {
  const searchBuilder = new CoreAPI.SubmissionSearch()
    .coreState(coreState)
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(constants.SUBMISSION_COUNT_LIMIT);

  //Add some of the optional parameters to the search based on core state
  if (coreState && coreState === 'Draft') {
    searchBuilder.eq('createdBy', username);
  } else {
    searchBuilder
      .or()
      .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, username)
      .eq('submittedBy', username)
      .end();
  }
  return searchBuilder.build();
};

export function* fetchSubmissionCountsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const [draft, submitted, closed] = yield all([
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_DRAFT, username),
      kapp: kappSlug,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_SUBMITTED, username),
      kapp: kappSlug,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_CLOSED, username),
      kapp: kappSlug,
    }),
  ]);

  const serverError =
    draft.serverError || submitted.serverError || closed.serverError;
  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else {
    yield put(
      actions.setSubmissionCounts({
        Draft: draft.submissions.length,
        Submitted: submitted.submissions.length,
        Closed: closed.submissions.length,
      }),
    );
  }
}

export function* watchSubmissionCounts() {
  yield takeEvery(types.FETCH_SUBMISSION_COUNTS, fetchSubmissionCountsSaga);
}
