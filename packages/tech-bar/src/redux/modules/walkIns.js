import { Record, List } from 'immutable';
import { Utils } from 'common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('techbar/appointments');

export const types = {
  FETCH_WALK_INS_FAILURE: ns('FETCH_WALK_INS_FAILURE'),
  FETCH_TODAY_WALK_INS_REQUEST: ns('FETCH_TODAY_WALK_INS_REQUEST'),
  FETCH_TODAY_WALK_INS_SUCCESS: ns('FETCH_TODAY_WALK_INS_SUCCESS'),
  FETCH_WALK_INS_OVERVIEW_REQUEST: ns('FETCH_WALK_INS_OVERVIEW_REQUEST'),
  FETCH_WALK_INS_OVERVIEW_SUCCESS: ns('FETCH_WALK_INS_OVERVIEW_SUCCESS'),
  FETCH_WALK_INS_OVERVIEW_FAILURE: ns('FETCH_WALK_INS_OVERVIEW_FAILURE'),
};

export const actions = {
  fetchWalkInsFailure: withPayload(types.FETCH_WALK_INS_FAILURE),
  fetchTodayWalkInsRequest: withPayload(types.FETCH_TODAY_WALK_INS_REQUEST),
  fetchTodayWalkInsSuccess: withPayload(types.FETCH_TODAY_WALK_INS_SUCCESS),
  fetchWalkInsOverviewRequest: withPayload(
    types.FETCH_WALK_INS_OVERVIEW_REQUEST,
  ),
  fetchWalkInsOverviewSuccess: withPayload(
    types.FETCH_WALK_INS_OVERVIEW_SUCCESS,
  ),
  fetchWalkInsOverviewFailure: withPayload(
    types.FETCH_WALK_INS_OVERVIEW_FAILURE,
  ),
};

export const State = Record({
  loading: true,
  error: null,
  today: null,
  overview: null,
  overviewError: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_WALK_INS_FAILURE:
      return state.set('error', payload);
    case types.FETCH_TODAY_WALK_INS_REQUEST:
      return state.set('error', null).set('today', null);
    case types.FETCH_TODAY_WALK_INS_SUCCESS:
      return state.set(
        'today',
        List(payload).sortBy(
          a => `${a.values['Event Date']} ${a.values['Event Time']}`,
        ),
      );
    case types.FETCH_WALK_INS_OVERVIEW_REQUEST:
      return state.set('overviewError', null).set('overview', null);
    case types.FETCH_WALK_INS_OVERVIEW_SUCCESS:
      return state.set('overview', List(payload));
    case types.FETCH_WALK_INS_OVERVIEW_FAILURE:
      return state.set('overviewError', payload);
    default:
      return state;
  }
};
