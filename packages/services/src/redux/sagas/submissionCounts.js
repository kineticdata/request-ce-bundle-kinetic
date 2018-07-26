import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import * as constants from '../../constants';
import { actions, types } from '../modules/submissionCounts';
import { actions as systemErrorActions } from '../modules/systemError';

const buildSearch = (coreState, username) =>
  new CoreAPI.SubmissionSearch()
    .coreState(coreState)
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(constants.SUBMISSION_COUNT_LIMIT)
    .or()
    .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, username)
    .eq('submittedBy', username)
    .end()
    .build();

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
