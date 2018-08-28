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
} from 'redux-saga/effects';

import { socket } from './socket';

import { types, actions } from '../modules/discussions';

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
          yield put(actions.addDiscussion(topicEvent.payload));
          break;
        case 'message:created':
          yield put(actions.addMessage(id, topicEvent.payload));
          break;
        case 'message:updated':
          yield put(actions.updateMessage(id, topicEvent.payload));
          break;
        case 'message:deleted':
          yield put(actions.deleteMessage(id, topicEvent.payload));
          break;
        case 'participant:created':
          yield put(actions.addParticipant(id, topicEvent.payload));
          break;
        case 'participant:deleted':
          yield put(actions.removeParticipant(id, topicEvent.payload));
          break;
        case 'invitation:created':
          yield put(actions.addInvitation(id, topicEvent.payload));
          break;
        case 'invitation:deleted':
          yield put(actions.removeInvitation(id, topicEvent.payload));
          break;
        case 'relatedItem:created':
          yield put(actions.addRelatedItem(id, topicEvent.payload));
          break;
        case 'relatedItem:deleted':
          yield put(actions.removeRelatedItem(id, topicEvent.payload));
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
      joinTopic: take(types.JOIN_DISCUSSION),
      leaveTopic: take(types.LEAVE_DISCUSSION),
    });

    // The UI requested to join a topic.
    if (joinTopic) {
      const topicId = `discussions/discussion/${joinTopic.payload}`;

      const topic = socket.topic(topicId);
      const channel = registerTopicChannel(topic);
      const handler = yield fork(
        handleTopicChannel,
        channel,
        joinTopic.payload,
        socket,
        topic,
      );
      discussionTasks.push({ id: joinTopic.payload, topic, channel, handler });
      topic.subscribe();
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
      // Remove the discussion from the active discussions list.
      yield put(actions.removeDiscussion(leaveTopic.payload));
    }
  }
}
