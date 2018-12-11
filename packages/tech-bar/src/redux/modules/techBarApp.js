import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const SCHEDULER_FORM_SLUG = 'scheduler';
export const SCHEDULER_CONFIG_FORM_SLUG = 'scheduler-config';
export const SCHEDULER_AVAILABILITY_FORM_SLUG = 'scheduler-availability';
export const SCHEDULER_OVERRIDE_FORM_SLUG = 'scheduler-override';
export const SCHEDULED_EVENT_FORM_SLUG = 'scheduled-event';
export const TECH_BAR_SETTINGS_FORM_SLUG = 'tech-bar-settings';

export const Settings = (object = {}) => ({
  submissionId: object.id,
  feedbackIdentitifcation:
    (object.values && object.values['Feedback Identification']) || 'Required',
  allowWalkIns:
    ((object.values && object.values['Allow Walk-Ins']) || 'Yes') === 'Yes',
});

export const types = {
  FETCH_APP_SETTINGS: namespace('techBarApp', 'FETCH_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('techBarApp', 'SET_APP_SETTINGS'),
  SET_APP_ERRORS: namespace('techBarApp', 'SET_APP_ERRORS'),
  UPDATE_TECH_BAR_SETTINGS: namespace('techBarApp', 'UPDATE_TECH_BAR_SETTINGS'),
};

export const actions = {
  fetchAppSettings: noPayload(types.FETCH_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  setAppErrors: withPayload(types.SET_APP_ERRORS),
  updateTechBarSettings: withPayload(types.UPDATE_TECH_BAR_SETTINGS),
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
    case types.UPDATE_TECH_BAR_SETTINGS:
      const index = state
        .get('schedulers')
        .findIndex(scheduler => scheduler.id === payload.techBarId);
      if (index > -1) {
        return state.setIn(
          ['schedulers', index, 'settings'],
          Settings(payload.submission),
        );
      } else {
        return state;
      }
    default:
      return state;
  }
};
