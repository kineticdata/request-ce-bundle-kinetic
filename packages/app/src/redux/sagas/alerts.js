import { takeEvery, call, put } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/alerts';

// Alerts Search Query
export const ALERTS_SEARCH = new CoreAPI.SubmissionSearch()
  .eq('values[Status]', 'Active')
  .include('details,values')
  .limit(1000)
  .build();

export function* fetchAlertsTask() {
  const { submissions, serverError } = yield call(CoreAPI.searchSubmissions, {
    kapp: 'admin',
    form: 'alerts',
    search: ALERTS_SEARCH,
  });

  yield put(
    serverError
      ? actions.setAlertsError(serverError)
      : actions.setAlerts(submissions),
  );
}

export function* watchAlerts() {
  yield takeEvery(types.FETCH_ALERTS, fetchAlertsTask);
}
