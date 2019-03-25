import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload } = Utils;

export const WALK_IN_FORM_SLUG = 'walk-in';

export const types = {
  FETCH_WALK_IN: namespace('walkIns', 'FETCH_WALK_IN'),
  SET_WALK_IN: namespace('walkIns', 'SET_WALK_IN'),
  SET_WALK_IN_ERRORS: namespace('walkIns', 'SET_WALK_IN_ERRORS'),
  FETCH_TODAY_WALK_INS: namespace('walkIns', 'FETCH_TODAY_WALK_INS'),
  SET_TODAY_WALK_INS: namespace('walkIns', 'SET_TODAY_WALK_INS'),
  SET_TODAY_WALK_IN_ERRORS: namespace('walkIns', 'SET_TODAY_WALK_IN_ERRORS'),
  FETCH_WALK_INS_OVERVIEW: namespace('appointments', 'FETCH_WALK_INS_OVERVIEW'),
  SET_WALK_INS_OVERVIEW: namespace('appointments', 'SET_WALK_INS_OVERVIEW'),
  SET_WALK_INS_OVERVIEW_ERRORS: namespace(
    'appointments',
    'SET_WALK_INS_OVERVIEW_ERRORS',
  ),
};

export const actions = {
  fetchWalkIn: withPayload(types.FETCH_WALK_IN),
  setWalkIn: withPayload(types.SET_WALK_IN),
  setWalkInErrors: withPayload(types.SET_WALK_IN_ERRORS),
  fetchTodayWalkIns: withPayload(types.FETCH_TODAY_WALK_INS),
  setTodayWalkIns: withPayload(types.SET_TODAY_WALK_INS),
  setTodayWalkInErrors: withPayload(types.SET_TODAY_WALK_IN_ERRORS),
  fetchWalkInsOverview: withPayload(types.FETCH_WALK_INS_OVERVIEW),
  setWalkInsOverview: withPayload(types.SET_WALK_INS_OVERVIEW),
  setWalkInsOverviewErrors: withPayload(types.SET_WALK_INS_OVERVIEW_ERRORS),
};

export const State = Record({
  loading: true,
  errors: [],
  walkIn: null,
  today: {
    loading: true,
    errors: [],
    data: new List(),
  },
  overview: {
    loading: false,
    errors: [],
    data: new List(),
    count: 0,
  },
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_WALK_IN:
      return state.set('loading', true);
    case types.SET_WALK_IN:
      return state.set('walkIn', payload).set('loading', false);
    case types.SET_WALK_IN_ERRORS:
      return state.set('errors', payload).set('loading', false);
    case types.FETCH_TODAY_WALK_INS:
      return state.setIn(['today', 'loading'], true);
    case types.SET_TODAY_WALK_INS:
      return state
        .setIn(['today', 'errors'], [])
        .setIn(
          ['today', 'data'],
          List(payload).sortBy(
            a => `${a.values['Event Date']} ${a.values['Event Time']}`,
          ),
        )
        .setIn(['today', 'loading'], false);
    case types.SET_TODAY_WALK_IN_ERRORS:
      return state
        .setIn(['today', 'errors'], payload)
        .setIn(['today', 'loading'], false);
    case types.FETCH_WALK_INS_OVERVIEW:
      return state.setIn(['overview', 'loading'], true);
    case types.SET_WALK_INS_OVERVIEW:
      return state
        .setIn(['overview', 'data'], List(payload))
        .setIn(['overview', 'count'], payload.length || 0)
        .setIn(['overview', 'loading'], false);
    case types.SET_WALK_INS_OVERVIEW_ERRORS:
      return state
        .setIn(['overview', 'errors'], payload)
        .setIn(['overview', 'loading'], false);
    default:
      return state;
  }
};
