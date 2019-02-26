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
    (object.values && object.values['Feedback Identification']) || 'Optional',
  allowWalkIns:
    ((object.values && object.values['Allow Walk-Ins']) || 'Yes') === 'Yes',
});

export const types = {
  FETCH_APP_SETTINGS: namespace('techBarApp', 'FETCH_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('techBarApp', 'SET_APP_SETTINGS'),
  SET_APP_ERRORS: namespace('techBarApp', 'SET_APP_ERRORS'),
  UPDATE_TECH_BAR_SETTINGS: namespace('techBarApp', 'UPDATE_TECH_BAR_SETTINGS'),
  FETCH_DISPLAY_TEAM: namespace('techBarApp', 'FETCH_DISPLAY_TEAM'),
  SET_DISPLAY_TEAM: namespace('techBarApp', 'SET_DISPLAY_TEAM'),
  ADD_DISPLAY_TEAM_MEMBERSHIP: namespace(
    'techBarApp',
    'ADD_DISPLAY_TEAM_MEMBERSHIP',
  ),
  CREATE_USER_WITH_DISPLAY_TEAM_MEMBERSHIP: namespace(
    'techBarApp',
    'CREATE_USER_WITH_DISPLAY_TEAM_MEMBERSHIP',
  ),
  REMOVE_DISPLAY_TEAM_MEMBERSHIP: namespace(
    'techBarApp',
    'REMOVE_DISPLAY_TEAM_MEMBERSHIP',
  ),
};

export const actions = {
  fetchAppSettings: withPayload(types.FETCH_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  setAppErrors: withPayload(types.SET_APP_ERRORS),
  updateTechBarSettings: withPayload(types.UPDATE_TECH_BAR_SETTINGS),
  fetchDisplayTeam: withPayload(types.FETCH_DISPLAY_TEAM),
  setDisplayTeam: withPayload(types.SET_DISPLAY_TEAM),
  addDisplayTeamMembership: withPayload(types.ADD_DISPLAY_TEAM_MEMBERSHIP),
  createUserWithDisplayTeamMembership: withPayload(
    types.CREATE_USER_WITH_DISPLAY_TEAM_MEMBERSHIP,
  ),
  removeDisplayTeamMembership: withPayload(
    types.REMOVE_DISPLAY_TEAM_MEMBERSHIP,
  ),
};

export const State = Record({
  appLoading: true,
  appErrors: [],
  schedulers: new List(),
  forms: new List(),
  displayTeamLoading: false,
  displayTeam: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_SETTINGS:
      return state.set('appLoading', !payload);
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
    case types.FETCH_DISPLAY_TEAM:
      return state.set('displayTeamLoading', true);
    case types.SET_DISPLAY_TEAM:
      return state.set('displayTeam', payload).set('displayTeamLoading', false);
    default:
      return state;
  }
};
