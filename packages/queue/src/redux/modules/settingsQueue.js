import { Record } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload } = Utils;

export const types = {
  UPDATE_QUEUE_SETTINGS: namespace('queueSettings', 'UPDATE_QUEUE_SETTINGS'),
  UPDATE_QUEUE_SETTINGS_ERROR: namespace(
    'queueSettings',
    'UPDATE_QUEUE_SETTINGS_ERROR',
  ),
  FETCH_QUEUE_SETTINGS: namespace('queueSettings', 'FETCH_QUEUE_SETTINGS'),
  FETCH_QUEUE_SETTINGS_SPACE: namespace(
    'queueSettings',
    'FETCH_QUEUE_SETTINGS_SPACE',
  ),
  FETCH_QUEUE_SETTINGS_TEAMS: namespace(
    'queueSettings',
    'FETCH_QUEUE_SETTINGS_TEAMS',
  ),
  SET_QUEUE_SETTINGS: namespace('queueSettings', 'SET_QUEUE_SETTINGS'),
  SET_QUEUE_SETTINGS_SPACE: namespace(
    'queueSettings',
    'SET_QUEUE_SETTINGS_SPACE',
  ),
  SET_QUEUE_SETTINGS_TEAMS: namespace(
    'queueSettings',
    'SET_QUEUE_SETTINGS_TEAMS',
  ),
  FETCH_QUEUE_SETTINGS_USERS: namespace(
    'queueSettings',
    'FETCH_QUEUE_SETTINGS_USERS',
  ),
  SET_QUEUE_SETTINGS_USERS: namespace(
    'queueSettings',
    'SET_QUEUE_SETTINGS_USERS',
  ),
  FETCH_NOTIFICATIONS: namespace('queueSettings', 'FETCH_NOTIFICATIONS'),
  SET_NOTIFICATIONS: namespace('queueSettings', 'SET_NOTIFICATIONS'),
  FETCH_FORM: namespace('queueSettings', 'FETCH_FORM'),
  SET_FORM: namespace('queueSettings', 'SET_FORM'),
};

export const actions = {
  updateQueueSettings: withPayload(types.UPDATE_QUEUE_SETTINGS),
  updateQueueSettingsError: withPayload(types.UPDATE_QUEUE_SETTINGS_ERROR),
  fetchQueueSettings: withPayload(types.FETCH_QUEUE_SETTINGS),
  fetchQueueSettingsSpace: withPayload(types.FETCH_QUEUE_SETTINGS_SPACE),
  fetchQueueSettingsTeams: withPayload(types.FETCH_QUEUE_SETTINGS_TEAMS),
  fetchQueueSettingsUsers: withPayload(types.FETCH_QUEUE_SETTINGS_USERS),
  setQueueSettings: withPayload(types.SET_QUEUE_SETTINGS),
  setQueueSettingsSpace: withPayload(types.SET_QUEUE_SETTINGS_SPACE),
  setQueueSettingsTeams: withPayload(types.SET_QUEUE_SETTINGS_TEAMS),
  setQueueSettingsUsers: withPayload(types.SET_QUEUE_SETTINGS_USERS),
  fetchNotifications: withPayload(types.FETCH_NOTIFICATIONS),
  setNotifications: withPayload(types.SET_NOTIFICATIONS),
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
};

export const State = Record({
  loading: true,
  teams: null,
  users: null,
  error: null,
  queueSettingsKapp: null,
  loadingTeams: true,
  loadingUsers: true,
  loadingSpace: true,
  loadingForm: true,
  spaceKapps: null,
  notifications: null,
  notificationsLoading: true,
  form: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_QUEUE_SETTINGS:
      return state.set('loading', true);
    case types.FETCH_QUEUE_SETTINGS_TEAMS:
      return state.set('loadingTeams', true);
    case types.FETCH_QUEUE_SETTINGS_USERS:
      return state.set('loadingUsers', true);
    case types.FETCH_QUEUE_SETTINGS_SPACE:
      return state.set('loadingSpace', true);
    case types.SET_QUEUE_SETTINGS:
      return state
        .set('queueSettingsKapp', payload)
        .set('loading', false)
        .set('error', null);
    case types.SET_QUEUE_SETTINGS_TEAMS:
      return state
        .set('teams', payload)
        .set('loadingTeams', false)
        .set('error', null);
    case types.SET_QUEUE_SETTINGS_USERS:
      return state
        .set('users', payload)
        .set('loadingUsers', false)
        .set('error', null);
    case types.SET_QUEUE_SETTINGS_SPACE:
      return state
        .set('spaceKapps', payload)
        .set('loadingTeams', false)
        .set('error', null);
    case types.UPDATE_QUEUE_SETTINGS_ERROR:
      return state
        .set('queueSettings', null)
        .set('loading', false)
        .set('error', payload);
    case types.UPDATE_QUEUE_SETTINGS:
      return state.set('loading', false);
    case types.FETCH_NOTIFICATIONS:
      return state.set('notificationsLoading', true);
    case types.SET_NOTIFICATIONS:
      return state
        .set('notificationsLoading', false)
        .set('notifications', payload);
    case types.FETCH_FORM:
      return state.set('loadingForm', true);
    case types.SET_FORM:
      return state.set('loadingForm', false).set('form', payload);
    default:
      return state;
  }
};
