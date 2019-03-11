import { takeEvery, put, call, select } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from 'react-kinetic-lib';
import { actions, types, METRICS_FORM_SLUG } from '../modules/metrics';
import isarray from 'isarray';

export function* fetchMetricsSaga({
  payload: { schedulerIds, monthly = false, dates },
}) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
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

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: METRICS_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setMetricsErrors([serverError.error || serverError.statusText]),
    );
  } else if (errors) {
    yield put(actions.setMetricsErrors(errors));
  } else {
    yield put(actions.setMetrics(submissions));
  }
}

export function* watchMetrics() {
  yield takeEvery(types.FETCH_METRICS, fetchMetricsSaga);
}
