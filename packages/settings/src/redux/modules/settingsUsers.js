import { Record, List, Map } from 'immutable';
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
  processing: Map(),
  fetchingAll: false,
  modalIsOpen: false,
  modalName: '',
  exportUsers: [],
  exportCount: 0,
  downloaded: false,
});

export const types = {
  FETCH_USERS: namespace('users', 'FETCH_USERS'),
  SET_USERS: namespace('users', 'SET_USERS'),
  FETCH_USER: namespace('users', 'FETCH_USER'),
  SET_USER: namespace('users', 'SET_USER'),
  UPDATE_USER: namespace('users', 'UPDATE_USER'),
  CREATE_USER: namespace('users', 'CREATE_USER'),
  DELETE_USER: namespace('users', 'DELETE_USER'),
  CLONE_USER_REQUEST: namespace('users', 'CLONE_USER_REQUEST'),
  CLONE_USER_COMPLETE: namespace('users', 'CLONE_USER_COMPLETE'),
  OPEN_MODAL: namespace('users', 'OPEN_MODAL'),
  CLOSE_MODAL: namespace('users', 'CLOSE_MODAL'),
  FETCH_ALL_USERS: namespace('users', 'FETCH_ALL_USERS'),
  SET_EXPORT_USERS: namespace('users', 'SET_EXPORT_USERS'),
  SET_EXPORT_COUNT: namespace('users', 'SET_EXPORT_COUNT'),
  SET_DOWNLOADED: namespace('users', 'SET_DOWNLOADED'),
};

export const actions = {
  fetchUsers: noPayload(types.FETCH_USERS),
  fetchUser: withPayload(types.FETCH_USER),
  setUsers: withPayload(types.SET_USERS),
  setUser: withPayload(types.SET_USER),
  updateUser: withPayload(types.UPDATE_USER),
  createUser: withPayload(types.CREATE_USER),
  deleteUser: withPayload(types.DELETE_USER),
  cloneUserRequest: withPayload(types.CLONE_USER_REQUEST),
  cloneUserComplete: withPayload(types.CLONE_USER_COMPLETE),
  openModal: withPayload(types.OPEN_MODAL),
  closeModal: noPayload(types.CLOSE_MODAL),
  fetchAllUsers: withPayload(types.FETCH_ALL_USERS),
  setExportUsers: withPayload(types.SET_EXPORT_USERS),
  setExportCount: withPayload(types.SET_EXPORT_COUNT),
  setDownloaded: withPayload(types.SET_DOWNLOADED),
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
    case types.CLONE_USER_REQUEST:
      return state.setIn(['processing', payload.cloneUserUsername], true);
    case types.CLONE_USER_COMPLETE:
      return state.deleteIn(['processing', payload.cloneUserUsername]);
    case types.FETCH_ALL_USERS:
      return state.set('fetchingAll', true);
    case types.SET_EXPORT_USERS:
      return state.set('exportUsers', payload).set('fetchingAll', false);
    case types.SET_EXPORT_COUNT:
      return state.set('exportCount', payload);
    case types.OPEN_MODAL:
      return state.set('modalIsOpen', true).set('modalName', payload);
    case types.CLOSE_MODAL:
      return state.set('modalIsOpen', false).set('modalName', '');
    case types.SET_DOWNLOADED:
      return state.set('downloaded', payload);
    default:
      return state;
  }
};
