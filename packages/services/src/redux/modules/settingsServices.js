import { Record } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload } = Utils;

export const types = {
  UPDATE_SERVICES_SETTINGS: namespace(
    'servicesSettings',
    'UPDATE_SERVICES_SETTINGS',
  ),
  UPDATE_SERVICES_SETTINGS_ERROR: namespace(
    'servicesSettings',
    'UPDATE_SERVICES_SETTINGS_ERROR',
  ),
  FETCH_SERVICES_SETTINGS: namespace(
    'servicesSettings',
    'FETCH_SERVICES_SETTINGS',
  ),
  FETCH_SERVICES_SETTINGS_SPACE: namespace(
    'servicesSettings',
    'FETCH_SERVICES_SETTINGS_SPACE',
  ),
  FETCH_SERVICES_SETTINGS_TEAMS: namespace(
    'servicesSettings',
    'FETCH_SERVICES_SETTINGS_TEAMS',
  ),
  SET_SERVICES_SETTINGS: namespace('servicesSettings', 'SET_SERVICES_SETTINGS'),
  SET_SERVICES_SETTINGS_SPACE: namespace(
    'servicesSettings',
    'SET_SERVICES_SETTINGS_SPACE',
  ),
  SET_SERVICES_SETTINGS_TEAMS: namespace(
    'servicesSettings',
    'SET_SERVICES_SETTINGS_TEAMS',
  ),
};

export const actions = {
  updateServicesSettings: withPayload(types.UPDATE_SERVICES_SETTINGS),
  updateServicesSettingsError: withPayload(
    types.UPDATE_SERVICES_SETTINGS_ERROR,
  ),
  fetchServicesSettings: withPayload(types.FETCH_SERVICES_SETTINGS),
  fetchServicesSettingsSpace: withPayload(types.FETCH_SERVICES_SETTINGS_SPACE),
  fetchServicesSettingsTeams: withPayload(types.FETCH_SERVICES_SETTINGS_TEAMS),
  setServicesSettings: withPayload(types.SET_SERVICES_SETTINGS),
  setServicesSettingsSpace: withPayload(types.SET_SERVICES_SETTINGS_SPACE),
  setServicesSettingsTeams: withPayload(types.SET_SERVICES_SETTINGS_TEAMS),
};

export const State = Record({
  loading: true,
  teams: null,
  error: null,
  servicesSettingsKapp: null,
  loadingTeams: true,
  loadingSpace: true,
  spaceKapps: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_SERVICES_SETTINGS:
      return state.set('loading', true);
    case types.FETCH_SERVICES_SETTINGS_TEAMS:
      return state.set('loadingTeams', true);
    case types.FETCH_SERVICES_SETTINGS_SPACE:
      return state.set('loadingSpace', true);
    case types.SET_SERVICES_SETTINGS:
      return state
        .set('servicesSettingsKapp', payload)
        .set('loading', false)
        .set('error', null);
    case types.SET_SERVICES_SETTINGS_TEAMS:
      return state
        .set('teams', payload)
        .set('loadingTeams', false)
        .set('error', null);
    case types.SET_SERVICES_SETTINGS_SPACE:
      return state
        .set('spaceKapps', payload)
        .set('loadingTeams', false)
        .set('error', null);
    case types.UPDATE_SERVICES_SETTINGS_ERROR:
      return state
        .set('servicesSettings', null)
        .set('loading', false)
        .set('error', payload);
    case types.UPDATE_SERVICES_SETTINGS:
      return state.set('loading', false);
    default:
      return state;
  }
};

export default reducer;
