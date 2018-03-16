import { eventChannel, delay } from 'redux-saga';
import {
  take,
  call,
  cancel,
  cancelled,
  put,
  race,
  all,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { commonActions } from 'common';
import { types, actions } from '../modules/discussions';
import { selectServerUrl } from '../selectors';

import {
  MESSAGE_LIMIT,
  sendMessage,
  sendAttachment,
  fetchMessages,
  fetchIssue,
  createIssue,
  touchIssuePresence,
  fetchUploads,
  fetchInvites,
  createInvite,
  fetchParticipants,
  fetchResponseProfile,
  getResponseAuthentication,
} from '../../utils/discussion_api';

export const SUBMISSION_INCLUDES =
  'details,values,attributes,form,form.attributes';

// Supporting documentation:
// * https://medium.com/@ebakhtarov/bidirectional-websockets-with-redux-saga-bfd5b677c7e7
// * https://github.com/redux-saga/redux-saga/issues/51#issuecomment-230083283

// Register socket events to the Saga event channel.
export function registerChannel(socket) {
  /* eslint-disable no-param-reassign */
  return eventChannel(emit => {
    socket.onopen = () => {
      emit({ action: 'connected' });
    };

    socket.onerror = event => {
      window.console.log('there was a socket error', event);
    };

    socket.onmessage = event => {
      const msg = JSON.parse(event.data);
      emit(msg);
    };

    socket.onclose = event => {
      window.console.log('socket closed!', event);
      emit({ action: 'reconnect' });
    };

    return () => {
      socket.close();
    };
  });
}

export function* incomingMessages(socketChannel, guid) {
  try {
    // eslint-disable-next-line
    while (true) {
      const data = yield take(socketChannel);
      switch (data.action) {
        case 'message:create':
          yield put(actions.receiveMessage(guid, data.message));
          break;
        case 'message:update':
          yield put(actions.updateMessage(guid, data.message));
          break;
        case 'presence:add':
          yield put(actions.addPresence(guid, data.user));
          break;
        case 'presence:remove':
          yield put(actions.removePresence(guid, data.user));
          break;
        case 'participant:create':
          yield put(actions.addParticipant(guid, data.participant));
          break;
        case 'participant:delete':
          yield put(actions.removeParticipant(guid, data.participant));
          break;
        case 'invite:create':
          yield put(actions.addInvite(guid, data.invite));
          break;
        case 'invite:delete':
          yield put(actions.removeInvite(guid, data.invite));
          break;
        case 'reconnect':
          yield put(actions.reconnect(guid));
          break;
        case 'connected':
          yield put(actions.setConnected(guid, true));
          break;
        default:
          yield put(actions.receiveBadMessage(guid, data));
      }
    }
  } finally {
    if (yield cancelled()) {
      socketChannel.close();
    }
  }
}

export function* presenceKeepAlive(guid, responseUrl) {
  while (true) {
    yield call(touchIssuePresence, guid, responseUrl);
    yield call(delay, 3000);
  }
}

export function* uploadProcessingPoller(guid, responseUrl) {
  while (true) {
    const fileUploads = yield select(
      state => state.discussions.discussions.get(guid).processingUploads,
    );

    // If there are any file uploads to process.
    if (fileUploads.size > 0) {
      // Call the /uploads API for all uploads.
      let { data } = yield call(fetchUploads, guid, responseUrl);
      const uploads = fileUploads
        .map(up => ({
          processing: up,
          upload: data.find(
            u => u.guid === up.messageable.guid && u.file_processing === false,
          ),
        }))
        .filter(up => up.upload)
        .map(up =>
          put(actions.applyUpload(guid, up.processing.guid, up.upload)),
        );

      if (uploads.size > 0) {
        yield all(uploads.toJS());
      }
    }
    yield call(delay, 3000);
  }
}

// Turned this off because the Rails impl doesn't handle incoming messages.
// function* outgoingMessages(socket) {}
//   // eslint-disable-next-line
//   while (true) {
//     const action = yield take(types.MESSAGE_TX);
//     socket.send(JSON.stringify(actions.receiveMessage(action.payload)));
//   }
// }

export const openWebSocket = (guid, responseUrl) =>
  new WebSocket(
    `${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${
      window.location.host
    }${responseUrl}/api/v1/issues/${guid}/issue_socket`,
  );

export function* watchDiscussionSocket(action) {
  const responseUrl = yield select(selectServerUrl);
  const guid = action.payload;
  let socket = yield call(openWebSocket, guid, responseUrl);
  let socketChannel = yield call(registerChannel, socket);

  while (true) {
    const { disconnect, reconnect } = yield race({
      task: [
        call(incomingMessages, socketChannel, guid),
        call(presenceKeepAlive, guid, responseUrl),
        call(uploadProcessingPoller, guid, responseUrl),
        // call(outgoingMessages, socket),
      ],
      reconnect: take(types.RECONNECT),
      disconnect: take(types.DISCONNECT),
    });

    if (reconnect) {
      socket = openWebSocket(guid, responseUrl);
      socketChannel = yield call(registerChannel, socket);
    }

    if (disconnect && disconnect.payload === guid) {
      yield cancel();
    }
  }
}

export function* createInviteTask({ payload }) {
  const responseUrl = yield select(selectServerUrl);
  const { error } = yield call(
    createInvite,
    payload.guid,
    payload.email,
    payload.note,
    responseUrl,
  );

  if (error) {
    yield put(commonActions.addError('Failed to create invitation!'));
  } else {
    yield all([
      put(actions.createInviteDone()),
      put(actions.closeModal('invitation')),
    ]);
  }
}

export const updateSubmissionDiscussionId = ({ id, guid, include }) =>
  CoreAPI.updateSubmission({
    id,
    values: { 'Discussion Id': guid },
    include: include || SUBMISSION_INCLUDES,
  });

// Step 1: Fetch the settings (response server URL)
// Step 2: Call the API to create the issue.
// Step 3: If a submission is provided, update its "Discussion Id"
export function* createIssueTask({ payload }) {
  const responseUrl = yield select(selectServerUrl);
  const { name, description, submission, onSuccess, include } = payload;

  // First we need to determine if the user is authenticated in Response.
  const { error: authenticationError } = yield call(
    fetchResponseProfile,
    responseUrl,
  );
  if (authenticationError) {
    yield call(getResponseAuthentication, responseUrl);
  }

  const { issue, error } = yield call(
    createIssue,
    { name, description },
    responseUrl,
  );

  if (error) {
    // yield a toast
  } else {
    let error;
    let updatedSubmission;

    // In a successful scenario we should toast a success, join the discussion
    // and if a submission was passed we should update its "Discussion Id" value.
    if (submission) {
      const response = yield call(updateSubmissionDiscussionId, {
        id: submission.id,
        guid: issue.guid,
        include,
      });

      error = response.serverError;
      updatedSubmission = response.submission;
    }

    if (!error && typeof onSuccess === 'function') {
      onSuccess(issue, updatedSubmission);
    }
  }
}

export const selectFetchMessageSettings = guid => state => {
  return {
    guid,
    offset: state.discussions.discussions.get(guid).messages.size,
    lastReceived: state.discussions.discussions.get(guid).lastReceived,
    responseUrl: selectServerUrl(state),
  };
};

export function* fetchMoreMessagesTask({ payload }) {
  const params = yield select(selectFetchMessageSettings(payload));

  const { messages } = yield call(fetchMessages, {
    ...params,
    lastReceived: '',
  });

  if (messages) {
    yield all([
      put(
        actions.setHasMoreMessages(payload, messages.length === MESSAGE_LIMIT),
      ),
      put(actions.setMoreMessages(payload, messages)),
    ]);
  }
}

export function* sendMessageTask(action) {
  const responseUrl = yield select(selectServerUrl);

  const { guid, message, attachment } = action.payload;

  if (attachment) {
    // Do the sending an attachment part.
    yield call(sendAttachment, { guid, responseUrl, message, attachment });
  } else {
    yield call(sendMessage, { guid, responseUrl, body: message });
  }
}

export function* joinDiscussionTask(action) {
  const responseUrl = yield select(selectServerUrl);
  // First we need to determine if the user is authenticated in Response.
  const { error } = yield call(fetchResponseProfile, responseUrl);
  if (error) {
    yield call(getResponseAuthentication, responseUrl);
  }

  const guid = action.payload;
  const params = yield select(selectFetchMessageSettings(guid));

  const {
    issue: { issue, error: issueError },
    messages: { messages, error: messagesError },
    participants: { participants, error: participantsError },
    invites: { invites, error: invitesErrors },
  } = yield all({
    issue: call(fetchIssue, guid, responseUrl),
    participants: call(fetchParticipants, guid, responseUrl),
    invites: call(fetchInvites, guid, responseUrl),
    messages: call(fetchMessages, params),
  });

  if (issueError || messagesError || participantsError || invitesErrors) {
    window.console.log('there was a problem fetching the issue and messages');
  } else {
    yield all([
      put(actions.setIssue(issue)),
      put(actions.setMessages(guid, messages)),
      put(actions.setHasMoreMessages(guid, messages.length === MESSAGE_LIMIT)),
      put(actions.setParticipants(guid, participants)),
      put(actions.setInvites(guid, invites)),
      put(actions.startConnection(params.guid)),
    ]);
  }
}

const isProcessing = message =>
  message.messageable_type === 'Upload' &&
  (message.messageable.file_processing ||
    message.messageable.file_processing === null);

export function* queueProcessingUploadsTask({ payload }) {
  let queue = [];
  if (payload.messages) {
    queue = payload.messages.filter(isProcessing);
  } else if (payload.message && isProcessing(payload.message)) {
    queue = [payload.message];
  }

  if (queue.length > 0) {
    yield put(actions.queueUploads(payload.guid, queue));
  }
}

const toggleNewMessageTitle = () => {
  const currentTitle = document.title;
  currentTitle.includes('New Message...')
    ? (document.title = currentTitle.split('New Message... | ')[1])
    : (document.title = 'New Message... | ' + currentTitle);
};

export function* watchUnreadMessages(action) {
  const isVisible = yield select(state => state.discussions.isVisible);
  const pageTitleInterval = yield select(
    state => state.discussions.pageTitleInterval,
  );
  if (!isVisible && pageTitleInterval === null) {
    const newTimer = setInterval(toggleNewMessageTitle, 1000);
    yield put(actions.setPageTitleInterval(newTimer));
  }
}

export function* watchDiscussionVisibility(action) {
  const isVisible = yield select(state => state.discussions.isVisible);
  const pageTitleInterval = yield select(
    state => state.discussions.pageTitleInterval,
  );
  const currentTitle = document.title;
  if (isVisible && pageTitleInterval !== null) {
    clearInterval(pageTitleInterval);
    yield put(actions.setPageTitleInterval(null));
    if (currentTitle.includes('New Message...')) {
      toggleNewMessageTitle();
    }
  }
}

export function* watchDiscussion() {
  yield all([
    takeEvery(types.MESSAGE_TX, sendMessageTask),
    takeEvery(types.FETCH_MORE_MESSAGES, fetchMoreMessagesTask),
    takeLatest(types.JOIN_DISCUSSION, joinDiscussionTask),
    takeLatest(types.CREATE_ISSUE, createIssueTask),
    takeEvery(types.CREATE_INVITE, createInviteTask),
    takeEvery(
      [types.SET_MESSAGES, types.SET_MORE_MESSAGES, types.MESSAGE_RX],
      queueProcessingUploadsTask,
    ),
    takeEvery(types.CONNECT, watchDiscussionSocket),
    takeEvery(types.MESSAGE_RX, watchUnreadMessages),
    takeEvery(types.SET_DISCUSSION_VISIBILITY, watchDiscussionVisibility),
  ]);
}
