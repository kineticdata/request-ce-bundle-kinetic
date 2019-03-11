import { eventChannel } from 'redux-saga';
import { cancelled, race, take, put, takeEvery } from 'redux-saga/effects';
import { bundle } from 'react-kinetic-lib';

import { types, actions } from '../modules/socket';

import { Socket, SOCKET_STATUS } from '../../api/socket';

import { socket } from 'app/src/index';

export function* incomingSocketEvents(socketChannel, socket) {
  try {
    while (true) {
      const data = yield take(socketChannel);

      switch (data.action) {
        case 'status':
          yield put(actions.setStatus(data.payload));
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

export function registerSocketChannel(socket) {
  return eventChannel(emit => {
    socket.on('status', (status, stage, _e) =>
      emit({ action: 'status', payload: { status, stage } }),
    );

    return () => {
      socket.close();
    };
  });
}

const createWsUri = () => {
  const secure = window.location.protocol !== 'http:';
  const host = window.location.host;
  const path = `${bundle.spaceLocation()}/app/topics/socket`;

  return `${secure ? 'wss' : 'ws'}://${host}${path}`;
};

export function* watchToken() {
  yield takeEvery(types.SET_TOKEN, setTokenTask);
}

export function* setTokenTask({ payload }) {
  if (socket.status === SOCKET_STATUS.CLOSED) {
    const url = createWsUri();
    yield put(actions.connect({ token: payload, url }));
  }
}

export function* watchSocket() {
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
            tasks: incomingSocketEvents(socketChannel, socket),
          }
        : socketTasks,
    );

    const { connect, reconnect, disconnect, tasks } = results;

    // Handle the scenario of when we want to connect to a TopicHub.
    if (connect) {
      const { host, port, token, url } = connect.payload;
      const uri = url ? url : `ws://${host}:${port}/acme/socket`;
      socketChannel = registerSocketChannel(socket);
      socket.connect(
        token,
        uri,
      );

      window.socket = socket;
    }
  }
}
