import { Record, List, Set } from 'immutable';
import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE } from 'connected-react-router';
import { Utils } from 'common';
import { Profile, Filter, AssignmentCriteria } from '../../records';
const { namespace, withPayload, noPayload } = Utils;

export const types = {
  LOAD_APP_SETTINGS: namespace('queueApp', 'LOAD_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('queueApp', 'SET_APP_SETTINGS'),
  ADD_PERSONAL_FILTER: namespace('queueApp', 'ADD_PERSONAL_FILTER'),
  UPDATE_PERSONAL_FILTER: namespace('queueApp', 'UPDATE_PERSONAL_FILTER'),
  REMOVE_PERSONAL_FILTER: namespace('queueApp', 'REMOVE_PERSONAL_FILTER'),
  SET_LAYOUT_SIZE: namespace('queueApp', 'SET_LAYOUT_SIZE'),
  SET_SIDEBAR_OPEN: namespace('queueApp', 'SET_SIDEBAR_OPEN'),
};

export const actions = {
  loadAppSettings: noPayload(types.LOAD_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  addPersonalFilter: withPayload(types.ADD_PERSONAL_FILTER),
  updatePersonalFilter: withPayload(types.UPDATE_PERSONAL_FILTER),
  removePersonalFilter: withPayload(types.REMOVE_PERSONAL_FILTER),
  setLayoutSize: withPayload(types.SET_LAYOUT_SIZE),
  setSidebarOpen: withPayload(types.SET_SIDEBAR_OPEN),
};

const ADHOC_PATH = { path: '/kapps/:slug/adhoc', exact: false };
const DEFAULT_LIST_PATH = { path: '/kapps/:slug/list/:name', exact: false };
const CUSTOM_LIST_PATH = { path: '/kapps/:slug/custom/:name', exact: false };

export const getFilterByPath = (state, pathname) => {
  const findByName = name => filter => filter.name === name;
  const adhocMatch = matchPath(pathname, ADHOC_PATH);
  const defaultListMatch = matchPath(pathname, DEFAULT_LIST_PATH);
  const customListMatch = matchPath(pathname, CUSTOM_LIST_PATH);
  if (adhocMatch) {
    return state.queue.queue.adhocFilter;
  } else if (defaultListMatch) {
    return state.queue.queueApp.filters.find(
      findByName(defaultListMatch.params.name),
    );
  } else if (customListMatch) {
    return state.queue.queueApp.myFilters.find(
      findByName(customListMatch.params.name),
    );
  }
};

export const buildFilterPath = filter => {
  if (!filter) {
    return '';
  } else if (filter.type === 'default') {
    return `/list/${filter.name}`;
  } else if (filter.type === 'custom') {
    return `/custom/${filter.name}`;
  } else {
    return '/adhoc';
  }
};

export const selectMyTeamForms = state =>
  state.queue.queueApp.forms.filter(f => {
    const owningTeam = f.attributes['Owning Team'];
    return owningTeam
      ? state.queue.queueApp.myTeams
          .map(t => t.name)
          .toSet()
          .intersect(new Set(owningTeam)).size > 0
      : true;
  });

export const selectAssignments = state =>
  state.queue.queueApp.allTeams
    .flatMap(t =>
      t.memberships.map(m => {
        const user = m.user;
        user.team = t.name;
        return user;
      }),
    )
    .concat(
      state.queue.queueApp.allTeams.map(t => ({
        username: null,
        displayName: 'Unassigned',
        team: t.name,
      })),
    );

/*
 *
 * Mine (only assigned to me)
 * Teammates (members of all of my teams except me)
 * Unassigned (assigned to one of my teams but not to an individual)
 */

export const State = Record({
  profile: Profile(),
  filters: List([
    Filter({
      name: 'Mine',
      assignments: AssignmentCriteria({
        mine: true,
      }),
    }),
    Filter({
      name: 'Teammates',
      assignments: AssignmentCriteria({
        teammates: true,
      }),
    }),
    Filter({
      name: 'Unassigned',
      assignments: AssignmentCriteria({
        unassigned: true,
      }),
    }),
    Filter({
      name: 'Created By Me',
      createdByMe: true,
    }),
  ]),
  allTeams: List(),
  myTeams: List(),
  myTeammates: List(),
  myFilters: List(),
  forms: List(),
  loading: true,
  layoutSize: 'small',
  sidebarOpen: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.LOAD_APP_SETTINGS:
      return state.set('loading', true);
    case types.SET_APP_SETTINGS:
      return state
        .set('profile', payload.profile)
        .set('allTeams', List(payload.allTeams))
        .set('myTeams', List(payload.myTeams))
        .set('myTeammates', payload.myTeammates)
        .set('myFilters', List(payload.myFilters))
        .set('forms', payload.forms)
        .set('loading', false);
    case types.ADD_PERSONAL_FILTER:
      return state.update('myFilters', filters => filters.push(payload));
    case types.UPDATE_PERSONAL_FILTER:
      return state.update('myFilters', filters =>
        filters.set(filters.findIndex(f => f.name === payload.name), payload),
      );
    case types.REMOVE_PERSONAL_FILTER:
      return state.update('myFilters', myFilters =>
        myFilters.filterNot(f => f.name === payload.name),
      );
    case LOCATION_CHANGE:
      return state.layoutSize === 'small'
        ? state.set('sidebarOpen', false)
        : state;
    case types.SET_LAYOUT_SIZE:
      return state.set('layoutSize', payload);
    case types.SET_SIDEBAR_OPEN:
      return state.set('sidebarOpen', payload);
    default:
      return state;
  }
};
