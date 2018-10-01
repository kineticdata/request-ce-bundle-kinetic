import { List, Map, Record } from 'immutable';
import { CoreAPI } from 'react-kinetic-core';
import moment from 'moment';
import isarray from 'isarray';
import { namespace, noPayload, withPayload } from '../utils';
import { DatastoreSubmission } from '../../records';
import {
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../redux/modules/schedulers';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_DISPLAY_FORMAT = 'LL';
export const TIME_FORMAT = 'HH:mm';
export const TIME_DISPLAY_FORMAT = 'LT';

export const fetchSchedulerBySchedulerId = id => {
  const schedulerQuery = new CoreAPI.SubmissionSearch(true);
  schedulerQuery
    .include('details,values')
    .limit('1')
    .index('values[Id]')
    .eq('values[Id]', id);
  return CoreAPI.searchSubmissions({
    search: schedulerQuery.build(),
    datastore: true,
    form: SCHEDULER_FORM_SLUG,
    include: 'values',
  });
};

export const fetchSchedulerConfigsBySchedulerId = id => {
  const query = new CoreAPI.SubmissionSearch(true);
  query
    .include('details,values')
    .limit('1000')
    .index('values[Scheduler Id],values[Event Type]:UNIQUE')
    .eq('values[Scheduler Id]', id);
  return CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: SCHEDULER_CONFIG_FORM_SLUG,
    include: 'values',
  });
};

export const fetchSchedulerAvailabilityBySchedulerId = id => {
  const query = new CoreAPI.SubmissionSearch(true);
  query
    .include('details,values')
    .limit('1000')
    .index(
      'values[Scheduler Id],values[Day],values[Start Time],values[End Time]',
    )
    .eq('values[Scheduler Id]', id);
  return CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: SCHEDULER_AVAILABILITY_FORM_SLUG,
    include: 'values',
  });
};

export const fetchSchedulerOverridesBySchedulerIdAndDate = (id, date, days) => {
  const momentDate = moment(date);
  if (!momentDate.isValid()) {
    throw new Error('Invalid date provided when fetching scheduler overrides.');
  }
  const query = new CoreAPI.SubmissionSearch(true);
  query
    .include('details,values')
    .limit('1000')
    .index(
      'values[Scheduler Id],values[Date],values[Start Time],values[End Time]',
    )
    .eq('values[Scheduler Id]', id);
  if (days && days > 1) {
    query
      .gteq('values[Date]', momentDate.format(DATE_FORMAT))
      .lteq('values[Date]', momentDate.add(days, 'day').format(DATE_FORMAT));
  } else {
    query.eq('values[Date]', momentDate.format(DATE_FORMAT));
  }
  return CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: SCHEDULER_OVERRIDE_FORM_SLUG,
    include: 'values',
  });
};

export const fetchScheduledEventsBySchedulerIdAndDate = (id, date, days) => {
  const momentDate = moment(date);
  if (!momentDate.isValid()) {
    throw new Error('Invalid date provided when fetching scheduled events.');
  }
  const query = new CoreAPI.SubmissionSearch(true);
  query
    .include('details,values')
    .limit('1000')
    .index('values[Scheduler Id],values[Date],values[Time]')
    .eq('values[Scheduler Id]', id);
  if (days && days > 1) {
    query
      .gteq('values[Date]', momentDate.format(DATE_FORMAT))
      .lteq('values[Date]', momentDate.add(days, 'day').format(DATE_FORMAT));
  } else {
    query.eq('values[Date]', momentDate.format(DATE_FORMAT));
  }
  return CoreAPI.searchSubmissions({
    search: query.build(),
    datastore: true,
    form: SCHEDULED_EVENT_FORM_SLUG,
    include: 'values',
  });
};

export const fetchScheduledEventById = id => {
  return CoreAPI.fetchSubmission({
    id,
    datastore: true,
    include: 'values',
  });
};

export const types = {
  SET_STATE: namespace('schedulerWidget', 'SET_STATE'),
  SET_TYPE: namespace('schedulerWidget', 'SET_TYPE'),
  SET_DATE: namespace('schedulerWidget', 'SET_DATE'),
  SET_TIME: namespace('schedulerWidget', 'SET_TIME'),
  SET_DURATION_MULTIPLIER: namespace(
    'schedulerWidget',
    'SET_DURATION_MULTIPLIER',
  ),
  SET_LOADING: namespace('schedulerWidget', 'SET_LOADING'),
  SET_LOADING_DATA: namespace('schedulerWidget', 'SET_LOADING_DATA'),
  ADD_ERRORS: namespace('schedulerWidget', 'ADD_ERRORS'),
  SET_SCHEDULER: namespace('schedulerWidget', 'SET_SCHEDULER'),
  SET_CONFIGS: namespace('schedulerWidget', 'SET_CONFIGS'),
  SET_AVAILABILITY: namespace('schedulerWidget', 'SET_AVAILABILITY'),
  SET_OVERRIDES: namespace('schedulerWidget', 'SET_OVERRIDES'),
  SET_EVENTS: namespace('schedulerWidget', 'SET_EVENTS'),
  SET_SCHEDULING: namespace('schedulerWidget', 'SET_SCHEDULING'),
  SET_EVENT: namespace('schedulerWidget', 'SET_EVENT'),
  SET_EVENT_TO_CHANGE: namespace('schedulerWidget', 'SET_EVENT_TO_CHANGE'),
  SET_TIMELINE: namespace('schedulerWidget', 'SET_EVENT'),
  ADD_TIMESLOTS: namespace('schedulerWidget', 'ADD_TIMESLOTS'),
  CALLBACK: namespace('schedulerWidget', 'CALLBACK'),
  CHANGE_SCHEDULED_EVENT: namespace(
    'schedulerWidget',
    'CHANGE_SCHEDULED_EVENT',
  ),
};

export const actions = {
  setState: withPayload(types.SET_STATE),
  setLoading: withPayload(types.SET_LOADING),
  setLoadingData: withPayload(types.SET_LOADING_DATA),
  setType: withPayload(types.SET_TYPE),
  setDate: withPayload(types.SET_DATE),
  setTime: withPayload(types.SET_TIME),
  setDurationMultiplier: withPayload(types.SET_DURATION_MULTIPLIER),
  addErrors: withPayload(types.ADD_ERRORS),
  setScheduler: withPayload(types.SET_SCHEDULER),
  setConfigs: withPayload(types.SET_CONFIGS),
  setAvailability: withPayload(types.SET_AVAILABILITY),
  setOverrides: withPayload(types.SET_OVERRIDES),
  setEvents: withPayload(types.SET_EVENTS),
  setScheduling: withPayload(types.SET_SCHEDULING),
  setEvent: withPayload(types.SET_EVENT),
  setEventToChange: withPayload(types.SET_EVENT_TO_CHANGE),
  addTimeslots: withPayload(types.ADD_TIMESLOTS),
  callback: withPayload(types.CALLBACK),
  changeScheduledEvent: withPayload(types.CHANGE_SCHEDULED_EVENT),
};

export const State = Record({
  scheduledEventId: '',
  schedulerId: '',
  type: '',
  date: '',
  time: '',
  durationMultiplier: 1,
  loading: true,
  loadingData: false,
  errors: new List(),
  scheduler: new DatastoreSubmission(),
  configs: new List(),
  availability: new List(),
  overrides: new List(),
  events: new List(),
  scheduling: false,
  event: null,
  eventToChange: null,
  timeslots: {},
});

export const reducer = (state = State(), { type, payload }) => {
  console.log('REDUCER', type, payload);
  switch (type) {
    case types.SET_STATE:
      return Map(payload).reduce(
        (updatedState, value, key) => updatedState.set(key, value),
        state,
      );
    case types.SET_TYPE:
      return state.set('type', payload);
    case types.SET_DATE:
      return state.set('date', payload);
    case types.SET_TIME:
      return state.set('time', payload);
    case types.SET_DURATION_MULTIPLIER:
      return state.set('durationMultiplier', parseInt(payload, 10) || 1);
    case types.SET_LOADING:
      return state.set('loading', payload !== false);
    case types.SET_LOADING_DATA:
      return state.set('loadingData', payload !== false);
    case types.ADD_ERRORS:
      return state.update('errors', errors => errors.push(...payload));
    case types.SET_SCHEDULER:
      return state.set('scheduler', DatastoreSubmission(payload));
    case types.SET_CONFIGS:
      return state.set('configs', List(payload));
    case types.SET_AVAILABILITY:
      return state.set('availability', List(payload));
    case types.SET_OVERRIDES:
      return state.set('overrides', List(payload));
    case types.SET_EVENTS:
      return state.set('events', List(payload));
    case types.SET_SCHEDULING:
      return state.set('scheduling', payload !== false);
    case types.SET_EVENT:
      return state.set('event', payload);
    case types.SET_EVENT_TO_CHANGE:
      return state.set('eventToChange', payload);
    case types.ADD_TIMESLOTS:
      return state.update('timeslots', slots => ({ ...slots, ...payload }));
    case types.CALLBACK:
      payload(state);
      return state;
    case types.CHANGE_SCHEDULED_EVENT:
      if (payload) {
        return state
          .set('eventToChange', state.event)
          .set('schedulerId', state.event.values['Scheduler Id'])
          .set('type', state.event.values['Event Type'])
          .set('date', state.event.values['Date'])
          .set('time', state.event.values['Time'])
          .set('event', null);
      } else {
        return state
          .set('event', state.eventToChange)
          .set('eventToChange', null);
      }
    default:
      return state;
  }
};
