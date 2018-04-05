import { Record, List } from 'immutable';
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
};

export const actions = {
  fetchUsers: noPayload(types.FETCH_USERS),
  setUsers: withPayload(types.SET_USERS),
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_USERS:
      return state.set('loading', true);
    case types.SET_USERS:
      return state.set('loading', false).set('users', payload);
    default:
      return state;
  }
};
