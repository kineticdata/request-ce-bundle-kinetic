import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const State = Record({
  deleteError: null,
  submitError: null,
  users: List(),
  user: {},
  loading: true,
  userLoading: true,
  error: 'null',
});

export const types = {
  FETCH_USERS: namespace('users', 'FETCH_USERS'),
  SET_USERS: namespace('users', 'SET_USERS'),
  FETCH_USER: namespace('users', 'FETCH_USER'),
  SET_USER: namespace('users', 'SET_USER'),
  UPDATE_USER: namespace('users', 'UPDATE_USER'),
  CREATE_USER: namespace('users', 'CREATE_USER'),
  DELETE_USER: namespace('users', 'DELETE_USER'),
};

export const actions = {
  fetchUsers: noPayload(types.FETCH_USERS),
  fetchUser: withPayload(types.FETCH_USER),
  setUsers: withPayload(types.SET_USERS),
  setUser: withPayload(types.SET_USER),
  updateUser: withPayload(types.UPDATE_USER),
  createUser: withPayload(types.CREATE_USER),
  deleteUser: withPayload(types.DELETE_USER),
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_USERS:
      return state.set('loading', true);
    case types.SET_USERS:
      return state.set('loading', false).set('users', payload);
    case types.FETCH_USER:
      return state.set('userLoading', true);
    case types.SET_USER:
      return state
        .set('userLoading', false)
        .set('user', payload)
        .set('error', null);
    case types.UPDATE_USER:
      return state.set('userLoading', true);
    case types.CREATE_USER:
      return state.set('userLoading', true);
    default:
      return state;
  }
};
