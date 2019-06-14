import { Record, List } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/teams');

export const types = {
  FETCH_TEAMS_REQUEST: ns('FETCH_TEAMS_REQUEST'),
  FETCH_TEAMS_SUCCESS: ns('FETCH_TEAMS_SUCCESS'),
  FETCH_TEAMS_FAILURE: ns('FETCH_TEAMS_FAILURE'),
  FETCH_TEAM_REQUEST: ns('FETCH_TEAM_REQUEST'),
  FETCH_TEAM_SUCCESS: ns('FETCH_TEAM_SUCCESS'),
  FETCH_TEAM_FAILURE: ns('FETCH_TEAM_FAILURE'),
};

export const actions = {
  fetchTeamsRequest: noPayload(types.FETCH_TEAMS_REQUEST),
  fetchTeamsSuccess: withPayload(types.FETCH_TEAMS_SUCCESS),
  fetchTeamsFailure: withPayload(types.FETCH_TEAMS_FAILURE),
  fetchTeamRequest: withPayload(types.FETCH_TEAM_REQUEST),
  fetchTeamSuccess: withPayload(types.FETCH_TEAM_SUCCESS),
  fetchTeamFailure: withPayload(types.FETCH_TEAM_FAILURE),
};

export const State = Record({
  error: null,
  data: null,
  roles: null,
  team: null,
  teamError: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_TEAMS_REQUEST:
      return state
        .set('error', null)
        .set('data', null)
        .set('roles', null);
    case types.FETCH_TEAMS_SUCCESS:
      return state
        .set(
          'data',
          List(payload).filter(
            team => team.name !== 'Role' && !team.name.startsWith('Role::'),
          ),
        )
        .set(
          'roles',
          List(payload).filter(
            team => team.name !== 'Role' && team.name.startsWith('Role::'),
          ),
        );
    case types.FETCH_TEAMS_FAILURE:
      return state.set('error', payload);
    case types.FETCH_TEAM_REQUEST:
      return state.set('teamError', null).set('team', null);
    case types.FETCH_TEAM_SUCCESS:
      return state.set('team', payload);
    case types.FETCH_TEAM_FAILURE:
      return state.set('teamError', payload);
    default:
      return state;
  }
};
