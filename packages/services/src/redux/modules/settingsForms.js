import { List, Record } from 'immutable';
import { Utils } from 'common';

const { namespace, noPayload, withPayload } = Utils;

export const FORMS_INCLUDES = 'details,attributes';
export const FORM_INCLUDES =
  'details,fields,indexDefinitions,attributesMap,categorizations';

export const types = {
  FETCH_FORM: namespace('settingsForms', 'FETCH_FORM'),
  SET_FORM: namespace('settingsForms', 'SET_FORM'),
  UPDATE_FORM: namespace('settingsForms', 'UPDATE_FORM'),
  CREATE_FORM: namespace('settingsForms', 'CREATE_FORM'),
  FETCH_FORM_SUBMISSIONS: namespace('settingsForms', 'FETCH_FORM_SUBMISSIONS'),
  SET_FORM_SUBMISSIONS: namespace('settingsForms', 'SET_FORM_SUBMISSIONS'),
  FETCH_KAPP: namespace('settingsForms', 'FETCH_KAPP'),
  SET_KAPP: namespace('settingsForms', 'SET_KAPP'),
  SET_FORMS_ERROR: namespace('settingsForms', 'SET_FORMS_ERROR'),
  FETCH_NOTIFICATIONS: namespace('settingsForms', 'FETCH_NOTIFICATIONS'),
  SET_NOTIFICATIONS: namespace('settingsForms', 'SET_NOTIFICATIONS'),
};

export const actions = {
  fetchForm: withPayload(types.FETCH_FORM),
  setForm: withPayload(types.SET_FORM),
  updateForm: withPayload(types.UPDATE_FORM),
  createForm: withPayload(types.CREATE_FORM),
  fetchFormSubmissions: withPayload(types.FETCH_FORM_SUBMISSIONS),
  setFormSubmissions: withPayload(types.SET_FORM_SUBMISSIONS),
  fetchKapp: withPayload(types.FETCH_KAPP),
  setKapp: withPayload(types.SET_KAPP),
  setFormsError: withPayload(types.SET_FORMS_ERROR),
  fetchNotifications: withPayload(types.FETCH_NOTIFICATIONS),
  setNotifications: withPayload(types.SET_NOTIFICATIONS),
};

export const selectCurrentForm = state =>
  state.services.settingsForms.currentForm;
export const selectCurrentFormChanges = state =>
  state.services.settingsForms.currentFormChanges;
export const selectFormBySlug = (state, formSlug) =>
  state.services.forms.find(form => form.slug === formSlug);

export const State = Record({
  loading: true,
  errors: [],
  currentForm: null,
  currentFormChanges: null,
  servicesKapp: null,
  kappLoading: true,
  notificationsLoading: true,
  notifications: null,
  currentFormSubmissions: null,
  nextPageToken: null,
  submissionsLoading: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORM:
      return state.set('loading', true);
    case types.SET_FORM:
      return state.set('loading', false).set('currentForm', payload);
    case types.FETCH_FORM_SUBMISSIONS:
      return state.set('submissionsLoading', true);
    case types.SET_FORM_SUBMISSIONS:
      return state
        .set('submissionsLoading', false)
        .set('currentFormSubmissions', List(payload.submissions))
        .set('nextPageToken', payload.nextPageToken);
    case types.FETCH_KAPP:
      return state.set('kappLoading', true);
    case types.SET_KAPP:
      return state.set('kappLoading', false).set('servicesKapp', payload);
    case types.FETCH_NOTIFICATIONS:
      return state.set('notificationsLoading', true);
    case types.SET_NOTIFICATIONS:
      return state
        .set('notificationsLoading', false)
        .set('notifications', payload);
    case types.SET_FORMS_ERROR:
      return state.set('loading', false).set('errors', payload);
    default:
      return state;
  }
};

export default reducer;
