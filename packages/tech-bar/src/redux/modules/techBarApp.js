import { Record, List } from 'immutable';
import { Utils } from 'common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('techbar/app');

export const enableLocationServices = techBars =>
  techBars.size > 1 &&
  techBars.filter(t => !!t.values['Latitude'] && !!t.values['Longitude']).size >
    0;

export const mapTechBarsForDistance = userLocation => techBar => {
  const distance =
    techBar.values['Latitude'] && techBar.values['Longitude']
      ? calcDistance(userLocation, {
          latitude: techBar.values['Latitude'],
          longitude: techBar.values['Longitude'],
        })
      : null;
  return { ...techBar, distance };
};

export const sortTechBarsByDistance = (a, b) => {
  if (
    (a.distance === null && b.distance === null) ||
    a.distance === b.distance
  ) {
    return 0;
  } else if (a.distance !== null && b.distance !== null) {
    return a.distance < b.distance ? -1 : 1;
  } else if (b.distance === null) {
    return -1;
  } else {
    return 1;
  }
};

const calcDistance = (start, end) => {
  const lat1 = parseFloat(start.latitude);
  const lon1 = parseFloat(start.longitude);
  const lat2 = parseFloat(end.latitude);
  const lon2 = parseFloat(end.longitude);
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return null;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
};

export const Settings = (object = {}) => ({
  submissionId: object.id,
  feedbackIdentitifcation:
    (object.values && object.values['Feedback Identification']) || 'Optional',
  allowWalkIns:
    ((object.values && object.values['Allow Walk-Ins']) || 'Yes') === 'Yes',
});

export const types = {
  FETCH_APP_DATA_REQUEST: ns('FETCH_APP_DATA_REQUEST'),
  FETCH_APP_DATA_SUCCESS: ns('FETCH_APP_DATA_SUCCESS'),
  FETCH_APP_DATA_FAILURE: ns('FETCH_APP_DATA_FAILURE'),
  UPDATE_TECH_BAR_SETTINGS_SUCCESS: ns('UPDATE_TECH_BAR_SETTINGS_SUCCESS'),
  FETCH_DISPLAY_TEAM_REQUEST: ns('FETCH_DISPLAY_TEAM_REQUEST'),
  FETCH_DISPLAY_TEAM_SUCCESS: ns('FETCH_DISPLAY_TEAM_SUCCESS'),
  FETCH_DISPLAY_TEAM_FAILURE: ns('FETCH_DISPLAY_TEAM_FAILURE'),
  CREATE_DISPLAY_TEAM_MEMBERSHIP_REQUEST: ns(
    'CREATE_DISPLAY_TEAM_MEMBERSHIP_REQUEST',
  ),
  CREATE_DISPLAY_TEAM_USER_REQUEST: ns('CREATE_DISPLAY_TEAM_USER_REQUEST'),
  DELETE_DISPLAY_TEAM_MEMBERSHIP_REQUEST: ns(
    'DELETE_DISPLAY_TEAM_MEMBERSHIP_REQUEST',
  ),
};

export const actions = {
  fetchAppDataRequest: withPayload(types.FETCH_APP_DATA_REQUEST),
  fetchAppDataSuccess: withPayload(types.FETCH_APP_DATA_SUCCESS),
  fetchAppDataFailure: withPayload(types.FETCH_APP_DATA_FAILURE),
  updateTechBarSettingsSuccess: withPayload(
    types.UPDATE_TECH_BAR_SETTINGS_SUCCESS,
  ),
  fetchDisplayTeamRequest: withPayload(types.FETCH_DISPLAY_TEAM_REQUEST),
  fetchDisplayTeamSuccess: withPayload(types.FETCH_DISPLAY_TEAM_SUCCESS),
  fetchDisplayTeamFailure: withPayload(types.FETCH_DISPLAY_TEAM_FAILURE),
  createDisplayTeamMembershipRequest: withPayload(
    types.CREATE_DISPLAY_TEAM_MEMBERSHIP_REQUEST,
  ),
  createDisplayTeamUserRequest: withPayload(
    types.CREATE_DISPLAY_TEAM_USER_REQUEST,
  ),
  deleteDisplayTeamMembershipRequest: withPayload(
    types.DELETE_DISPLAY_TEAM_MEMBERSHIP_REQUEST,
  ),
};

export const State = Record({
  loading: true,
  error: null,
  schedulers: null,
  forms: null,
  displayTeamError: null,
  displayTeam: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_DATA_REQUEST:
      return state.set('error', null);
    case types.FETCH_APP_DATA_SUCCESS:
      return state
        .set('schedulers', List(payload.schedulers))
        .set('forms', List(payload.forms))
        .set('loading', false);
    case types.FETCH_APP_DATA_FAILURE:
      return state.set('error', payload);
    case types.UPDATE_TECH_BAR_SETTINGS_SUCCESS:
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
    case types.FETCH_DISPLAY_TEAM_REQUEST:
      return state.set('displayTeam', null).set('displayTeamError', null);
    case types.FETCH_DISPLAY_TEAM_SUCCESS:
      return state.set('displayTeam', payload);
    case types.FETCH_DISPLAY_TEAM_FAILURE:
      return state.set('displayTeamError', payload);
    default:
      return state;
  }
};
