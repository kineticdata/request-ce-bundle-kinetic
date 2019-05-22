import { takeEvery, call, put } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';
import { List } from 'immutable';
import moment from 'moment';

import { actions, types } from '../modules/alerts';

// Alerts Search Query
export const ALERTS_SEARCH = new SubmissionSearch(true)
  .eq('values[Status]', 'Active')
  .index('values[Status]')
  .include('details,values')
  .limit(1000)
  .build();

export function* fetchAlertsRequestSaga() {
  const { submissions, error } = yield call(searchSubmissions, {
    datastore: true,
    form: 'alerts',
    search: ALERTS_SEARCH,
  });

  if (error) {
    yield put(actions.fetchAlertsFailure(error));
  } else {
    const alerts = List(submissions)
      .filter(
        alert =>
          !alert.values['End Date Time'] ||
          moment(alert.values['End Date Time']).isAfter(),
      )
      .filter(
        alert =>
          !alert.values['Start Date Time'] ||
          moment(alert.values['Start Date Time']).isBefore(),
      )
      .sortBy(alert =>
        moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
      )
      .reverse();
    yield put(actions.fetchAlertsSuccess(alerts));
  }
}

export function* watchAlerts() {
  yield takeEvery(types.FETCH_ALERTS_REQUEST, fetchAlertsRequestSaga);
}
