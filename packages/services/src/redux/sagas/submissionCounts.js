import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { bundle, CoreAPI } from 'react-kinetic-core';
import * as constants from '../../constants';
import { actions, types } from '../modules/submissionCounts';
import { actions as systemErrorActions } from '../modules/systemError';

const buildSearch = coreState =>
  new CoreAPI.SubmissionSearch()
    .coreState(coreState)
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(constants.SUBMISSION_COUNT_LIMIT)
    .or()
    .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, bundle.identity())
    .eq('submittedBy', bundle.identity())
    .end()
    .build();

export function* fetchSubmissionCountsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const [draft, submitted, closed] = yield all([
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_DRAFT),
      kapp: kappSlug,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_SUBMITTED),
      kapp: kappSlug,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_CLOSED),
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
