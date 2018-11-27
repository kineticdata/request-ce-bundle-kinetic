import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const APPOINTMENT_FORM_SLUG = 'appointment';

export const types = {
  FETCH_APPOINTMENT: namespace('appointments', 'FETCH_APPOINTMENT'),
  SET_APPOINTMENT: namespace('appointments', 'SET_APPOINTMENT'),
  SET_APPOINTMENT_ERRORS: namespace('appointments', 'SET_APPOINTMENT_ERRORS'),
  FETCH_UPCOMING_APPOINTMENTS: namespace(
    'appointments',
    'FETCH_UPCOMING_APPOINTMENTS',
  ),
  SET_UPCOMING_APPOINTMENTS: namespace(
    'appointments',
    'SET_UPCOMING_APPOINTMENTS',
  ),
  SET_UPCOMING_APPOINTMENT_ERRORS: namespace(
    'appointments',
    'SET_UPCOMING_APPOINTMENT_ERRORS',
  ),
  FETCH_PAST_APPOINTMENTS: namespace('appointments', 'FETCH_PAST_APPOINTMENTS'),
  SET_PAST_APPOINTMENTS: namespace('appointments', 'SET_PAST_APPOINTMENTS'),
  SET_PAST_APPOINTMENT_ERRORS: namespace(
    'appointments',
    'SET_PAST_APPOINTMENT_ERRORS',
  ),
  FETCH_TODAY_APPOINTMENTS: namespace(
    'appointments',
    'FETCH_TODAY_APPOINTMENTS',
  ),
  SET_TODAY_APPOINTMENTS: namespace('appointments', 'SET_TODAY_APPOINTMENTS'),
  SET_TODAY_APPOINTMENT_ERRORS: namespace(
    'appointments',
    'SET_TODAY_APPOINTMENT_ERRORS',
  ),
};

export const actions = {
  fetchAppointment: withPayload(types.FETCH_APPOINTMENT),
  setAppointment: withPayload(types.SET_APPOINTMENT),
  setAppointmentErrors: withPayload(types.SET_APPOINTMENT_ERRORS),
  fetchUpcomingAppointments: noPayload(types.FETCH_UPCOMING_APPOINTMENTS),
  setUpcomingAppointments: withPayload(types.SET_UPCOMING_APPOINTMENTS),
  setUpcomingAppointmentErrors: withPayload(
    types.SET_UPCOMING_APPOINTMENT_ERRORS,
  ),
  fetchPastAppointments: noPayload(types.FETCH_PAST_APPOINTMENTS),
  setPastAppointments: withPayload(types.SET_PAST_APPOINTMENTS),
  setPastAppointmentErrors: withPayload(types.SET_PAST_APPOINTMENT_ERRORS),
  fetchTodayAppointments: withPayload(types.FETCH_TODAY_APPOINTMENTS),
  setTodayAppointments: withPayload(types.SET_TODAY_APPOINTMENTS),
  setTodayAppointmentErrors: withPayload(types.SET_TODAY_APPOINTMENT_ERRORS),
};

export const State = Record({
  loading: true,
  errors: [],
  appointment: null,
  upcoming: {
    loading: false,
    errors: [],
    data: new List(),
  },
  past: {
    loading: false,
    errors: [],
    data: new List(),
  },
  today: {
    loading: false,
    errors: [],
    data: new List(),
  },
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APPOINTMENT:
      return state.set('loading', true);
    case types.SET_APPOINTMENT:
      return state.set('appointment', payload).set('loading', false);
    case types.SET_APPOINTMENT_ERRORS:
      return state.set('errors', payload).set('loading', false);
    case types.FETCH_UPCOMING_APPOINTMENTS:
      return state.setIn(['upcoming', 'loading'], true);
    case types.SET_UPCOMING_APPOINTMENTS:
      return state
        .setIn(
          ['upcoming', 'data'],
          List(payload).sortBy(
            a => `${a.values['Event Date']} ${a.values['Event Time']}`,
          ),
        )
        .setIn(['upcoming', 'loading'], false);
    case types.SET_UPCOMING_APPOINTMENT_ERRORS:
      return state
        .setIn(['upcoming', 'errors'], payload)
        .setIn(['upcoming', 'loading'], false);
    case types.FETCH_PAST_APPOINTMENTS:
      return state.setIn(['past', 'loading'], true);
    case types.SET_PAST_APPOINTMENTS:
      return state
        .setIn(
          ['past', 'data'],
          List(payload).sortBy(
            a => `${a.values['Event Date']} ${a.values['Event Time']}`,
            (a, b) => (a < b ? 1 : a > b ? -1 : 0),
          ),
        )
        .setIn(['past', 'loading'], false);
    case types.SET_PAST_APPOINTMENT_ERRORS:
      return state
        .setIn(['past', 'errors'], payload)
        .setIn(['past', 'loading'], false);
    case types.FETCH_TODAY_APPOINTMENTS:
      return state.setIn(['today', 'loading'], true);
    case types.SET_TODAY_APPOINTMENTS:
      return state
        .setIn(
          ['today', 'data'],
          List(payload).sortBy(
            a => `${a.values['Event Date']} ${a.values['Event Time']}`,
          ),
        )
        .setIn(['today', 'loading'], false);
    case types.SET_TODAY_APPOINTMENT_ERRORS:
      return state
        .setIn(['today', 'errors'], payload)
        .setIn(['today', 'loading'], false);
    default:
      return state;
  }
};
