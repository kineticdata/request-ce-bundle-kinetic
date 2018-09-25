import React from 'react';
import { push } from 'connected-react-router';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withState,
  withStateHandlers,
  withReducer,
} from 'recompose';
import { List, Record } from 'immutable';
import moment from 'moment';
import isarray from 'isarray';
import {
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../../redux/modules/schedulers';
import { CoreAPI } from 'react-kinetic-core';
import { LoadingMessage, ErrorMessage } from './Schedulers';
import { namespace, noPayload, withPayload } from '../../utils';
import { DatastoreSubmission } from '../../../records';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const types = {
  TEST: namespace('schedulerWidget', 'TEST'),
};

const actions = {
  test: withPayload(types.TEST),
};

const SchedulerWidgetComponent = ({ getWidgetData }) => {
  const {
    loading,
    errors,
    type,
    showTypeSelect,
    onTypeChange,
    typeOptions,
    date,
    time,
    onTimeChange,
    onDateChange,
  } = getWidgetData();

  return (
    <div className="scheduler-widget">
      {loading && <LoadingMessage />}
      {!loading &&
        errors.length > 0 && (
          <ErrorMessage
            heading="The Scheduling Component Failed to Load"
            text={
              <ul>{errors.map((e, i) => <li key={`error-${i}`}>{e}</li>)}</ul>
            }
          />
        )}
      {!loading &&
        errors.length === 0 && (
          <form>
            {showTypeSelect && (
              <div className="form-group required">
                <label htmlFor="type-select" className="field-label">
                  Type
                </label>
                <select
                  name="type-select"
                  id="type-select"
                  value={type}
                  onChange={onTypeChange}
                >
                  <option />
                  {typeOptions}
                </select>
              </div>
            )}
            <div className="form-group required">
              <label htmlFor="date-input" className="field-label">
                Date
              </label>
              <input
                type="date"
                name="date-input"
                id="date-input"
                className="form-control"
                value={date}
                onChange={onDateChange}
              />
            </div>
          </form>
        )}
    </div>
  );
};

const Data = Record({
  schedulerId: null,
  type: '',
  date: '',
  time: '',
  loading: true,
  errors: [],
  scheduler: new DatastoreSubmission(),
  configs: new List(),
  availability: new List(),
  overrides: new List(),
  events: new List(),
  event: null,
  eventCreated: false,
  eventScheduled: false,
  rescheduleEvent: null,
  test: null,
});

const fetchSchedulerBySchedulerId = id => {
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

const fetchSchedulerConfigsBySchedulerId = id => {
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

const fetchSchedulerAvailabilityBySchedulerId = id => {
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

const fetchSchedulerOverridesBySchedulerIdAndDate = (id, date, days) => {
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

const fetchScheduledEventsBySchedulerIdAndDate = (id, date, days) => {
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

const fetchScheduledEventById = id => {
  return CoreAPI.fetchSubmission({
    id,
    datastore: true,
    include: 'values',
  });
};

const initSchedulerData = ({
  getState,
  updateState,
  schedulerId,
  scheduledEventId,
  eventDate,
  loadSchedulerDetails,
  validateProps,
}) => () => {
  updateState('set', 'loading', true);
  // If eventDate is provided to the widget, validate it
  if (eventDate && moment(eventDate).isValid()) {
    updateState('set', 'date', eventDate);
  } else {
    updateState('set', 'date', moment().format(DATE_FORMAT));
  }
  Promise.all([
    fetchSchedulerBySchedulerId(schedulerId),
    scheduledEventId && fetchScheduledEventById(scheduledEventId),
  ]).then(([scheduler, event]) => {
    // Process scheduler results
    if (scheduler.serverError) {
      const errorMessage =
        scheduler.serverError.error || scheduler.serverError.statusText;
      updateState('update', 'errors', errs => [...errs, errorMessage]);
    } else if (scheduler.errors) {
      updateState('update', 'errors', errs => [...errs, scheduler.errors]);
    } else if (scheduler.submissions.length !== 1) {
      const errorMessage = 'Scheduler could not be found.';
      updateState('update', 'errors', errs => [...errs, errorMessage]);
    } else {
      updateState('set', 'scheduler', scheduler.submissions[0]);
    }
    // Process event results if scheduledEventId was provided
    if (event) {
      if (event.serverError) {
        const errorMessage =
          event.serverError.error || event.serverError.statusText;
        updateState('update', 'errors', errs => [...errs, errorMessage]);
      } else if (event.errors) {
        updateState('update', 'errors', errs => [...errs, ...event.errors]);
      } else {
        updateState('set', 'event', event.submission);
      }
    }
    if (!event && getState('errors').length === 0) {
      loadSchedulerDetails();
      validateProps();
    } else {
      updateState('set', 'loading', false);
    }
  });
};

const loadSchedulerDetails = ({
  getState,
  updateState,
  processSchedulerDetails,
}) => dateRelatedOnly => {
  const {
    date,
    scheduler: {
      values: { Id: id, 'Reservation Timeout': timeout },
    },
  } = getState();
  console.log('load details', dateRelatedOnly, date);
  Promise.all(
    [
      !dateRelatedOnly && fetchSchedulerConfigsBySchedulerId(id),
      !dateRelatedOnly && fetchSchedulerAvailabilityBySchedulerId(id),
      fetchSchedulerOverridesBySchedulerIdAndDate(id, date),
      fetchScheduledEventsBySchedulerIdAndDate(id, date),
    ].filter(o => o),
  ).then(
    processSchedulerDetails(
      [
        !dateRelatedOnly && 'configs',
        !dateRelatedOnly && 'availability',
        'overrides',
        'events',
      ].filter(o => o),
      {
        events: events =>
          events.filter(
            event =>
              event.coreState === 'Submitted' ||
              (event.coreState === 'Draft' &&
                timeout &&
                moment().diff(moment(event.updatedAt), 'minutes') < timeout),
          ),
      },
    ),
  );
};

const processSchedulerDetails = ({ updateState }) => (
  dataNames,
  dataMods = {},
) => results => {
  console.log('process');
  const errorList = new List();
  results.forEach(({ submissions, errors, serverError }, index) => {
    if (serverError) {
      errorList.push(serverError.error || serverError.statusText);
    } else if (errors) {
      errorList.push(...errors);
    } else {
      const modifier = dataMods[dataNames[index]];
      updateState(
        'set',
        dataNames[index],
        new List(modifier ? modifier(submissions) : submissions),
      );
    }
  });
  updateState('set', 'errors', errorList.toJS());
  updateState('set', 'loading', false);
};

const validateProps = ({ getState, updateState, eventType }) => () => {
  // If eventType is provided to the widget, validate it
  if (eventType) {
    const config = getState('configs').find(
      c => c.values['Event Type'] === eventType,
    );
    if (!config) {
      // Add error if eventType doesn't exist
      updateState('update', 'errors', errs => [
        ...errs,
        'The provided event type could not be found.',
      ]);
    } else {
      // Set type and durationMultiplier into state if eventType exists
      updateState('set', 'type', config.values['Event Type']);
    }
  }
};

const getWidgetData = ({
  getState,
  updateState,
  eventType,
  eventDate,
  loadSchedulerDetails,
  calculateTimeslots,
  updateTest,
}) => () => {
  const {
    loading,
    errors,
    type,
    date,
    time,
    configs,
    availability,
    overrides,
    events,
  } = getState();

  const data = { loading, errors };

  if (loading || errors.length) {
    return data;
  }

  // Type data
  if (eventType) {
    data.showTypeSelect = false;
  } else {
    data.showTypeSelect = true;
    data.type = type;
    data.onTypeChange = e => {
      updateState('set', 'type', e.target.value);
    };
    data.typeOptions = configs.map((c, i) => (
      <option value={c.values['Event Type']} key={c.values['Event Type']}>
        {c.values['Event Type']}
      </option>
    ));
  }

  // Date data
  data.date = date;
  data.onDateChange = e => {
    console.log('dtae change 1');
    updateState('set', 'loading', true);
    if (
      !moment(e.target.value).isValid() ||
      moment().diff(moment(e.target.value), 'days') > 0
    ) {
      console.log('dtae change 2');
      updateState('set', 'date', moment().format(DATE_FORMAT));
    } else {
      console.log('dtae change 2');
      updateState('set', 'date', e.target.value);
    }
    console.log('dtae change 3');
    updateTest(actions.test('hello world'));
    // loadSchedulerDetails(true);
    updateTest(actions.test2('goodbye world'));
  };

  // Time data
  data.time = time;
  data.onTimeChange = e => {
    updateState('set', 'time', e.target.value);
  };
  data.timeOptions = [];

  console.log('!!', calculateTimeslots(date));

  return data;
};

const calculateTimeslots = ({ getState }) => date => {
  const {
    scheduler: {
      values: { 'Time Interval': timeInterval },
    },
    availability,
    overrides,
    events,
  } = getState();
  const interval = parseInt(timeInterval, 10);
  const timeslots = new Array(Math.floor(1440 / interval)).fill(0);
  const currentOverrides = overrides.filter(o => o.values['Date'] === date);
  if (currentOverrides.size > 0) {
    currentOverrides.forEach(o => {
      const startTime = moment(
        `${date}T${o.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const endTime = moment(
        `${date}T${o.values['End Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const startIndex = Math.floor(
        (startTime.hour() * 60 + startTime.minute()) / interval,
      );
      const endIndex = Math.floor(
        (endTime.hour() * 60 + endTime.minute()) / interval,
      );
      console.log(
        'process overrides',
        startTime,
        endTime,
        startIndex,
        endIndex,
      );
      for (var i = startIndex; i < endIndex; i++) {
        timeslots[i] += parseInt(o.values['Slots'], 10);
      }
    });
  } else {
    const currentAvailability = availability.filter(
      a => a.values['Day'] === moment(date, DATE_FORMAT).day(),
    );
    currentAvailability.forEach(a => {
      const startTime = moment(
        `${date}T${a.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const endTime = moment(
        `${date}T${a.values['End Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const startIndex = Math.floor(
        (startTime.hour() * 60 + startTime.minute()) / interval,
      );
      const endIndex = Math.floor(
        (endTime.hour() * 60 + endTime.minute()) / interval,
      );
      for (var i = startIndex; i < endIndex; i++) {
        timeslots[i] += parseInt(a.values['Slots'], 10);
      }
    });
  }

  return timeslots;
};

const getState = ({ stateData }) => key => {
  return key ? stateData[key] : stateData;
};

export const SchedulerWidget = compose(
  withReducer(
    'test',
    'updateTest',
    (state, { type, payload }) => {
      console.log('test reducer', type, payload);
      switch (type) {
        case types.TEST:
          return state.set('test', payload);
        default:
          return state;
      }
    },
    Data(),
  ),
  withStateHandlers(
    {
      stateData: Data(),
    },
    {
      updateState: ({ stateData }) => (method, ...params) => {
        console.log('updateState', method, params);
        return {
          stateData: stateData[method].call(stateData, ...params),
        };
      },
    },
  ),
  withHandlers({ getState }),
  withHandlers({ processSchedulerDetails }),
  withHandlers({ loadSchedulerDetails, validateProps }),
  withHandlers({
    calculateTimeslots,
  }),
  withHandlers({ initSchedulerData, getWidgetData }),
  lifecycle({
    componentDidMount() {
      if (!this.props.schedulerId) {
        throw new Error(
          'SchedulerWidget failed, schedulerId is a required prop.',
        );
      }
      console.log('mount', this.props.stateData.toJS());
      this.props.initSchedulerData();
    },
    componentDidUpdate(previousProps) {
      console.log('update', this.props.stateData.toJS());
      // if (
      //   this.props.data.scheduler && this.props.data.date
      //   && (this.props.data.scheduler !== previousProps.data.schedulers
      //     || this.props.data.date !== previousProps.data.date)
      // ) {
      //   console.log('get availability');
      //   this.props.fetchSchedule();
      // }
    },
  }),
)(SchedulerWidgetComponent);
