import { Record, List, Map } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

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
