import { Record } from 'immutable';
import { Utils } from 'common';
import { SOCKET_STATUS } from '../../api/socket';
import { types as authTypes } from 'app/src/redux/modules/auth';
const { namespace, withPayload } = Utils;

export const TOKEN_KEY = 'kd-auth-token';

export const types = {
  // Socket-based actions.
  SET_TOKEN: namespace('socket', 'SET_TOKEN'),
  SET_STATUS: namespace('socket', 'SET_STATUS'),
  CONNECT: namespace('socket', 'CONNECT'),
  DISCONNECT: namespace('socket', 'DISCONNECT'),
  RECONNECT: namespace('socket', 'RECONNECT'),
};

export const actions = {
  setToken: withPayload(types.SET_TOKEN),
  setStatus: withPayload(types.SET_STATUS),
  connect: withPayload(types.CONNECT),
  reconnect: withPayload(types.RECONNECT),
  startConnection: withPayload(types.CONNECT),
  stopConnection: withPayload(types.DISCONNECT),
};

export const State = Record({
  status: SOCKET_STATUS.CLOSED,
  token: null,
});

export const selectToken = state => state.discussions.socket.token;

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_TOKEN:
      return state.set('token', payload);
    case types.SET_STATUS:
      return state.set('status', payload);
    default:
      return state;
  }
};
