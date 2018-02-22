import { Record, List, Map } from 'immutable';
import { namespace, noPayload, withPayload } from 'common/utils';

export const types = {
  // App
  LOAD_APP: namespace('kinops', 'LOAD_APP'),
  SET_APP: namespace('kinops', 'SET_APP'),
  // Modal Forms
  OPEN_FORM: namespace('kinops', 'OPEN_FORM'),
  CLOSE_FORM: namespace('kinops', 'CLOSE_FORM'),
  COMPLETE_FORM: namespace('kinops', 'COMPLETE_FORM'),
  // Alerts
  FETCH_ALERTS: namespace('kinops', 'FETCH_ALERTS'),
  SET_ALERTS: namespace('kinops', 'SET_ALERTS'),
  SET_ALERTS_ERROR: namespace('kinops', 'SET_ALERTS_ERROR'),
};

export const actions = {
  // App
  loadApp: noPayload(types.LOAD_APP),
  setApp: withPayload(types.SET_APP),
  // Modal Forms
  openForm: withPayload(types.OPEN_FORM),
  closeForm: noPayload(types.CLOSE_FORM),
  completeForm: noPayload(types.COMPLETE_FORM),
  // Alerts
  fetchAlerts: noPayload(types.FETCH_ALERTS),
  setAlerts: withPayload(types.SET_ALERTS),
  setAlertsError: withPayload(types.SET_ALERTS_ERROR),
};

export const State = Record({
  space: Map(),
  kapps: List(),
  profile: Map(),
  alerts: Map({
    loading: true,
    data: List(),
    error: null,
  }),
  modal: Map({
    form: null,
    isCompleted: false,
  }),
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_APP:
      return state
        .set('space', payload.space)
        .set('kapps', payload.kapps)
        .set('profile', payload.profile)
        .setIn(['alerts', 'data'], payload.alerts)
        .setIn(['alerts', 'loading'], false)
        .setIn(['alerts', 'error'], null)
        .set('loading', false);
    case types.OPEN_FORM:
      return state.setIn(['modal', 'form'], payload);
    case types.CLOSE_FORM:
      return state
        .setIn(['modal', 'form'], null)
        .setIn(['modal', 'isCompleted'], false);
    case types.COMPLETE_FORM:
      return state.setIn(['modal', 'isCompleted'], true);
    case types.FETCH_ALERTS:
      return state.setIn(['alerts', 'loading'], true);
    case types.SET_ALERTS:
      return state
        .setIn(['alerts', 'loading'], false)
        .setIn(['alerts', 'error'], null)
        .setIn(['alerts', 'data'], payload);
    case types.SET_ALERTS_ERROR:
      return state.set('loading', false).set('error', payload);
    default:
      return state;
  }
};
