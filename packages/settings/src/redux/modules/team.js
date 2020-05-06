import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const State = Record({
  loading: true,
  data: null,
  isAddMemberModalOpen: false,
  deleteError: null,
  submitError: null,
  users: List(),
  usersLoading: true,
});

export const types = {
  CANCEL_SAVE_TEAM: namespace('teams', 'CANCEL_SAVE_TEAM'),
  CREATE_TEAM: namespace('teams', 'CREATE_TEAM'),
  DELETE_TEAM: namespace('teams', 'DELETE_TEAM'),
  FETCH_TEAM: namespace('teams', 'FETCH_TEAM'),
  SET_TEAM: namespace('teams', 'SET_TEAM'),
  UPDATE_TEAM: namespace('teams', 'UPDATE_TEAM'),

  SET_SUBMIT_ERROR: namespace('teams', 'SET_SUBMIT_ERROR'),
  SET_DELETE_ERROR: namespace('teams', 'SET_DELETE_ERROR'),
  RESET_DELETE_ERROR: namespace('teams', 'RESET_DELETE_ERROR'),
  RESET_SUBMIT_ERROR: namespace('teams', 'RESET_SUBMIT_ERROR'),
  RESET_TEAM: namespace('teams', 'RESET_TEAM'),

  SET_ADD_MEMBER_MODAL_OPEN: namespace('teams', 'SET_ADD_MEMBER_MODAL_OPEN'),
  FETCH_USERS: namespace('teams', 'FETCH_USERS'),
  SET_USERS: namespace('teams', 'SET_USERS'),
};

export const actions = {
  cancelSaveTeam: withPayload(types.CANCEL_SAVE_TEAM),
  createTeam: withPayload(types.CREATE_TEAM),
  fetchTeam: withPayload(types.FETCH_TEAM),
  setTeam: withPayload(types.SET_TEAM),
  updateTeam: withPayload(types.UPDATE_TEAM),
  deleteTeam: withPayload(types.DELETE_TEAM),
  setSubmitError: withPayload(types.SET_SUBMIT_ERROR),
  setDeleteError: withPayload(types.SET_DELETE_ERROR),
  resetSubmitError: noPayload(types.RESET_SUBMIT_ERROR),
  resetDeleteError: noPayload(types.RESET_DELETE_ERROR),
  resetTeam: noPayload(types.RESET_TEAM),
  setAddMemberModalOpen: withPayload(types.SET_ADD_MEMBER_MODAL_OPEN),
  fetchUsers: noPayload(types.FETCH_USERS),
  setUsers: withPayload(types.SET_USERS),
};

export const selectTeam = state => state.team.data;
export const selectTeamStatus = state => state.team.loading;

export const selectTeamMemberships = state =>
  state.team.data ? state.team.data.memberships : [];

export const selectIsTeamMember = (state, profile) =>
  state.team.data
    ? state.team.data.memberships.find(
        m => m.user.username === profile.username,
      ) !== undefined
    : false;

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_TEAM:
      return state.set('loading', true);
    case types.SET_TEAM:
      return state.set('loading', false).set('data', payload);
    case types.UPDATE_TEAM:
      return state.set('loading', false).set('submitError', null);
    case types.RESET_DELETE_ERROR:
      return state.set('deleteError', null);
    case types.SET_SUBMIT_ERROR:
      return state
        .set('submitError', `${payload.status} ${payload.statusText}`)
        .set('loading', false);
    case types.SET_DELETE_ERROR:
      return state
        .set('deleteError', `${payload.status} ${payload.statusText}`)
        .set('loading', false);
    case types.RESET_SUBMIT_ERROR:
      return state.set('submitError', null);
    case types.RESET_TEAM:
      return state.set('loading', true).set('data', null);
    case types.CANCEL_SAVE_TEAM:
      return state.set('loading', false);
    case types.SET_ADD_MEMBER_MODAL_OPEN:
      return state.set('isAddMemberModalOpen', payload);
    case types.FETCH_USERS:
      return state.set('usersLoading', true);
    case types.SET_USERS:
      return state.set('usersLoading', false).set('users', payload);
    default:
      return state;
  }
};
