import { eventChannel } from 'redux-saga';
import {
  all,
  cancelled,
  race,
  take,
  put,
  call,
  cancel,
  fork,
  select,
  takeEvery,
} from 'redux-saga/effects';

import {
  fetchDiscussion,
  fetchMessages,
  sendMessage,
  updateMessage,
} from '../discussionApi';
import { config } from './store';
import {
  ADD_DISCUSSION,
  JOIN_DISCUSSION,
  LEAVE_DISCUSSION,
  FETCH_MORE_MESSAGES,
  actions,
  SEND_MESSAGE,
  SEND_MESSAGE_UPDATE,
} from './reducer';

export function registerTopicChannel(topic) {
  return eventChannel(emit => {
    topic
      .onPresence((op, presenceData) => {
        emit({ event: 'presence', payload: { op, presenceData } });
      })
      .onStatus(status => emit({ event: 'status', payload: status }))
      .on('message:created', emit)
      .on('message:updated', emit)
      .on('message:deleted', emit)
      .on('participant:created', emit)
      .on('participant:updated', emit)
      .on('participant:deleted', emit)
      .on('invitation:created', emit)
      .on('invitation:updated', emit)
      .on('invitation:deleted', emit)
      .on('relatedItem:created', emit)
      .on('relatedItem:deleted', emit)
      .on('discussion:updated', emit)
      .on('discussion:deleted', emit);

    return () => topic.unsubscribe();
  });
}

export function* handleTopicChannel(channel, id, socket, topic) {
  try {
    while (true) {
      const topicEvent = yield take(channel);
      switch (topicEvent.event) {
        case 'status':
          yield put(actions.setTopicStatus(id, topicEvent.payload));
          break;
        case 'presence':
          yield put(actions.updatePresence(id, topic.presence()));
          break;
        case 'discussion:updated':
          yield put(actions.updateDiscussion(topicEvent.payload));
          break;
        case 'message:created':
          yield put(actions.addMessage(id, topicEvent.payload));
          break;
        case 'message:updated':
          yield put(actions.updateMessage(id, topicEvent.payload));
          break;
        case 'message:deleted':
          yield put(actions.removeMessage(id, topicEvent.payload));
          break;
        case 'participant:created':
          yield put(actions.addParticipant(id, topicEvent.payload));
          break;
        case 'participant:deleted':
          yield put(actions.removeParticipant(id, topicEvent.payload));
          break;
        case 'participant:updated':
          yield put(actions.updateParticipant(id, topicEvent.payload));
          break;
        case 'invitation:created':
          yield put(actions.addInvitation(id, topicEvent.payload));
          break;
        case 'invitation:deleted':
          yield put(actions.removeInvitation(id, topicEvent.payload));
          break;
        case 'invitation:updated':
          yield put(actions.updateInvitation(id, topicEvent.payload));
          break;
        default:
          console.log(
            `Unhandled socket action '${topicEvent.event}' for ${id}: `,
            topicEvent,
          );
      }
    }
  } finally {
    if (yield cancelled()) {
      // what... what does this mean?
      yield channel.close();
    }
  }
}

export function* watchDiscussionsSocket() {
  let discussionTasks = [];

  while (true) {
    const { joinTopic, leaveTopic } = yield race({
      joinTopic: take(JOIN_DISCUSSION),
      leaveTopic: take(LEAVE_DISCUSSION),
    });

    // The UI requested to join a topic.
    if (joinTopic) {
      const topicId = `discussions/discussion/${joinTopic.payload.id}`;

      const topic = config.socket.topic(topicId);
      const channel = registerTopicChannel(topic);
      const handler = yield fork(
        handleTopicChannel,
        channel,
        joinTopic.payload.id,
        config.socket,
        topic,
      );
      discussionTasks.push({
        id: joinTopic.payload.id,
        topic,
        channel,
        handler,
      });
      try {
        yield call(
          topic.subscribe.bind(topic),
          joinTopic.payload.invitationToken,
        );
        const { discussion, error } = yield call(fetchDiscussion, {
          id: joinTopic.payload.id,
        });
        if (error) {
          console.error('Failed to join discussion!');
        } else {
          yield put({ type: ADD_DISCUSSION, payload: discussion });
        }
      } catch (e) {}
    }

    // The UI requested to leave a topic.
    if (leaveTopic) {
      // Fetch the task.
      const discussionTask = discussionTasks.find(
        dt => dt.id === leaveTopic.payload,
      );
      // Ask the channel to close the socket.
      yield cancel(discussionTask.handler);
      // Remove the task from the queue.
      discussionTasks = discussionTasks.filter(
        dt => dt.id !== discussionTask.id,
      );
    }
  }
}

const selectMessageToken = discussionId => state =>
  state.getIn(['discussions', discussionId, 'nextPageToken']);

export function* fetchMoreMessagesTask(action) {
  const pageToken = yield select(selectMessageToken(action.payload));

  const { messages, nextPageToken, error } = yield call(
    fetchMessages,
    action.payload,
    pageToken,
  );

  yield put(actions.setMoreMessages(action.payload, messages, nextPageToken));
}

export function* sendMessageTask(action) {
  yield call(sendMessage, action.payload);
}

export function* sendMessageUpdateTask(action) {
  yield call(updateMessage, action.payload);
}

export function* watchDiscussionRest() {
  yield all([
    takeEvery(SEND_MESSAGE, sendMessageTask),
    takeEvery(SEND_MESSAGE_UPDATE, sendMessageUpdateTask),
    takeEvery(FETCH_MORE_MESSAGES, fetchMoreMessagesTask),
  ]);
}

export default function*() {
  yield all([watchDiscussionsSocket(), watchDiscussionRest()]);
}
