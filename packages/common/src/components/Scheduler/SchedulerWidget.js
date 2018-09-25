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
import { LoadingMessage, ErrorMessage } from './Schedulers';
import {
  DATE_FORMAT,
  TIME_FORMAT,
  actions,
  State,
  reducer,
  fetchSchedulerBySchedulerId,
  fetchSchedulerConfigsBySchedulerId,
  fetchSchedulerAvailabilityBySchedulerId,
  fetchSchedulerOverridesBySchedulerIdAndDate,
  fetchScheduledEventsBySchedulerIdAndDate,
  fetchScheduledEventById,
} from '../../redux/modules/schedulerWidget';

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

const initSchedulerData = ({
  // stateData,
  dispatch,
  schedulerId,
  scheduledEventId,
  eventDate,
  // loadSchedulerDetails,
  // validateProps,
}) => () => {
  dispatch(actions.setLoading(true));
  // If eventDate is provided to the widget, validate it
  if (eventDate && moment(eventDate).isValid()) {
    dispatch(actions.setDate(eventDate));
  } else {
    dispatch(actions.setDate(moment().format(DATE_FORMAT)));
  }
  Promise.all([
    fetchSchedulerBySchedulerId(schedulerId),
    scheduledEventId && fetchScheduledEventById(scheduledEventId),
  ]).then(([scheduler, event]) => {
    // Process scheduler results
    if (scheduler.serverError) {
      const errorMessage =
        scheduler.serverError.error || scheduler.serverError.statusText;
      dispatch(actions.setErrors([errorMessage]));
    } else if (scheduler.errors) {
      dispatch(actions.setErrors(scheduler.errors));
    } else if (scheduler.submissions.length !== 1) {
      const errorMessage = 'Scheduler could not be found.';
      dispatch(actions.setErrors([errorMessage]));
    } else {
      dispatch(actions.setScheduler(scheduler.submissions[0]));
    }
    // Process event results if scheduledEventId was provided
    if (event) {
      if (event.serverError) {
        const errorMessage =
          event.serverError.error || event.serverError.statusText;
        dispatch(actions.setErrors([errorMessage]));
      } else if (event.errors) {
        dispatch(actions.setErrors(event.errors));
      } else {
        dispatch(actions.setEvent(event.submission));
      }
    }
    dispatch(actions.fetch(), ({ event, errors }) => {
      console.log('dispatch callback', !event && errors.size === 0);
      // TODO need to upgrade recompose since callback isn't supported in current version
      if (!event && errors.size === 0) {
        console.log('validate props and fetch scheduler details');
        // loadSchedulerDetails();
        // validateProps();
      } else {
        dispatch(actions.setLoading(false));
      }
    });
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
  stateData: {
    loading,
    errors,
    type,
    date,
    time,
    configs,
    availability,
    overrides,
    events,
  },
  eventType,
  eventDate,
  loadSchedulerDetails,
  calculateTimeslots,
}) => () => {
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
      // updateState('set', 'type', e.target.value)
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
    console.log('date change 1');
    // updateState('set', 'loading', true);
    // if (!moment(e.target.value).isValid()
    //     || moment().diff(moment(e.target.value), 'days') > 0) {
    //   console.log('dtae change 2');
    //   updateState('set', 'date', moment().format(DATE_FORMAT));
    // } else {
    //   console.log('dtae change 2');
    //   updateState('set', 'date', e.target.value);
    // }
    // console.log('dtae change 3');
    // updateTest(actions.test('hello world'));
    // // loadSchedulerDetails(true);
    // updateTest(actions.test2('goodbye world'));
  };

  // Time data
  data.time = time;
  data.onTimeChange = e => {
    // updateState('set', 'time', e.target.value);
  };
  data.timeOptions = [];

  // console.log('!!', calculateTimeslots(date));

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
  withReducer('stateData', 'dispatch', reducer, State()),
  // withStateHandlers({
  //   stateData: null,
  // }, {
  //   updateState: ({ stateData }) => (method, ...params) => {
  //     console.log('updateState', method, params);
  //     return ({
  //       stateData: stateData[method].call(stateData, ...params),
  //     })
  //   },
  // }),
  // withHandlers({ getState }),
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
