import { List, Record } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  CLEAR: namespace('invitationForm', 'CLEAR'),
  LOAD_USERS_TEAMS: namespace('invitationForm', 'LOAD_USERS_TEAMS'),
  SEND: namespace('invitationForm', 'SEND'),
  SEND_SUCCESS: namespace('invitationForm', 'SEND_SUCCESS'),
  SEND_ERROR: namespace('invitationForm', 'SEND_ERROR'),
  SET_LOADING: namespace('invitationForm', 'SET_LOADING'),
  SET_USERS_TEAMS: namespace('invitationForm', 'SET_USERS_TEAMS'),
  SET_ERROR: namespace('invitationForm', 'SET_ERROR'),
  SET_VALUE: namespace('invitationForm', 'SET_VALUE'),
};

export const actions = {
  clear: noPayload(types.CLEAR),
  loadUsersTeams: noPayload(types.LOAD_USERS_TEAMS),
  send: withPayload(types.SEND, 'discussion', 'invitees'),
  sendSuccess: noPayload(types.SEND_SUCCESS),
  sendError: withPayload(types.SEND_ERROR),
  setLoading: withPayload(types.SET_LOADING),
  setUsersTeams: withPayload(types.SET_USERS_TEAMS, 'users', 'teams'),
  setError: withPayload(types.SET_ERROR),
  setValue: withPayload(types.SET_VALUE),
};

export const selectors = {
  submittable: state =>
    !state.discussions.invitationForm.sending &&
    state.discussions.invitationForm.value.length > 0,
};

const State = Record({
  loading: false,
  sending: false,
  error: null,
  users: List(),
  teams: List(),
  value: [],
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.CLEAR:
      return state
        .set('sending', false)
        .set('value', [])
        .set('error', null);
    case types.SET_LOADING:
      return state.set('loading', payload);
    case types.SEND:
      return state.set('sending', true);
    case types.SEND_SUCCESS:
      return state
        .set('sending', false)
        .set('value', [])
        .set('error', null);
    case types.SEND_ERROR:
      return state.set('sending', false).set('error', payload);
    case types.SET_USERS_TEAMS:
      return state
        .set('loading', false)
        .set('users', List(payload.users))
        .set('teams', List(payload.teams));
    case types.SET_ERROR:
      return state.set('loading', false).set('error', payload);
    case types.SET_VALUE:
      return state.set('value', payload);
    default:
      return state;
  }
};
