import { eventChannel } from 'redux-saga';
import { cancelled, race, take, put } from 'redux-saga/effects';
import { bundle } from 'react-kinetic-core';

import { types, actions, TOKEN_KEY } from '../modules/socket';

import { Socket, SOCKET_STATUS } from '../../api/socket';

export const socket = new Socket();

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
    socket.on('status', status => emit({ action: 'status', payload: status }));

    return () => {
      socket.close();
    };
  });
}

export function* watchSocket() {
  let socketChannel;

  const socketTasks = {
    token: take(types.SET_TOKEN),
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

    const { connect, reconnect, disconnect, tasks, token } = results;

    if (token) {
      console.log('token received', token, socket, bundle.spaceLocation());
      window.localStorage.setItem(TOKEN_KEY, token.payload);

      // if(socket.status === SOCKET_STATUS.CLOSED) {
      //   yield put()
      // }
    }
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
