import { Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const NOTIFICATIONS_FORM_SLUG = 'notification-data';
export const NOTIFICATIONS_DATE_FORMAT_FORM_SLUG =
  'notification-template-dates';

export const types = {
  FETCH_NOTIFICATIONS: namespace(
    'settingsNotifications',
    'FETCH_NOTIFICATIONS',
  ),
  SET_NOTIFICATIONS: namespace('settingsNotifications', 'SET_NOTIFICATIONS'),
  SET_FETCH_NOTIFICATIONS_ERROR: namespace(
    'settingsNotifications',
    'SET_FETCH_NOTIFICATIONS_ERROR',
  ),
  FETCH_NOTIFICATION: namespace('settingsNotifications', 'FETCH_NOTIFICATION'),
  SET_NOTIFICATION: namespace('settingsNotifications', 'SET_NOTIFICATION'),
  RESET_NOTIFICATION: namespace('settingsNotifications', 'RESET_NOTIFICATION'),
  CLONE_NOTIFICATION: namespace('settingsNotifications', 'CLONE_NOTIFICATION'),
  SET_CLONE_SUCCESS: namespace('settingsNotifications', 'SET_CLONE_SUCCESS'),
  SET_CLONE_ERROR: namespace('settingsNotifications', 'SET_CLONE_ERROR'),
  DELETE_NOTIFICATION: namespace(
    'settingsNotifications',
    'DELETE_NOTIFICATION',
  ),
  SET_DELETE_SUCCESS: namespace('settingsNotifications', 'SET_DELETE_SUCCESS'),
  SET_DELETE_ERROR: namespace('settingsNotifications', 'SET_DELETE_ERROR'),
  FETCH_VARIABLES: namespace('settingsNotifications', 'FETCH_VARIABLES'),
  SET_VARIABLES: namespace('settingsNotifications', 'SET_VARIABLES'),
  SET_VARIABLES_ERROR: namespace(
    'settingsNotifications',
    'SET_VARIABLES_ERROR',
  ),
  FETCH_DATE_FORMATS: namespace('settingsNotifications', 'FETCH_DATE_FORMATS'),
  SET_DATE_FORMATS: namespace('settingsNotifications', 'SET_DATE_FORMATS'),
  SAVE_NOTIFICATION: namespace('settingsNotifications', 'SAVE_NOTIFICATION'),
  SET_SAVE_SUCCESS: namespace('settingsNotifications', 'SET_SAVE_SUCCESS'),
  SET_SAVE_ERROR: namespace('settingsNotifications', 'SET_SAVE_ERROR'),
};

export const actions = {
  fetchNotifications: noPayload(types.FETCH_NOTIFICATIONS),
  setNotifications: withPayload(types.SET_NOTIFICATIONS),
  setFetchNotificationsError: withPayload(types.SET_FETCH_NOTIFICATIONS_ERROR),
  fetchNotification: withPayload(types.FETCH_NOTIFICATION),
  setNotification: withPayload(types.SET_NOTIFICATION),
  resetNotification: noPayload(types.RESET_NOTIFICATION),
  cloneNotification: withPayload(types.CLONE_NOTIFICATION),
  setCloneSuccess: noPayload(types.SET_CLONE_SUCCESS),
  setCloneError: withPayload(types.SET_CLONE_ERROR),
  deleteNotification: withPayload(types.DELETE_NOTIFICATION),
  setDeleteSuccess: noPayload(types.SET_DELETE_SUCCESS),
  setDeleteError: withPayload(types.SET_DELETE_ERROR),
  fetchVariables: withPayload(types.FETCH_VARIABLES, 'kappSlug'),
  setVariables: withPayload(types.SET_VARIABLES),
  setVariablesError: withPayload(types.SET_VARIABLES_ERROR),
  fetchDateFormats: noPayload(types.FETCH_DATE_FORMATS),
  setDateFormats: withPayload(types.SET_DATE_FORMATS),
  saveNotification: withPayload(
    types.SAVE_NOTIFICATION,
    'values',
    'id',
    'callback',
  ),
  setSaveSuccess: withPayload(types.SET_SAVE_SUCCESS),
  setSaveError: withPayload(types.SET_SAVE_ERROR),
};

export const State = Record({
  // Notification List
  loading: true,
  errors: [],
  notificationTemplates: [],
  // Notification List Actions
  cloning: false,
  deleting: false,
  saving: false,
  submissionActionErrors: [],
  // Single Notification
  notification: null,
  notificationLoading: true,
  variables: null,
  dateFormats: [],
  dateFormatsLoading: true,
});

export const notificationsReducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_NOTIFICATIONS:
      return state.set('loading', true).set('errors', []);
    case types.SET_NOTIFICATIONS:
      return state
        .set('loading', false)
        .set('errors', [])
        .set('notificationTemplates', payload);
    case types.SET_FETCH_NOTIFICATIONS_ERROR:
      return state.set('loading', false).set('errors', payload);
    case types.FETCH_NOTIFICATION:
      return state.set('notificationLoading', true);
    case types.SET_NOTIFICATION:
      return state
        .set('notificationLoading', false)
        .set('notification', payload);
    case types.CLONE_NOTIFICATION:
      return state.set('cloning', true);
    case types.SET_CLONE_SUCCESS:
      return state.set('cloning', false);
    case types.SET_CLONE_ERROR:
      return state.set('cloning', false).set('submissionActionErrors', payload);
    case types.DELETE_NOTIFICATION:
      return state.set('deleting', true);
    case types.SET_DELETE_SUCCESS:
      return state.set('deleting', false);
    case types.SET_DELETE_ERROR:
      return state
        .set('deleting', false)
        .set('submissionActionErrors', payload);
    case types.SAVE_NOTIFICATION:
      return state.set('saving', true);
    case types.SET_SAVE_SUCCESS:
      return state.set('saving', false).delete('submissionActionErrors');
    case types.SET_SAVE_ERROR:
      return state.set('saving', false).set('submissionActionErrors', payload);
    case types.FETCH_VARIABLES:
      return state.delete('variables');
    case types.SET_VARIABLES:
      return state.set('variables', payload);
    case types.SET_VARIABLES_ERROR:
      return state.set('variablesErrors', payload);
    case types.FETCH_DATE_FORMATS:
      return state.set('dateFormatsLoading', true);
    case types.SET_DATE_FORMATS:
      return state.set('dateFormatsLoading', false).set('dateFormats', payload);
    case types.RESET_NOTIFICATION:
      return state
        .delete('notification')
        .delete('notificationLoading')
        .delete('variables')
        .delete('submissionActionErrors');
    default:
      return state;
  }
};

export default notificationsReducer;
