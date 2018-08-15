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

import { Socket } from '../../api/socket';

import { types, actions } from '../modules/discussions';

// Connect
// Identify
// Wait to join topics.

export function registerSocketChannel(socket) {
  return eventChannel(emit => {
    socket
      .on('connect', () => emit({ action: 'socket:connected' }))
      .on('identify', message =>
        emit({ action: 'socket:identified', payload: message }),
      )
      .on('disconnect', e => {
        console.log('disconnected', e);
        emit({ action: 'socket:closed', payload: e });
      });

    return () => {
      socket.close();
    };
  });
}

export function registerTopicChannel(topic) {
  return eventChannel(emit => {
    topic
      .onPresence((op, presenceData) => {
        emit({ event: 'presence', payload: { op, presenceData } });
      })
      .onStatus(status => {
        console.log('status changed.');
        emit({ event: 'status', payload: status });
      })
      .on('message:created', m => emit(m))
      .on('participant:created', m => emit(m))
      .on('participant:deleted', m => emit(m))
      .on('invitation:created', m => emit(m))
      .on('invitation:deleted', m => emit(m))
      .on('relatedItem:created', m => emit(m))
      .on('relatedItem:deleted', m => emit(m));

    return () => topic.unsubscribe();
  });
}

export function* incomingSocketEvents(socketChannel, socket) {
  try {
    while (true) {
      const data = yield take(socketChannel);

      switch (data.action) {
        case 'socket:connected':
          yield put(actions.setConnected(true));
          break;
        case 'socket:identified':
          yield put(actions.setIdentified(socket.isIdentified()));
          break;
        default:
          console.log('data', data);
      }
    }
  } finally {
    if (yield cancelled()) {
      socketChannel.close();
    }
  }
}

export function* handleTopicChannel(channel, id, socket, topic) {
  console.log('Starting topicSocketEvents loop');
  try {
    while (true) {
      console.log('waiting for channels to do something');
      const topicEvent = yield take(channel);
      console.log('channels did something');

      // yield all(
      // Object.keys(results).map(id => {
      // const topicEvent = results[id];
      // const topic = discussionTasks.find(d => d.id === id).topic;

      switch (topicEvent.event) {
        case 'status':
          console.log('status!', id);
          yield put(actions.setTopicStatus(id, topicEvent.payload));
          break;
        case 'presence':
          yield put(actions.updatePresence(id, topic.presence()));
          break;
        case 'message:created':
          yield put(actions.addMessage(id, topicEvent.payload));
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
      // }),
      // );

      console.log('message received', topicEvent);
    }
  } finally {
    if (yield cancelled()) {
      // what... what does this mean?
      yield channel.close();
    }
  }
}

// export function* watchJoinDiscussion() {
//   const discussionTasks = {};
//   while (true) {
//     const { joinAction, leaveAction } = yield race({
//       joinAction: take(types.JOIN_DISCUSSION),
//       leaveAction: take(types.LEAVE_DISCUSSION),
//     });
//     const discussionId = joinAction ? joinAction.payload : leaveAction.payload;
//     const discussionTask = discussionTasks[discussionId];
//     if (joinAction) {
//       if (!discussionTask) {
//         discussionTasks[discussionId] = yield fork(
//           joinDiscussionTask,
//           joinAction,
//         );
//       }
//     } else {
//       if (discussionTask) {
//         delete discussionTasks[discussionId];
//         if (discussionTask.isRunning()) {
//           yield cancel(discussionTask);
//         }
//       }
//     }
//   }
// }

export function* outgoingSocketActions(socket) {
  let discussionTasks = [];
  // console.log('outgoing socket actions.');
  // let handleTopicsTask = fork(topicSocketEvents, discussionTasks, socket);
  // console.log('handling topic task', handleTopicsTask);

  // const channels = discussionTasks.reduce(
  //   (calls, task) => ({ ...calls, [task.id]: take(task.channel) }),
  //   {},
  // );
  // console.log('waiting for channels to do something');
  // const results = yield race(channels);
  // console.log('channels did something');

  // yield all(
  //   Object.keys(results).map(id => {
  //     const topicEvent = results[id];
  //     const topic = discussionTasks.find(d => d.id === id).topic;

  //     switch (topicEvent.event) {
  //       case 'status':
  //         console.log('status!');
  //         return put(actions.setTopicStatus(id, topicEvent.payload));
  //       case 'presence':
  //         return put(actions.updatePresence(id, topic.presence()));
  //       case 'message:created':
  //         return put(actions.addMessage(id, topicEvent.payload));
  //       case 'participant:created':
  //         return put(actions.addParticipant(id, topicEvent.payload));
  //       case 'participant:deleted':
  //         return put(actions.removeParticipant(id, topicEvent.payload));
  //       case 'invitation:created':
  //         return put(actions.addInvitation(id, topicEvent.payload));
  //       case 'invitation:deleted':
  //         return put(actions.removeInvitation(id, topicEvent.payload));
  //       case 'relatedItem:created':
  //         return put(actions.addRelatedItem(id, topicEvent.payload));
  //       case 'relatedItem:deleted':
  //         return put(actions.removeRelatedItem(id, topicEvent.payload));
  //       default:
  //         console.log(
  //           `Unhandled socket action '${topicEvent.event}' for ${id}: `,
  //           topicEvent,
  //         );
  //     }
  //   }),
  // );

  while (true) {
    console.log('TOP OF LOOP');
    console.log(discussionTasks);
    const { joinTopic, leaveTopic, results } = yield race({
      joinTopic: take(types.JOIN_DISCUSSION),
      leaveTopic: take(types.LEAVE_DISCUSSION),
    });

    console.log('outgoing sockets happened: ', joinTopic, leaveTopic, results);

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
      // discussionTask.channel.close();
      yield cancel(discussionTask.handler);
      // Remove the task from the queue.
      discussionTasks = discussionTasks.filter(
        dt => dt.id !== discussionTask.id,
      );
      // Remove the discussion from the active discussions list.
      yield put(actions.removeDiscussion(leaveTopic.payload));
    }
    console.log('END OF LOOP');
  }
}

export function* watchDiscussions() {
  let socket;
  let socketChannel;

  const socketTasks = {
    connect: take(types.CONNECT),
    reconnect: take(types.RECONNECT),
    disconnect: take(types.DISCONNECT),
  };

  while (true) {
    const results = yield race(
      socketChannel
        ? {
            ...socketTasks,
            tasks: all([
              incomingSocketEvents(socketChannel, socket),
              outgoingSocketActions(socket),
            ]),
          }
        : socketTasks,
    );

    const { connect, reconnect, disconnect, tasks } = results;

    // Handle the scenario of when we want to connect to a TopicHub.
    if (connect) {
      const { host, port, token } = connect.payload;
      socket = new Socket(`ws://${host}:${port}/acme/socket`);
      socketChannel = registerSocketChannel(socket);
      socket.connect(token);

      window.socket = socket;
    }
  }
}
