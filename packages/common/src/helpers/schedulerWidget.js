import { List, Map, Record } from 'immutable';
import { CoreAPI, bundle } from 'react-kinetic-core';
import moment from 'moment';
import { namespace, noPayload, withPayload } from '../utils';
import { DatastoreSubmission } from '../../records';
import {
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../redux/modules/schedulers';
import axios from 'axios';

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
    .index('values[Scheduler Id],values[Status],values[Event Type]')
    .eq('values[Scheduler Id]', id)
    .eq('values[Status]', 'Active');
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
    include: 'details,values',
  });
};

export const fetchScheduledEventById = id => {
  return CoreAPI.fetchSubmission({
    id,
    datastore: true,
    include: 'details,values',
  });
};

export const createScheduledEvent = values => {
  return CoreAPI.createSubmission({
    datastore: true,
    formSlug: SCHEDULED_EVENT_FORM_SLUG,
    values,
    completed: false,
    include: 'details,values',
  });
};

export const updateScheduledEvent = (id, values = {}, submit) => {
  return CoreAPI.updateSubmission({
    id,
    datastore: true,
    values,
    include: 'details,values',
    ...(submit ? { coreState: 'Submitted' } : {}),
  });
};

const handleErrors = error => {
  if (error instanceof Error && !error.response) {
    // When the error is an Error object an exception was thrown in the process.
    // so we'll just 'convert' it to a 400 error to be handled downstream.
    return { serverError: { status: 400, statusText: error.message } };
  }

  // Destructure out the information needed.
  const { data, status, statusText } = error.response;
  if (status === 400 && typeof data === 'object') {
    // If the errors returned are from server-side validations or constraints.
    if (data.errors) {
      return { errors: data.errors };
    } else if (data.error) {
      return { errors: [data.error], ...data };
    } else {
      return data;
    }
  }

  // For all other server-side errors.
  return { serverError: { status, statusText, error: data && data.error } };
};

const paramBuilder = options => {
  const params = {};
  if (options.include) {
    params.include = options.include;
  }
  if (options.limit) {
    params.limit = options.limit;
  }
  if (options.manage) {
    params.manage = options.manage;
  }
  if (options.export) {
    params.export = options.export;
  }
  return params;
};

const submitSubmission = options => {
  const { id, values, page } = options;
  return (
    axios
      .post(
        `${bundle.apiLocation()}/datastore/submissions/${id}`,
        { values },
        {
          params: {
            ...paramBuilder(options),
            page,
          },
        },
      )
      // Remove the response envelop and leave us with the submission one.
      .then(response => ({ submission: response.data.submission }))
      // Clean up any errors we receive. Make sure this the last thing so that it
      // cleans up any errors.
      .catch(handleErrors)
  );
};

export const submitScheduledEvent = ({ id, values }, page) => {
  return submitSubmission({
    id,
    values,
    page,
    include: 'details,values',
  });
};

export const deleteScheduledEvent = id => {
  return CoreAPI.deleteSubmission({
    id,
    datastore: true,
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
  ADD_SCHEDULING_ERRORS: namespace('schedulerWidget', 'ADD_SCHEDULING_ERRORS'),
  SET_EVENT: namespace('schedulerWidget', 'SET_EVENT'),
  SET_TIMELINE: namespace('schedulerWidget', 'SET_EVENT'),
  ADD_TIMESLOTS: namespace('schedulerWidget', 'ADD_TIMESLOTS'),
  CALLBACK: namespace('schedulerWidget', 'CALLBACK'),
  EDIT_EVENT: namespace('schedulerWidget', 'EDIT_EVENT'),
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
  addSchedulingErrors: withPayload(types.ADD_SCHEDULING_ERRORS),
  setEvent: withPayload(types.SET_EVENT),
  addTimeslots: withPayload(types.ADD_TIMESLOTS),
  callback: withPayload(types.CALLBACK),
  editEvent: withPayload(types.EDIT_EVENT),
};

export const State = Record({
  scheduledEventId: '',
  schedulerId: '',
  type: '',
  date: '',
  time: '',
  minAvailableDate: moment().startOf('day'),
  maxAvailableDate: null,
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
  schedulingErrors: new List(),
  event: null,
  timeslots: {},
});

export const reducer = (state = State(), { type, payload }) => {
  console.log(type);
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
      return payload !== false
        ? state.set('scheduling', true).set('schedulingErrors', new List())
        : state.set('scheduling', false);
    case types.ADD_SCHEDULING_ERRORS:
      return state
        .update('schedulingErrors', errors => errors.push(...payload))
        .set('scheduling', false);
    case types.SET_EVENT:
      return state.set('event', payload);
    case types.ADD_TIMESLOTS:
      return state.update('timeslots', slots => ({ ...slots, ...payload }));
    case types.CALLBACK:
      payload(state);
      return state;
    case types.EDIT_EVENT:
      return state
        .set('schedulerId', state.event.values['Scheduler Id'])
        .set('type', state.event.values['Event Type'])
        .set('date', state.event.values['Date'])
        .set('time', state.event.values['Time']);
    default:
      return state;
  }
};
