import { all, call, select, take, put, takeEvery } from 'redux-saga/effects';
import { types, actions } from '../modules/discussions';
import { selectToken } from '../modules/socket';
import { toastActions } from 'common';
import {
  sendMessage,
  fetchMessages,
  fetchDiscussion,
  createInvite,
} from '../../discussion_api';

const selectMessageToken = discussionId => state => {
  const discussion = state.discussions.discussions.discussions.get(
    discussionId,
  );
  return discussion.messages.pageToken;
};

export function* fetchMoreMessagesTask(action) {
  const token = yield select(selectToken);
  const pageToken = yield select(selectMessageToken(action.payload));

  const { messages, nextPageToken, error } = yield call(
    fetchMessages,
    action.payload,
    token,
    pageToken,
  );

  yield put(actions.setMoreMessages(action.payload, messages, nextPageToken));
}

export function* sendMessageTask(action) {
  const token = yield select(selectToken);

  yield call(sendMessage, action.payload, token);
}

export function* joinDiscussionTask(action) {
  const token = yield select(selectToken);
  const { discussion, error } = yield call(fetchDiscussion, {
    id: action.payload,
    token,
  });

  if (error) {
    yield put(toastActions.addError('Failed to join discussion!'));
  }
  yield put(actions.addDiscussion(discussion));
  yield put(actions.addTopic(discussion.id));
}

export function* createInvitationTask({
  payload: { discussionId, type, value },
}) {
  const token = yield select(selectToken);
  const { error } = yield call(createInvite, {
    discussionId,
    type,
    value,
    token,
  });

  if (error) {
    const message =
      error.response.status === 400
        ? error.response.data.message
        : `Failed creating the invitation: ${error.response.statusText}`;
    yield put(actions.createInviteError(message));
  } else {
    yield all([
      put(actions.createInviteDone()),
      put(actions.closeModal('invitation')),
    ]);
  }
}

export function* watchDiscussionRest() {
  yield all([
    takeEvery(types.SEND_MESSAGE, sendMessageTask),
    takeEvery(types.JOIN_DISCUSSION, joinDiscussionTask),
    takeEvery(types.FETCH_MORE_MESSAGES, fetchMoreMessagesTask),
    takeEvery(types.CREATE_INVITE, createInvitationTask),
  ]);
}
