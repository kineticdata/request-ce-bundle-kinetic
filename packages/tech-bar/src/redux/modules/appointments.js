import { Record, List } from 'immutable';
import { Utils } from 'common';
import moment from 'moment';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('techbar/appointments');

export const types = {
  FETCH_APPOINTMENTS_FAILURE: ns('FETCH_APPOINTMENTS_FAILURE'),
  FETCH_UPCOMING_APPOINTMENTS_REQUEST: ns(
    'FETCH_UPCOMING_APPOINTMENTS_REQUEST',
  ),
  FETCH_UPCOMING_APPOINTMENTS_SUCCESS: ns(
    'FETCH_UPCOMING_APPOINTMENTS_SUCCESS',
  ),
  FETCH_PAST_APPOINTMENTS_REQUEST: ns('FETCH_PAST_APPOINTMENTS_REQUEST'),
  FETCH_PAST_APPOINTMENTS_SUCCESS: ns('FETCH_PAST_APPOINTMENTS_SUCCESS'),
  FETCH_TODAY_APPOINTMENTS_REQUEST: ns('FETCH_TODAY_APPOINTMENTS_REQUEST'),
  FETCH_TODAY_APPOINTMENTS_SUCCESS: ns('FETCH_TODAY_APPOINTMENTS_SUCCESS'),
  SET_APPOINTMENTS_LIST_DATE: ns('SET_APPOINTMENTS_LIST_DATE'),
  FETCH_APPOINTMENTS_LIST_REQUEST: ns('FETCH_APPOINTMENTS_LIST_REQUEST'),
  FETCH_APPOINTMENTS_LIST_SUCCESS: ns('FETCH_APPOINTMENTS_LIST_SUCCESS'),
  FETCH_APPOINTMENTS_OVERVIEW_REQUEST: ns(
    'FETCH_APPOINTMENTS_OVERVIEW_REQUEST',
  ),
  FETCH_APPOINTMENTS_OVERVIEW_SUCCESS: ns(
    'FETCH_APPOINTMENTS_OVERVIEW_SUCCESS',
  ),
  FETCH_APPOINTMENTS_OVERVIEW_FAILURE: ns(
    'FETCH_APPOINTMENTS_OVERVIEW_FAILURE',
  ),
};

export const actions = {
  fetchAppointmentsFailure: withPayload(types.FETCH_APPOINTMENTS_FAILURE),
  fetchUpcomingAppointmentsRequest: noPayload(
    types.FETCH_UPCOMING_APPOINTMENTS_REQUEST,
  ),
  fetchUpcomingAppointmentsSuccess: withPayload(
    types.FETCH_UPCOMING_APPOINTMENTS_SUCCESS,
  ),
  fetchPastAppointmentsRequest: noPayload(
    types.FETCH_PAST_APPOINTMENTS_REQUEST,
  ),
  fetchPastAppointmentsSuccess: withPayload(
    types.FETCH_PAST_APPOINTMENTS_SUCCESS,
  ),
  fetchTodayAppointmentsRequest: withPayload(
    types.FETCH_TODAY_APPOINTMENTS_REQUEST,
  ),
  fetchTodayAppointmentsSuccess: withPayload(
    types.FETCH_TODAY_APPOINTMENTS_SUCCESS,
  ),
  setAppointmentsListDate: withPayload(types.SET_APPOINTMENTS_LIST_DATE),
  fetchAppointmentsListRequest: withPayload(
    types.FETCH_APPOINTMENTS_LIST_REQUEST,
  ),
  fetchAppointmentsListSuccess: withPayload(
    types.FETCH_APPOINTMENTS_LIST_SUCCESS,
  ),

  fetchAppointmentsOverviewRequest: withPayload(
    types.FETCH_APPOINTMENTS_OVERVIEW_REQUEST,
  ),
  fetchAppointmentsOverviewSuccess: withPayload(
    types.FETCH_APPOINTMENTS_OVERVIEW_SUCCESS,
  ),
  fetchAppointmentsOverviewFailure: withPayload(
    types.FETCH_APPOINTMENTS_OVERVIEW_FAILURE,
  ),
};

export const State = Record({
  loading: true,
  error: null,
  upcoming: null,
  past: null,
  today: null,
  listDate: moment(),
  list: null,
  overview: null,
  overviewError: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APPOINTMENTS_FAILURE:
      return state.set('error', payload);
    case types.FETCH_UPCOMING_APPOINTMENTS_REQUEST:
      return state.set('error', null).set('upcoming', null);
    case types.FETCH_UPCOMING_APPOINTMENTS_SUCCESS:
      return state.set(
        'upcoming',
        List(payload).sortBy(
          a => `${a.values['Event Date']} ${a.values['Event Time']}`,
        ),
      );
    case types.FETCH_PAST_APPOINTMENTS_REQUEST:
      return state.set('error', null).set('past', null);
    case types.FETCH_PAST_APPOINTMENTS_SUCCESS:
      return state.set(
        'past',
        List(payload).sortBy(
          a => `${a.values['Event Date']} ${a.values['Event Time']}`,
          (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        ),
      );
    case types.FETCH_TODAY_APPOINTMENTS_REQUEST:
      return state.set('error', null).set('today', null);
    case types.FETCH_TODAY_APPOINTMENTS_SUCCESS:
      return state.set(
        'today',
        List(payload).sortBy(
          a => `${a.values['Event Date']} ${a.values['Event Time']}`,
        ),
      );
    case types.SET_APPOINTMENTS_LIST_DATE:
      return state.set('listDate', moment(payload.date));
    case types.FETCH_APPOINTMENTS_LIST_REQUEST:
      return state.set('error', null).set('list', null);
    case types.FETCH_APPOINTMENTS_LIST_SUCCESS:
      return state.set(
        'list',
        List(payload).sortBy(
          a => `${a.values['Event Date']} ${a.values['Event Time']}`,
        ),
      );
    case types.FETCH_APPOINTMENTS_OVERVIEW_REQUEST:
      return state.set('overviewError', null).set('overview', null);
    case types.FETCH_APPOINTMENTS_OVERVIEW_SUCCESS:
      return state.set('overview', List(payload));
    case types.FETCH_APPOINTMENTS_OVERVIEW_FAILURE:
      return state.set('overviewError', payload);
    default:
      return state;
  }
};
