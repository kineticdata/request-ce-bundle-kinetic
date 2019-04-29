import { Record, List, Set } from 'immutable';
import matchPath from 'rudy-match-path';
import { LOCATION_CHANGE } from 'redux-first-history';
import { Utils } from 'common';
import {
  Profile,
  Filter,
  AssignmentCriteria,
  filterReviver,
} from '../../records';
const { namespace, withPayload, noPayload, getAttributeValue } = Utils;

export const types = {
  LOAD_APP_SETTINGS: namespace('queueApp', 'LOAD_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('queueApp', 'SET_APP_SETTINGS'),
  SET_PROFILE: namespace('queueApp', 'SET_PROFILE'),
  ADD_PERSONAL_FILTER: namespace('queueApp', 'ADD_PERSONAL_FILTER'),
  UPDATE_PERSONAL_FILTER: namespace('queueApp', 'UPDATE_PERSONAL_FILTER'),
  REMOVE_PERSONAL_FILTER: namespace('queueApp', 'REMOVE_PERSONAL_FILTER'),
  SET_LAYOUT_SIZE: namespace('queueApp', 'SET_LAYOUT_SIZE'),
  SET_SIDEBAR_OPEN: namespace('queueApp', 'SET_SIDEBAR_OPEN'),
};

export const actions = {
  loadAppSettings: noPayload(types.LOAD_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  setProfile: withPayload(types.SET_PROFILE),
  addPersonalFilter: withPayload(types.ADD_PERSONAL_FILTER),
  updatePersonalFilter: withPayload(types.UPDATE_PERSONAL_FILTER),
  removePersonalFilter: withPayload(types.REMOVE_PERSONAL_FILTER),
  setLayoutSize: withPayload(types.SET_LAYOUT_SIZE),
  setSidebarOpen: withPayload(types.SET_SIDEBAR_OPEN),
};

const ADHOC_PATH = { path: '*/adhoc', exact: false };
const DEFAULT_LIST_PATH = { path: '*/list/:name', exact: false };
const TEAM_LIST_PATH = { path: '*/team/:name', exact: false };
const CUSTOM_LIST_PATH = { path: '*/custom/:name', exact: false };

export const getFilterByPath = (state, pathname) => {
  const findByName = name => filter => filter.name === name;
  const adhocMatch = matchPath(pathname, ADHOC_PATH);
  const defaultListMatch = matchPath(pathname, DEFAULT_LIST_PATH);
  const teamListMatch = matchPath(pathname, TEAM_LIST_PATH);
  const customListMatch = matchPath(pathname, CUSTOM_LIST_PATH);
  if (adhocMatch) {
    return state.queue.adhocFilter;
  } else if (defaultListMatch) {
    return state.queueApp.filters.find(
      findByName(defaultListMatch.params.name),
    );
  } else if (teamListMatch) {
    let filterName = teamListMatch.params.name;
    try {
      filterName = decodeURIComponent(teamListMatch.params.name);
    } catch (e) {}
    return state.queueApp.teamFilters.find(findByName(filterName));
  } else if (customListMatch) {
    let filterName = customListMatch.params.name;
    try {
      filterName = decodeURIComponent(customListMatch.params.name);
    } catch (e) {}
    return state.queueApp.myFilters.find(findByName(filterName));
  }
};

export const selectMyTeamForms = state =>
  state.queueApp.forms.filter(f => {
    const owningTeam = f.attributes['Owning Team'];
    return owningTeam
      ? state.queueApp.myTeams
          .map(t => t.name)
          .toSet()
          .intersect(new Set(owningTeam)).size > 0
      : true;
  });

export const selectAssignments = (allTeams, form, queueItem) => {
  // Filter out any teams without members
  const filteredTeams = allTeams.filter(t => t.memberships.length > 0);
  const disallowReassignment =
    !!form &&
    !!queueItem &&
    ['No', 'False'].includes(
      Utils.getAttributeValue(form, 'Allow Reassignment', 'Yes'),
    );
  const assignableTeams = form
    ? Utils.getAttributeValues(form, 'Assignable Teams', [])
    : [];

  const availableTeams =
    queueItem && disallowReassignment
      ? // If queue item exists and doesn't allow reassignment,
        // only allow reassignment to users in current Assigned Team
        filteredTeams.filter(t => t.name === queueItem.values['Assigned Team'])
      : // Otherwise see if form defines which teams it can be assigned to
        assignableTeams.length > 0
        ? // If Assignable Teams attribute isn't empty,
          //only allow reassignment to the listed fields
          filteredTeams.filter(t => assignableTeams.includes(t.name))
        : // Otherwise allow reassignment to any team
          filteredTeams;

  return availableTeams.flatMap(t =>
    t.memberships
      .map(m => {
        const user = m.user;
        user.team = t.name;
        return user;
      })
      .concat([
        {
          username: null,
          displayName: 'Unassigned',
          team: t.name,
        },
      ]),
  );
};

export const getTeamIcon = team => {
  const iconAttribute = Utils.getAttributeValue(team, 'Icon', 'fa-users');
  return iconAttribute.indexOf('fa-') === 0
    ? iconAttribute.slice('fa-'.length)
    : iconAttribute;
};

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
  teamFilters: List(),
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
        .set(
          'teamFilters',
          List(payload.myTeams)
            .map(team => {
              const filter = filterReviver(
                getAttributeValue(team, 'Default Queue Filter'),
              );
              if (filter) {
                return filter
                  .set('type', 'team')
                  .update('name', name => name || team.name)
                  .update('icon', icon => icon || getTeamIcon(team))
                  .update(
                    'teams',
                    teams =>
                      teams.includes(team.name) ? teams : teams.push(team.name),
                  );
              } else {
                return Filter({
                  name: team.name,
                  type: 'team',
                  icon: getTeamIcon(team),
                  teams: List([team.name]),
                  assignments: AssignmentCriteria({
                    mine: true,
                    teammates: true,
                    unassigned: true,
                  }),
                });
              }
            })
            .sortBy(filter => filter.name),
        )
        .set('myFilters', List(payload.myFilters))
        .set(
          'forms',
          payload.forms.filter(
            f => f.status === 'Active' || f.status === 'New',
          ),
        )
        .set('loading', false);
    case types.SET_PROFILE:
      return state.set('profile', payload);
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
