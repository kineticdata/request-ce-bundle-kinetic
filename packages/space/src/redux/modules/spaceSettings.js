import { Record } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  UPDATE_SPACE_SETTINGS: namespace('spaceSettings', 'UPDATE_SPACE_SETTINGS'),
  UPDATE_SPACE_SETTINGS_ERROR: namespace('spaceSettings', 'UPDATE_SPACE_SETTINGS_ERROR'),
  FETCH_SPACE_SETTINGS: namespace('spaceSettings', 'FETCH_SPACE_SETTINGS'),
  FETCH_SPACE_SETTINGS_TEAMS: namespace('spaceSettings', 'FETCH_SPACE_SETTINGS_TEAMS'),
  SET_SPACE_SETTINGS: namespace('spaceSettings', 'SET_SPACE_SETTINGS'),
  SET_SPACE_SETTINGS_TEAMS: namespace('spaceSettings', 'SET_SPACE_SETTINGS_TEAMS'),
};

export const actions = {
  updateSpace: withPayload(types.UPDATE_SPACE_SETTINGS),
  updateSpaceError: withPayload(types.UPDATE_SPACE_SETTINGS_ERROR),
  fetchSpaceSettings: withPayload(types.FETCH_SPACE_SETTINGS),
  fetchSpaceSettingsTeams: withPayload(types.FETCH_SPACE_SETTINGS_TEAMS),
  setSpaceSettings: withPayload(types.SET_SPACE_SETTINGS),
  setSpaceSettingsTeams: withPayload(types.SET_SPACE_SETTINGS_TEAMS),
};

export const State = Record({
  loading: true,
  spaceKappsForms: null,
  teams: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_SPACE_SETTINGS:
      return state.set('loading', true);
    case types.FETCH_SPACE_SETTINGS_TEAMS:
      return state.set('loading', true);
    case types.SET_SPACE_SETTINGS:
      return state
        .set('spaceKappsForms', payload)
        .set('loading', false)
        .set('error', null);
    case types.SET_SPACE_SETTINGS_TEAMS:
      return state
        .set('teams', payload)
        .set('loading', false)
        .set('error', null);
    case types.UPDATE_SPACE_SETTINGS_ERROR:
      return state
        .set('spaceSettings', null)
        .set('loading', false)
        .set('error', payload);
    case types.UPDATE_SPACE_SETTINGS:
      return state.set('loading', false);
    default:
      return state;
  }
};
