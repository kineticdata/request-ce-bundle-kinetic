import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_TEAMS: namespace('teams', 'FETCH_TEAMS'),
  ADD_TEAM: namespace('teams', 'ADD_TEAM'),
  REMOVE_TEAM: namespace('teams', 'REMOVE_TEAM'),
  SET_TEAMS: namespace('teams', 'SET_TEAMS'),
  SET_ROLES: namespace('teams', 'SET_ROLES'),
  RESET_TEAMS: namespace('teams', 'RESET_TEAMS'),
};

export const actions = {
  fetchTeams: noPayload(types.FETCH_TEAMS),
  setTeams: withPayload(types.SET_TEAMS),
  setRoles: withPayload(types.SET_ROLES),
  addTeam: withPayload(types.ADD_TEAM),
  removeTeam: withPayload(types.REMOVE_TEAM),
  resetTeams: noPayload(types.RESET_TEAMS),
};

export const State = Record({
  loading: true,
  error: null,
  data: List(),
  roles: List(),
});

export const selectParentTeams = state => {
  const team = state.team;

  return state.teamList.data.filter(
    parent =>
      !team.loading &&
      team.data !== null &&
      team.data.name.split('::').length > 1 &&
      parent.name.startsWith(team.data.name),
  );
};

export const selectSubTeams = state => {
  const team = state.team;

  if (team.loading || team.data === null) {
    return List();
  }

  return state.teamList.data.filter(t =>
    t.name.startsWith(`${team.data.name}::`),
  );
};

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_TEAMS:
      return state.set('error', null).set('loading', true);
    case types.SET_TEAMS:
      return state
        .set('error', null)
        .set('loading', false)
        .set(
          'data',
          List(payload).filter(
            team => team.name !== 'Role' && !team.name.startsWith('Role::'),
          ),
        );
    case types.SET_ROLES:
      return state
        .set('error', null)
        .set('loading', false)
        .set(
          'roles',
          List(payload).filter(
            team => team.name !== 'Role' && team.name.startsWith('Role::'),
          ),
        );
    case types.ADD_TEAM:
      return state.update('data', teams => teams.add(payload));
    case types.REMOVE_TEAM:
      return state.update('data', teams =>
        teams.filter(team => team.slug !== payload),
      );
    case types.RESET_TEAMS:
      return state.set('error', null).set('data', List());
    default:
      return state;
  }
};
