import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const SCHEDULER_FORM_SLUG = 'scheduler';
export const SCHEDULER_CONFIG_FORM_SLUG = 'scheduler-config';
export const SCHEDULER_AVAILABILITY_FORM_SLUG = 'scheduler-availability';
export const SCHEDULER_OVERRIDE_FORM_SLUG = 'scheduler-override';
export const SCHEDULED_EVENT_FORM_SLUG = 'scheduled-event';

export const types = {
  FETCH_APP_SETTINGS: namespace('techBarApp', 'FETCH_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('techBarApp', 'SET_APP_SETTINGS'),
  SET_APP_ERRORS: namespace('techBarApp', 'SET_APP_ERRORS'),
};

export const actions = {
  fetchAppSettings: noPayload(types.FETCH_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  setAppErrors: withPayload(types.SET_APP_ERRORS),
};

export const State = Record({
  appLoading: true,
  appErrors: [],
  schedulers: new List(),
  forms: new List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_SETTINGS:
      return state.set('appLoading', true);
    case types.SET_APP_SETTINGS:
      return state
        .set('schedulers', List(payload.schedulers))
        .set('forms', List(payload.forms))
        .set('appLoading', false);
    case types.SET_APP_ERRORS:
      return state.set('appErrors', payload).set('appLoading', false);
    default:
      return state;
  }
};
