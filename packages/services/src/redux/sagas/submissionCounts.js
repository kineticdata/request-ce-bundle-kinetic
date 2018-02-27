import { all, call, put, takeEvery } from 'redux-saga/effects';
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
  const [draft, submitted, closed] = yield all([
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_DRAFT),
      kapp: constants.SERVICES_KAPP,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_SUBMITTED),
      kapp: constants.SERVICES_KAPP,
    }),
    call(CoreAPI.searchSubmissions, {
      search: buildSearch(constants.CORE_STATE_CLOSED),
      kapp: constants.SERVICES_KAPP,
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
