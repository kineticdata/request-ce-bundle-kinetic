import { takeEvery, put, call, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';
import { addToastAlert } from 'common';
import { actions, types } from '../modules/metrics';
import { METRICS_FORM_SLUG } from '../../constants';
import isarray from 'isarray';

export function* fetchMetricsRequestSaga({
  payload: { schedulerIds, monthly = false, dates },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .coreState('Submitted')
    .eq('values[Period Type]', monthly ? 'Monthly' : 'Daily');

  if (isarray(schedulerIds) && schedulerIds.length > 0) {
    searchBuilder.in('values[Scheduler Id]', schedulerIds);
  }
  if (isarray(dates) && dates.length > 0) {
    searchBuilder.in('values[Period]', dates);
  }

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: METRICS_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    addToastAlert({
      title: 'Error retrieving metrics data.',
      message: error.message,
    });
    yield put(actions.fetchMetricsFailure(error));
  } else {
    yield put(actions.fetchMetricsSuccess(submissions));
  }
}

export function* watchMetrics() {
  yield takeEvery(types.FETCH_METRICS_REQUEST, fetchMetricsRequestSaga);
}
