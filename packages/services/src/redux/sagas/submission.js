import { delay } from 'redux-saga';
import {
  call,
  put,
  cancel,
  take,
  fork,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { Map, Seq } from 'immutable';
import { push } from 'connected-react-router';

import { actions, types } from '../modules/submission';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchSubmissionSaga(action) {
  const include =
    'details,values,form,form.attributes,form.kapp.attributes,' +
    'form.kapp.space.attributes,activities,activities.details';
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    { id: action.payload, include },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setSubmissionErrors(errors));
  } else {
    yield put(actions.setSubmission(submission));
  }
}

export function* cloneSubmissionSaga(action) {
  const include = 'details,values,form,form.fields.details,form.kapp';
  const kappSlug = yield select(state => state.app.app.kappSlug);
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    { id: action.payload, include },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.cloneSubmissionErrors(errors));
  } else {
    // The values of attachment fields cannot be cloned so we will filter them out
    // of the values POSTed to the new submission.
    const attachmentFields = Seq(submission.form.fields)
      .filter(field => field.dataType === 'file')
      .map(field => field.name)
      .toSet();

    // Some values on the original submission should be reset.
    const overrideFields = Map({
      Status: 'Draft',
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
    } = yield call(CoreAPI.createSubmission, {
      kappSlug: submission.form.kapp.slug,
      formSlug: submission.form.slug,
      values,
      completed: false,
    });

    if (postServerError) {
      yield put(systemErrorActions.setSystemError(serverError));
    } else if (postErrors) {
      yield put(actions.cloneSubmissionErrors(postErrors));
    } else {
      yield put(actions.cloneSubmissionSuccess());
      yield put(
        push(`/kapps/${kappSlug}/requests/Draft/request/${cloneSubmission.id}`),
      );
    }
  }
}

export function* deleteSubmissionSaga(action) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id: action.payload.id,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.deleteSubmissionErrors(errors));
  } else {
    yield put(actions.deleteSubmissionSuccess());
    if (typeof action.payload.callback === 'function') {
      action.payload.callback();
    }
  }
}

export function* pollerTask(id) {
  const include =
    'details,values,form,form.attributes,form.kapp.attributes,' +
    'form.kapp.space.attributes,activities,activities.details';
  let pollDelay = 5000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Wait
    yield delay(pollDelay);
    // Query
    const { submission, serverError } = yield call(CoreAPI.fetchSubmission, {
      id,
      include,
    });
    // If there is a server error dispatch the appropriate action and break out
    // of the while loop to stop polling.
    if (serverError) {
      yield put(systemErrorActions.setSystemError(serverError));
      yield put(actions.stopSubmissionPoller());
      break;
    } else {
      yield put(actions.setSubmission(submission));
      pollDelay = Math.min(pollDelay + 5000, 30000);
    }
  }
}

export function* watchSubmissionPoller() {
  let action;
  // eslint-disable-next-line no-cond-assign
  while ((action = yield take(types.START_SUBMISSION_POLLER))) {
    // start the poller in the background
    const poller = yield fork(pollerTask, action.payload);
    // wait for the message to stop the poller
    yield take(types.STOP_SUBMISSION_POLLER);
    // stop the poller by cancelling the background task
    yield cancel(poller);
  }
}

export function* watchSubmission() {
  yield takeEvery(types.FETCH_SUBMISSION, fetchSubmissionSaga);
  yield takeEvery(types.CLONE_SUBMISSION, cloneSubmissionSaga);
  yield takeEvery(types.DELETE_SUBMISSION, deleteSubmissionSaga);
}
