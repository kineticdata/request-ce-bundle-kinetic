import { Record, List, Map } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const State = Record({
  deleteError: null,
  submitError: null,
  users: List(),
  loading: true,
});

export const types = {
  FETCH_USERS: namespace('users', 'FETCH_USERS'),
  SET_USERS: namespace('users', 'SET_USERS'),
  SET_USER: namespace('users', 'SET_USER'),
  UPDATE_USER: namespace('users', 'UPDATE_USER'),
};

export const actions = {
  fetchUsers: noPayload(types.FETCH_USERS),
  setUsers: withPayload(types.SET_USERS),
  setUser: withPayload(types.SET_USER),
  updateUser: withPayload(types.UPDATE_USER),
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_USERS:
      return state.set('loading', true);
    case types.SET_USERS:
      return state.set('loading', false).set('users', payload);
    case types.SET_USER:
      return state.set('loading', false).set('user', payload);
    case types.UPDATE_USER:
      return state.set('loading', true);
    default:
      return state;
  }
};
