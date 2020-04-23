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
  exportUsers: List(),
  downloaded: false,
  importing: false,
  importCounts: {},
  importErrors: List(),
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
  SET_DOWNLOADED: namespace('users', 'SET_DOWNLOADED'),
  IMPORT_USERS_REQUEST: namespace('users', 'IMPORT_USERS_REQUEST'),
  IMPORT_USERS_COMPLETE: namespace('users', 'IMPORT_USERS_COMPLETE'),
  IMPORT_USERS_RESET: namespace('users', 'IMPORT_USERS_RESET'),
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
  setDownloaded: withPayload(types.SET_DOWNLOADED),
  importUsersRequest: withPayload(types.IMPORT_USERS_REQUEST),
  importUsersComplete: withPayload(types.IMPORT_USERS_COMPLETE),
  importUsersReset: withPayload(types.IMPORT_USERS_RESET),
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.CLONE_USER_REQUEST:
      return state.setIn(['processing', payload.cloneUserUsername], true);
    case types.CLONE_USER_COMPLETE:
      return state.deleteIn(['processing', payload.cloneUserUsername]);
    case types.FETCH_ALL_USERS:
      return state.set('fetchingAll', true).set('exportUsers', List());
    case types.SET_EXPORT_USERS:
      return state
        .update(
          'exportUsers',
          users => (payload.error ? List() : users.concat(List(payload.data))),
        )
        .set('fetchingAll', !payload.completed && !payload.error);
    case types.OPEN_MODAL:
      return state.set('modalIsOpen', true).set('modalName', payload);
    case types.CLOSE_MODAL:
      return state.set('modalIsOpen', false).set('modalName', '');
    case types.SET_DOWNLOADED:
      return state.set('downloaded', payload);
    case types.IMPORT_USERS_REQUEST:
      return state
        .set('importing', 'STARTED')
        .set('importErrors', List())
        .set('importCounts', { total: payload.length });
    case types.IMPORT_USERS_COMPLETE:
      return state
        .set('importing', 'COMPLETED')
        .set('importErrors', payload.errors ? List(payload.errors) : List())
        .update(
          'importCounts',
          counts =>
            payload.counts ? { ...counts, ...payload.counts } : counts,
        );
    case types.IMPORT_USERS_RESET:
      return state
        .set('importErrors', List())
        .set('importCounts', {})
        .set('importing', null);
    default:
      return state;
  }
};
