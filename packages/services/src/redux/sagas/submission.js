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
import {
  fetchSubmission,
  createSubmission,
  deleteSubmission,
  updateSubmission,
  fetchDiscussions,
  createRelatedItem,
  createDiscussion,
  sendMessage,
} from '@kineticdata/react';
import { Map, Seq } from 'immutable';
import { push } from 'connected-react-router';

import { actions, types } from '../modules/submission';
import { actions as systemErrorActions } from '../modules/systemError';
import { getCancelFormConfig, getCommentFormConfig } from '../../utils';

export function* fetchSubmissionSaga(action) {
  const include =
    'details,values,form,form.attributes,form.kapp.attributes,' +
    'form.kapp.space.attributes,activities,activities.details';
  const { submission, errors, serverError } = yield call(fetchSubmission, {
    id: action.payload,
    include,
  });

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
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const { submission, errors, serverError } = yield call(fetchSubmission, {
    id: action.payload,
    include,
  });

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
    } = yield call(createSubmission, {
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
  const { errors, serverError } = yield call(deleteSubmission, {
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

export function* fetchDiscussionSaga(action) {
  const { discussions } = yield call(fetchDiscussions, {
    relatedItem: {
      type: 'Submission',
      key: action.payload,
    },
  });

  if (discussions && discussions.length > 0) {
    yield put(actions.setDiscussion(discussions[0]));
  }
}

export function* sendMessageSaga(action) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const submission = yield select(state => state.services.submission.data);
  let discussion = yield select(state => state.services.submission.discussion);
  const profile = yield select(state => state.app.profile);
  const sendMessageType = yield select(
    state => state.services.submission.sendMessageType,
  );
  // Create the Discussion if it doesn't exist for the submission
  if (discussion === null) {
    const discussionProps = {
      title: submission.label,
      description: `Global discussion for ${submission.label}`,
      owningUsers: [{ username: profile.username }],
    };
    const { discussion: newDiscussion } = yield call(
      createDiscussion,
      discussionProps,
    );

    if (newDiscussion) {
      discussion = newDiscussion;
      // Relate the new Discussion to the Submission
      yield call(createRelatedItem, discussion.id, {
        type: 'Submission',
        key: submission.id,
      });
      // Create an Initial Message in the Disussion to provide context
      const initialMessage = `I would like to start a discussion about my ${
        submission.form.name
      } - ${submission.label} request (with confirmation ${submission.handle})`;

      yield call(sendMessage, {
        id: discussion.id,
        message: initialMessage,
      });

      // Update Submission with Discussion ID
      yield call(updateSubmission, {
        id: submission.id,
        values: { 'Discussion Id': discussion.id },
      });

      yield put(actions.setDiscussion(discussion));
    }
  }
  // Send the Comment/Cancel Request Message
  const commentMessage =
    sendMessageType === 'comment'
      ? action.payload
      : `I would like to cancel my ${submission.form.name} - ${
          submission.label
        } request (with confirmation ${submission.handle}) 
        
        ${action.payload}`;

  yield call(sendMessage, {
    id: discussion.id,
    message: commentMessage,
  });

  const formConfig =
    sendMessageType === 'comment'
      ? getCommentFormConfig(kappSlug, submission.id, action.payload)
      : getCancelFormConfig(kappSlug, submission.id, action.payload);

  yield call(createSubmission, formConfig);
  yield put(actions.setSendMessageModalOpen(false));
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
    const { submission, serverError } = yield call(fetchSubmission, {
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
  yield takeEvery(types.FETCH_DISCUSSION, fetchDiscussionSaga);
  yield takeEvery(types.SEND_MESSAGE, sendMessageSaga);
}
