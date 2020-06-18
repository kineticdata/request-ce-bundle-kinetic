import { Record, Map, List } from 'immutable';
import moment from 'moment';
import { namespaceBuilder, withPayload, noPayload } from '../../utils';
import { generateKey } from '@kineticdata/react';
const ns = namespaceBuilder('common/calendar');

export const types = {
  FETCH_CALENDAR_CONFIGURATION: ns('FETCH_CALENDAR_CONFIGURATION'),
  FETCH_CALENDAR_CONFIGURATION_SUCCESS: ns(
    'FETCH_CALENDAR_CONFIGURATION_SUCCESS',
  ),
  SET_CALENDAR_DATE_SELECT: ns('SET_CALENDAR_DATE_SELECT'),
  SET_CALENDAR_EVENT_SELECT: ns('SET_CALENDAR_EVENT_SELECT'),
  SET_CALENDAR_VIEW_CHANGE: ns('SET_CALENDAR_VIEW_CHANGE'),
  SET_CALENDAR_NAVIGATE_CHANGE: ns('SET_CALENDAR_NAVIGATE_CHANGE'),
  SET_CALENDAR_DATE_CHANGE: ns('SET_CALENDAR_DATE_CHANGE'),
  FETCH_CALENDAR_EVENTS: ns('FETCH_CALENDAR_EVENTS'),
  FETCH_CALENDAR_EVENTS_SUCCESS: ns('FETCH_CALENDAR_EVENTS_SUCCESS'),
  FETCH_LOCALE_META_REQUEST: ns('FETCH_LOCALE_META_REQUEST'),
  FETCH_LOCALE_META_SUCCESS: ns('FETCH_LOCALE_META_SUCCESS'),
  FETCH_LOCALE_META_FAILURE: ns('FETCH_LOCALE_META_FAILURE'),
  UPDATE_FROM_FILTER: ns('UPDATE_FROM_FILTER'),
  SET_FILTER_ACTIONS: ns('SET_FILTER_ACTIONS'),
};

export const actions = {
  fetchCalendarConfig: withPayload(types.FETCH_CALENDAR_CONFIGURATION),
  fetchCalendarConfigSuccess: withPayload(
    types.FETCH_CALENDAR_CONFIGURATION_SUCCESS,
  ),
  setCalendarDateSelect: withPayload(types.SET_CALENDAR_DATE_SELECT),
  setCalendarEventSelect: withPayload(types.SET_CALENDAR_EVENT_SELECT),
  setCalendarViewChange: withPayload(types.SET_CALENDAR_VIEW_CHANGE),
  setCalendarNavigateChange: withPayload(types.SET_CALENDAR_NAVIGATE_CHANGE),
  setMiniDateChange: withPayload(types.SET_CALENDAR_DATE_CHANGE),
  fetchCalendarEvents: withPayload(types.FETCH_CALENDAR_EVENTS),
  fetchCalendarEventsSuccess: withPayload(types.FETCH_CALENDAR_EVENTS_SUCCESS),
  fetchLocaleMetaRequest: noPayload(types.FETCH_LOCALE_META_REQUEST),
  fetchLocaleMetaSuccess: withPayload(types.FETCH_LOCALE_META_SUCCESS),
  fetchLocaleMetaFailure: withPayload(types.FETCH_LOCALE_META_FAILURE),
  updateFromFilter: withPayload(types.UPDATE_FROM_FILTER),
  setFilterActions: withPayload(types.SET_FILTER_ACTIONS),
};

const Calendar = Record({
  loading: false,
  selectedDate: moment(),
  mainCalendarDate: null,
  mainCalendarEvent: null,
  mainCalendarView: 'month',
  miniDateActive: false,
  datePickerKey: generateKey(),
  dateModalOpen: false,
  eventModalOpen: false,
  calendarConfigured: false,
  eventTypes: Map(),
  events: [],
  filterActions: Map(),
  updatedConfigKey: Date.now(),
  calendarConfig: {},
});

const State = Record({
  //locales: null,
  timezones: [],
});

export const reducer = (state, { type, payload }) => {
  if (typeof state == 'undefined') {
    return Map()
      .set('default', Calendar())
      .merge(State());
  }
  switch (type) {
    case types.FETCH_CALENDAR_CONFIGURATION:
      return state.set(payload.key, Calendar());
    case types.FETCH_CALENDAR_CONFIGURATION_SUCCESS:
      return state
        .setIn([payload.key, 'loading'], false)
        .setIn([payload.key, 'eventTypes'], payload.eventTypes)
        .setIn([payload.key, 'calendarConfig'], payload.calendarConfig)
        .setIn([payload.key, 'updatedConfigKey'], Date.now());
    case types.SET_CALENDAR_DATE_SELECT:
      return state
        .setIn([payload.key, 'mainCalendarDate'], payload.args)
        .setIn([payload.key, 'dateModalOpen'], payload.modalOpen);
    case types.SET_CALENDAR_EVENT_SELECT:
      return state
        .setIn([payload.key, 'mainCalendarEvent'], payload.args)
        .setIn([payload.key, 'eventModalOpen'], payload.modalOpen);
    case types.SET_CALENDAR_VIEW_CHANGE:
      return state
        .setIn([payload.key, 'mainCalendarView'], payload.view)
        .setIn([payload.key, 'miniDateActive'], false);
    case types.SET_CALENDAR_NAVIGATE_CHANGE:
      return (
        state
          .setIn([payload.key, 'selectedDate'], moment(payload.date))
          // A work around for https://github.com/airbnb/react-dates/pull/1487
          .setIn([payload.key, 'datePickerKey'], generateKey())
          .setIn([payload.key, 'miniDateActive'], false)
      );
    case types.SET_CALENDAR_DATE_CHANGE:
      return state
        .setIn([payload.key, 'selectedDate'], payload.miniDate)
        .setIn([payload.key, 'mainCalendarView'], 'day')
        .setIn([payload.key, 'miniDateActive'], true);
    case types.FETCH_CALENDAR_EVENTS:
      return state.setIn([payload.key, 'loadingEvents'], true);
    case types.FETCH_CALENDAR_EVENTS_SUCCESS:
      return state
        .setIn([payload.key, 'loadingEvents'], false)
        .setIn([payload.key, 'events'], payload.events);
    case types.FETCH_LOCALE_META_SUCCESS:
      return state.set('timezones', payload.timezones);
    // .set('locales', payload.locales);
    case types.FETCH_LOCALE_META_FAILURE:
      return state.update('errors', errors => errors.push(payload));
    case types.UPDATE_FROM_FILTER:
      return state
        .setIn([payload.key, 'events'], payload.events)
        .setIn([payload.key, 'filterActions'], payload.filterActions);
    case types.SET_FILTER_ACTIONS:
      return state.setIn([payload.key, 'filterActions'], payload.filterActions);
    default:
      return state;
  }
};
