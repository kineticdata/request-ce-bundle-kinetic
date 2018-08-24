import { all, call, select, take, put, takeEvery } from 'redux-saga/effects';
import { types, actions } from '../modules/discussions';
import { selectToken } from '../modules/socket';
import axios from 'axios';

const DISCUSSION_BASE_URL = 'http://localhost:7071/acme/app/api/v1/discussions';

const selectMessageToken = discussionId => state => {
  const discussion = state.discussions.discussions.discussions.get(
    discussionId,
  );
  return discussion.messages.pageToken;
};

const DEFAULT_MESSAGE_LIMIT = 25;
export function* fetchMoreMessagesTask(action) {
  const token = yield select(selectToken);
  const pageToken = yield select(selectMessageToken(action.payload));

  const { data } = yield call(axios.request, {
    url: `${DISCUSSION_BASE_URL}/${action.payload}/messages`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      pageToken,
      limit: DEFAULT_MESSAGE_LIMIT,
    },
  });

  const { nextPageToken, messages } = data;
  yield put(actions.setMoreMessages(action.payload, messages, nextPageToken));
}

export function* sendMessageTask(action) {
  const token = yield select(selectToken);

  const { data } = yield call(axios.request, {
    url: `${DISCUSSION_BASE_URL}/${action.payload.id}/messages`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      content: [
        {
          type: 'text',
          value: action.payload.message,
        },
      ],
    },
  });
}

export function* joinDiscussionTask(action) {
  const token = yield select(selectToken);
  const { data } = yield call(axios.request, {
    url: `${DISCUSSION_BASE_URL}/${action.payload}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  yield put(actions.addDiscussion(data.discussion));
  yield put(actions.addTopic(data.discussion.id));
}

export function* createInvitationTask({
  payload: { discussionId, type, value },
}) {
  const token = yield select(selectToken);
  try {
    yield call(axios.request, {
      url: `${DISCUSSION_BASE_URL}/${discussionId}/invitations`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { [type]: value },
    });
    yield all([
      put(actions.createInviteDone()),
      put(actions.closeModal('invitation')),
    ]);
  } catch (error) {
    const message =
      error.response.status === 400
        ? error.response.data.message
        : `Failed creating the invitation: ${error.response.statusText}`;
    yield put(actions.createInviteError(message));
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
