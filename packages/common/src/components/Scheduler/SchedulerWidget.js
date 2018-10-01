import React from 'react';
import {
  compose,
  lifecycle,
  withHandlers,
  withProps,
  withReducer,
} from 'recompose';
import moment from 'moment';
import { LoadingMessage, ErrorMessage } from './Schedulers';
import {
  DATE_FORMAT,
  DATE_DISPLAY_FORMAT,
  TIME_FORMAT,
  TIME_DISPLAY_FORMAT,
  actions,
  State,
  reducer,
  fetchSchedulerBySchedulerId,
  fetchSchedulerConfigsBySchedulerId,
  fetchSchedulerAvailabilityBySchedulerId,
  fetchSchedulerOverridesBySchedulerIdAndDate,
  fetchScheduledEventsBySchedulerIdAndDate,
  fetchScheduledEventById,
} from '../../helpers/schedulerWidget';

const SchedulerWidgetComponent = ({
  showSchedulerSelector,
  showTypeSelector,
  stateData: {
    loading,
    loadingData,
    errors,
    type,
    date,
    time,
    durationMultiplier,
    typeOptions = [],
    scheduler: {
      values: { 'Time Interval': timeInterval },
    },
    configs,
    timeslots,
    scheduling,
    event,
    eventToChange,
  },
  handleTypeChange,
  handleDateChange,
  handleTimeChange,
  handleScheduleChange,
}) => {
  const interval = parseInt(timeInterval, 10);
  const dateTimeslots = timeslots[date] || [];
  const timeOptions =
    durationMultiplier > 0
      ? dateTimeslots
          .map((slots, index) => {
            if (!slots) {
              return false;
            }
            if (
              dateTimeslots
                .slice(index, index + durationMultiplier)
                .filter(s => s).length === durationMultiplier
            ) {
              const currentMinutes = index * interval;
              const availableTimeStart = moment
                .utc(date, DATE_FORMAT)
                .hour(Math.floor(currentMinutes / 60))
                .minute(Math.floor(currentMinutes % 60));
              const availableTimeEnd = moment
                .utc(availableTimeStart)
                .add(interval * durationMultiplier, 'minute');
              return (
                <option
                  value={availableTimeStart.format(TIME_FORMAT)}
                  key={`time-interval-${index}`}
                >
                  {`
              ${availableTimeStart.format(TIME_DISPLAY_FORMAT)}
              ${' - '}
              ${availableTimeEnd.format(TIME_DISPLAY_FORMAT)}
            `}
                </option>
              );
            } else {
              return false;
            }
          })
          .filter(o => o)
      : [];
  return (
    <div className="scheduler-widget">
      {loading && <LoadingMessage />}
      {!loading &&
        errors.size > 0 && (
          <ErrorMessage
            heading="The Scheduling Component Failed to Load"
            text={
              <ul>{errors.map((e, i) => <li key={`error-${i}`}>{e}</li>)}</ul>
            }
          />
        )}
      {!loading &&
        errors.size === 0 &&
        (event ? (
          <div>
            <span>You have scheduled an event of type </span>
            <strong>{event.values['Event Type']}</strong>
            <span> for </span>
            <strong>{event.values['Duration']}</strong>
            <span> minutes on </span>
            <strong>
              {moment
                .utc(event.values['Date'], DATE_FORMAT)
                .format(DATE_DISPLAY_FORMAT)}
            </strong>
            <span> at </span>
            <strong>
              {moment
                .utc(event.values['Time'], TIME_FORMAT)
                .format(TIME_DISPLAY_FORMAT)}
            </strong>
            <span>. </span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleScheduleChange(true)}
            >
              <em>Change</em>
            </button>
          </div>
        ) : (
          <form>
            {eventToChange && (
              <div>
                <span>You are changing your scheduled event of type </span>
                <strong>{eventToChange.values['Event Type']}</strong>
                <span> for </span>
                <strong>{eventToChange.values['Duration']}</strong>
                <span> minutes on </span>
                <strong>
                  {moment
                    .utc(eventToChange.values['Date'], DATE_FORMAT)
                    .format(DATE_DISPLAY_FORMAT)}
                </strong>
                <span> at </span>
                <strong>
                  {moment
                    .utc(eventToChange.values['Time'], TIME_FORMAT)
                    .format(TIME_DISPLAY_FORMAT)}
                </strong>
                <span>. </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleScheduleChange(false)}
                >
                  <em>Cancel Change</em>
                </button>
              </div>
            )}
            {showTypeSelector && (
              <div className="form-group required">
                <label htmlFor="type-select" className="field-label">
                  Type
                </label>
                <select
                  name="type-select"
                  id="type-select"
                  value={type}
                  onChange={handleTypeChange}
                  disabled={scheduling}
                >
                  <option />
                  {configs.map((c, i) => {
                    const duration =
                      interval * parseInt(c.values['Duration Multiplier'], 10);
                    return (
                      <option
                        value={c.values['Event Type']}
                        key={c.values['Event Type']}
                      >
                        {`${c.values['Event Type']} (${duration} minutes)`}
                      </option>
                    );
                  })}
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
                onChange={handleDateChange}
                disabled={scheduling}
              />
            </div>
            {!loadingData &&
              type &&
              date && (
                <div className="form-group required">
                  <label htmlFor="time-input" className="field-label">
                    Time
                  </label>
                  <select
                    name="time-select"
                    id="time-select"
                    value={time}
                    onChange={handleTimeChange}
                    disabled={scheduling}
                  >
                    <option />
                    {timeOptions}
                  </select>
                </div>
              )}
          </form>
        ))}
    </div>
  );
};

const fetchSchedulerDetails = ({
  dispatch,
  eventType,
  stateData: { schedulerId, scheduledEventId },
  setResultToState,
  setScheduler,
  setScheduledEvent,
  setSchedulerConfigs,
  setSchedulerAvailability,
}) => () => {
  dispatch(actions.setLoading(true));
  Promise.all([
    scheduledEventId && fetchScheduledEventById(scheduledEventId),
    fetchSchedulerBySchedulerId(schedulerId),
    fetchSchedulerConfigsBySchedulerId(schedulerId),
    fetchSchedulerAvailabilityBySchedulerId(schedulerId),
  ]).then(([event, scheduler, configs, availability]) => {
    event && setResultToState(event, setScheduledEvent);
    setResultToState(scheduler, setScheduler);
    setResultToState(configs, setSchedulerConfigs);
    setResultToState(availability, setSchedulerAvailability);
    dispatch(actions.setLoading(false));
  });
};

const fetchSchedulerData = ({
  dispatch,
  stateData: {
    scheduler: {
      values: { Id: schedulerId },
    },
    date,
  },
  setResultToState,
  setSchedulerOverrides,
  setScheduledEvents,
  calculateAvailableTimeslots,
}) => () => {
  dispatch(actions.setLoadingData(true));
  Promise.all([
    fetchSchedulerOverridesBySchedulerIdAndDate(schedulerId, date),
    fetchScheduledEventsBySchedulerIdAndDate(schedulerId, date),
  ]).then(([overrides, events]) => {
    setResultToState(overrides, setSchedulerOverrides);
    setResultToState(events, setScheduledEvents);
    calculateAvailableTimeslots();
    // dispatch(actions.setLoadingData(false));
  });
};

const setResultToState = ({ dispatch }) => (result, set) => {
  const { serverError, errors } = result;
  if (serverError) {
    dispatch(actions.addErrors([serverError.error || serverError.statusText]));
  } else if (errors) {
    dispatch(actions.addErrors(errors));
  } else {
    set(result);
  }
};

const setScheduler = ({ dispatch }) => ({ submissions }) => {
  if (submissions.length !== 1) {
    dispatch(actions.addErrors(['Scheduler could not be found.']));
  } else {
    dispatch(actions.setScheduler(submissions[0]));
  }
};

const setScheduledEvent = ({ dispatch }) => ({ submission }) => {
  dispatch(actions.setEvent(submission));
};

const setSchedulerConfigs = ({ dispatch, stateData: { type } }) => ({
  submissions,
}) => {
  if (submissions.length === 0) {
    dispatch(actions.addErrors(['Event types could not be found.']));
  } else {
    dispatch(actions.setConfigs(submissions));
    // Verify that type is valid if selected
    if (type) {
      const config = submissions.find(c => c.values['Event Type'] === type);
      if (!config) {
        dispatch(
          actions.addErrors(['The provided event type could not be found.']),
        );
      } else {
        dispatch(
          actions.setDurationMultiplier(config.values['Duration Multiplier']),
        );
      }
    }
  }
};

const setSchedulerAvailability = ({ dispatch }) => ({ submissions }) => {
  dispatch(actions.setAvailability(submissions));
};

const setSchedulerOverrides = ({ dispatch }) => ({ submissions }) => {
  dispatch(actions.setOverrides(submissions));
};

const setScheduledEvents = ({
  dispatch,
  stateData: {
    scheduler: {
      values: { 'Reservation Timeout': timeout },
    },
  },
}) => ({ submissions }) => {
  dispatch(
    actions.setEvents(
      submissions.filter(
        event =>
          event.coreState === 'Submitted' ||
          (event.coreState === 'Draft' &&
            timeout &&
            moment.utc().diff(moment.utc(event.updatedAt), 'minutes') <
              timeout),
      ),
    ),
  );
};

const handleTypeChange = ({ dispatch, stateData: { configs } }) => e => {
  const config = configs.find(c => c.values['Event Type'] === e.target.value);
  if (!e.target.value || !!config) {
    dispatch(actions.setType(e.target.value));
    dispatch(actions.setTime(''));
    !!config &&
      dispatch(
        actions.setDurationMultiplier(config.values['Duration Multiplier']),
      );
  }
};

const handleDateChange = ({ dispatch }) => e => {
  if (
    !moment.utc(e.target.value, DATE_FORMAT).isValid() ||
    moment.utc().diff(moment.utc(e.target.value), 'days') > 0
  ) {
    dispatch(actions.setDate(moment.utc().format(DATE_FORMAT)));
    dispatch(actions.setTime(''));
  } else {
    dispatch(actions.setDate(e.target.value));
    dispatch(actions.setTime(''));
  }
};

const handleTimeChange = ({ dispatch }) => e => {
  if (moment.utc(e.target.value, TIME_FORMAT).isValid()) {
    dispatch(actions.setScheduling(true));
    dispatch(actions.setTime(e.target.value));
  }
};

const handleScheduleChange = ({ dispatch }) => change => {
  dispatch(actions.changeScheduledEvent(change));
};

const scheduleEvent = ({
  dispatch,
  stateData: {
    schedulerId,
    type,
    date,
    time,
    durationMultiplier,
    scheduler: {
      values: { 'Time Interval': timeInterval },
    },
    availability,
    overrides,
    timeslots,
    event,
    eventToChange,
  },
  calculateTotalTimeslots,
}) => () => {
  /*
    1. If eventToChange is Draft, update it
       If eventToChange is Submitted, create new Draft and reference previous event? * NOT ALLOWED FOR NOW
       Else create new event submission in Draft
    2. Fetch scheduledEvents for timeslot to verify success and guarantee slot
       If timeslot is invalid, delete submission and show error

    ?? Check if reschedule is same as scheduled event?
  */
  const interval = parseInt(timeInterval, 10);
  const timeMoment = moment.utc(time, TIME_FORMAT);
  const timeInMinutes = timeMoment.hour() * 60 + timeMoment.minute();
  const timeIndex = Math.floor(timeInMinutes / interval);
  const timeslots = calculateTotalTimeslots();
  const values = {
    'Scheduler Id': schedulerId,
    'Event Type': type,
    Date: date,
    Time: time,
    Duration: durationMultiplier * interval,
    // 'Rescheduled Id': eventToChange
    //   ? (eventToChange.coreState === "Submitted"
    //     ? eventToChange.id
    //     : eventToChange.values['Rescheduled Id'])
    //   : '',
  };

  // TODO complete this
};

const calculateAvailableTimeslots = ({
  dispatch,
  stateData: {
    date,
    scheduler: {
      values: { 'Time Interval': timeInterval },
    },
    availability,
    overrides,
    events,
  },
  calculateTotalTimeslots,
}) => () => {
  const interval = parseInt(timeInterval, 10);
  const timeslots = calculateTotalTimeslots();
  const currentEvents = events.filter(e => e.values['Date'] === date);
  currentEvents.forEach(e => {
    const startTime = moment.utc(
      `${e.values['Date']}T${e.values['Time']}`,
      `${DATE_FORMAT}T${TIME_FORMAT}`,
    );
    const endTime = moment
      .utc(startTime)
      .add(parseInt(e.values['Duration'], 10), 'minute');
    const startIndex = Math.floor(
      (startTime.hour() * 60 + startTime.minute()) / interval,
    );
    const endIndex = Math.floor(
      (endTime.hour() * 60 + endTime.minute()) / interval,
    );
    for (var i = startIndex; i < endIndex; i++) {
      timeslots[i] = Math.max(0, timeslots[i] - 1);
    }
  });

  dispatch(actions.addTimeslots({ [date]: timeslots }));
  dispatch(actions.setLoadingData(false));
};

const calculateTotalTimeslots = ({
  stateData: {
    date,
    scheduler: {
      values: { 'Time Interval': timeInterval },
    },
    availability,
    overrides,
  },
}) => () => {
  const interval = parseInt(timeInterval, 10);
  const timeslots = new Array(Math.floor(1440 / interval)).fill(0);
  const currentOverrides = overrides.filter(o => o.values['Date'] === date);
  if (currentOverrides.size > 0) {
    currentOverrides.forEach(o => {
      const startTime = moment.utc(
        `${date}T${o.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const endTime = moment.utc(
        `${date}T${o.values['End Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const startIndex = Math.floor(
        (startTime.hour() * 60 + startTime.minute()) / interval,
      );
      const endIndex = Math.floor(
        (endTime.hour() * 60 + endTime.minute()) / interval,
      );
      for (var i = startIndex; i < endIndex; i++) {
        timeslots[i] += parseInt(o.values['Slots'], 10);
      }
    });
  } else {
    const currentAvailability = availability.filter(
      a =>
        parseInt(a.values['Day'], 10) === moment.utc(date, DATE_FORMAT).day(),
    );
    currentAvailability.forEach(a => {
      const startTime = moment.utc(
        `${date}T${a.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
      );
      const endTime = moment.utc(
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

export const SchedulerWidget = compose(
  withProps(({ schedulerId, eventType }) => ({
    showSchedulerSelector: !schedulerId,
    showTypeSelector: !eventType,
  })),
  withReducer(
    'stateData',
    'dispatch',
    reducer,
    ({ schedulerId, scheduledEventId, eventType, eventDate }) =>
      State({
        scheduledEventId: scheduledEventId || '',
        schedulerId: schedulerId || '',
        type: eventType || '',
        date:
          eventDate && moment.utc(eventDate).isValid()
            ? eventDate
            : moment.utc().format(DATE_FORMAT),
      }),
  ),
  withHandlers({
    calculateTotalTimeslots,
  }),
  withHandlers({
    setScheduler,
    setScheduledEvent,
    setSchedulerConfigs,
    setSchedulerAvailability,
    setSchedulerOverrides,
    setScheduledEvents,
    scheduleEvent,
  }),
  withHandlers({
    setResultToState,
    handleTypeChange,
    handleDateChange,
    handleTimeChange,
    handleScheduleChange,
    calculateAvailableTimeslots,
  }),
  withHandlers({
    fetchSchedulerDetails,
    fetchSchedulerData,
  }),
  lifecycle({
    componentDidMount() {
      if (!this.props.schedulerId) {
        throw new Error(
          'SchedulerWidget failed, schedulerId is a required prop.',
        );
      }
      console.log('mount', this.props.stateData.toJS());
      this.props.fetchSchedulerDetails();
    },
    componentDidUpdate(previousProps) {
      console.log('update', this.props.stateData.toJS());
      const {
        scheduledEventId,
        schedulerId,
        eventType,
        stateData,
      } = this.props;
      const {
        scheduledEventId: prevScheduledEventId,
        schedulerId: prevSchedulerId,
        eventType: prevEventType,
        stateData: prevStateData,
      } = previousProps;

      // If scheduledEventId, schedulerId, or eventType props change, update state
      if (
        scheduledEventId !== prevScheduledEventId ||
        schedulerId !== prevSchedulerId ||
        eventType !== prevEventType
      ) {
        this.props.dispatch(
          actions.setState({
            scheduledEventId,
            schedulerId,
            type: this.props.eventType,
          }),
        );
      }

      // If state changed, fire appropriate functions
      if (stateData !== prevStateData) {
        console.log('STATE CHANGED');

        if (!stateData.event) {
          if (
            prevStateData.event ||
            stateData.scheduler !== prevStateData.scheduler ||
            stateData.date !== prevStateData.date
          ) {
            this.props.fetchSchedulerData();
          }
        }
      }
    },
  }),
)(SchedulerWidgetComponent);
