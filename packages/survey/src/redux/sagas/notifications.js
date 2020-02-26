import { call, put, takeEvery } from 'redux-saga/effects';
import { searchSubmissions, SubmissionSearch } from '@kineticdata/react';
import { actions as systemErrorActions } from '../modules/errors';
import {
  actions,
  types,
  NOTIFICATIONS_FORM_SLUG,
} from '../modules/notifications';

export function* fetchNotificationsSaga() {
  const query = new SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index('createdAt');

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: NOTIFICATIONS_FORM_SLUG,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFetchNotificationsError(errors));
  } else {
    yield put(
      actions.setNotifications(
        submissions.filter(
          sub =>
            sub.values['Type'] === 'Template' &&
            sub.values['Status'] === 'Active',
        ),
        // templates: submissions.filter(sub => sub.values.Type === 'Template'),
        // snippets: submissions.filter(sub => sub.values.Type === 'Snippet'),
      ),
    );
  }
}

export function* watchNotifications() {
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
}
