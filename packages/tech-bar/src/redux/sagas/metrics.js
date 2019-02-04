import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import { actions, types, METRICS_FORM_SLUG } from '../modules/metrics';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchMetricsSaga({
  payload: { schedulerIds, monthly = false, dates },
}) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const searchBuilder = new CoreAPI.SubmissionSearch()
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

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: searchBuilder.build(),
      form: METRICS_FORM_SLUG,
      kapp: kappSlug,
    },
  );

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
