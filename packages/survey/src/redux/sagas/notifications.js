import { call, put, takeEvery } from 'redux-saga/effects';
import {
  searchSubmissions,
  SubmissionSearch,
  fetchSubmission,
  createSubmission,
} from '@kineticdata/react';
import { Seq, Map } from 'immutable';
import { actions as systemErrorActions } from '../modules/errors';
import {
  actions,
  types,
  NOTIFICATIONS_FORM_SLUG,
} from '../modules/notifications';
import { push } from 'redux-first-history';

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
      ),
    );
  }
}

export function* cloneNotificationSaga(action) {
  const include = 'details,values,form,form.fields.details';
  const { submission, errors, serverError } = yield call(fetchSubmission, {
    id: action.payload,
    include,
    datastore: true,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setCloneError(errors));
  } else {
    // The values of attachment fields cannot be cloned so we will filter them out
    // of the values POSTed to the new submission.
    const attachmentFields = Seq(submission.form.fields)
      .filter(field => field.dataType === 'file')
      .map(field => field.name)
      .toSet();

    // Some values on the original submission should be reset.
    const overrideFields = Map({
      Status: 'Inactive',
      'Discussion Id': null,
      Observers: [],
    });

    // Copy the values from the original submission with the transformations
    // described above.
    const values = Seq(submission.values)
      .filter((value, fieldName) => !attachmentFields.contains(fieldName))
      .map((value, fieldName) => overrideFields.get(fieldName) || value)
      .toJS();

    // Make the call to create the clone.
    const {
      submission: cloneSubmission,
      postErrors,
      postServerError,
    } = yield call(createSubmission, {
      datastore: true,
      formSlug: submission.form.slug,
      values,
      completed: false,
    });

    if (postServerError) {
      yield put(systemErrorActions.setSystemError(serverError));
    } else if (postErrors) {
      yield put(actions.setCloneError(postErrors));
    } else {
      // Determine the type route parameter for the redirect below based on
      // either the form slug or the value of the 'Type' field.
      yield put(actions.setCloneSuccess());
      yield put(actions.fetchNotifications());
      yield put(
        push(`/settings/notifications/templates/${cloneSubmission.id}`),
      );
    }
  }
}

export function* watchNotifications() {
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
  yield takeEvery(types.CLONE_NOTIFICATION, cloneNotificationSaga);
}
