import React from 'react';
import {
  compose,
  lifecycle,
  withHandlers,
  withReducer,
  withState,
} from 'recompose';
import moment from 'moment';
import { Alert, Modal, ModalBody, ModalFooter } from 'reactstrap';
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
  createScheduledEvent,
  updateScheduledEvent,
  submitScheduledEvent,
  deleteScheduledEvent,
} from '../../helpers/schedulerWidget';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerSingleDateController } from 'react-dates';

/**
 * TODO
 * Create rescheduling functionality.
 */
const Timer = compose(
  withState('time', 'setTime', 0),
  withState('timer', 'setTimer', null),
  withHandlers({
    tick: ({
      time,
      setTime,
      timer,
      timeoutCallback,
      handleEventDelete,
    }) => () => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        console.log('RESERVATION TIMEOUT');
        clearInterval(timer);
        handleEventDelete();
        if (typeof timeoutCallback === 'function') {
          timeoutCallback();
        }
      }
    },
  }),
  withHandlers({
    init: ({
      event,
      isScheduled,
      timeout,
      setTime,
      timer,
      setTimer,
      tick,
    }) => () => {
      clearInterval(timer);
      const timeRemaining = isScheduled
        ? -1
        : Math.round(timeout * 60) -
          moment.utc().diff(moment.utc(event.updatedAt), 'seconds');
      if (timeRemaining > 0) {
        setTime(timeRemaining);
        setTimer(setInterval(tick, 1000));
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.init();
    },
    componentDidUpdate(prevProps) {
      if (this.props.event !== prevProps.event) {
        this.props.init();
      }
    },
    componentWillUnmount() {
      clearInterval(this.props.timer);
    },
  }),
)(
  ({ isScheduled, time, handleEventDelete }) =>
    !isScheduled ? (
      <div className={time === 0 ? 'text-danger' : ''}>
        <span>You have </span>
        <strong>
          {Math.floor(time / 60)}:{time % 60 < 10 ? 0 : ''}
          {time % 60}
        </strong>
        <span>
          {' '}
          remaining to complete your request to guarantee your time slot.{' '}
        </span>
        {time > 0 && (
          <em>
            <button onClick={handleEventDelete} className="btn btn-text">
              Cancel Reservation
            </button>
          </em>
        )}
      </div>
    ) : null,
);

const SchedulerWidgetComponent = ({
  showTypeSelector = false,
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
      values: {
        'Time Interval': timeInterval,
        'Reservation Timeout': reservationTimeout,
        Timezone: timezone = moment.tz.guess(),
      },
    },
    minAvailableDate,
    maxAvailableDate,
    configs,
    timeslots,
    scheduling,
    schedulingErrors,
    event,
  },
  handleTypeChange,
  handleDateChange,
  handleTimeChange,
  handleScheduleChange,
  handleEventDelete,
  openModal,
  toggleModal,
  openCalendar,
  setOpenCalendar,
  expired,
  setExpired,
  scheduleEvent,
}) => {
  const interval = parseInt(timeInterval, 10);
  const timeout = parseInt(reservationTimeout, 10);
  const now = moment.tz(timezone);
  const minIndex =
    now.format(DATE_FORMAT) === date
      ? Math.ceil((now.hours() * 60 + now.minutes()) / interval)
      : 0;
  const dateTimeslots = timeslots[date] || [];

  // Calculate available time options for the selected date
  const timeOptions =
    durationMultiplier > 0
      ? dateTimeslots
          .map((slots, index) => {
            if (index < minIndex || slots <= 0) {
              return false;
            }
            if (
              dateTimeslots
                .slice(index, index + durationMultiplier)
                .filter(s => s > 0).length === durationMultiplier
            ) {
              const currentMinutes = index * interval;
              const availableTimeStart = moment
                .utc(date, DATE_FORMAT)
                .hour(Math.floor(currentMinutes / 60))
                .minute(Math.floor(currentMinutes % 60));
              const availableTimeEnd = moment
                .utc(availableTimeStart)
                .add(interval * durationMultiplier, 'minute');
              const isSelected =
                availableTimeStart.format(TIME_FORMAT) === time;
              return (
                <button
                  key={availableTimeStart.format(TIME_FORMAT)}
                  className={`time-box btn ${
                    isSelected ? 'btn-primary' : 'btn-light'
                  }`}
                  onClick={
                    isSelected
                      ? undefined
                      : () =>
                          handleTimeChange({
                            target: {
                              value: availableTimeStart.format(TIME_FORMAT),
                            },
                          })
                  }
                >
                  {`
                    ${availableTimeStart.format(TIME_DISPLAY_FORMAT)}
                    ${' - '}
                    ${availableTimeEnd.format(TIME_DISPLAY_FORMAT)}
                  `}
                </button>
              );
            } else {
              return false;
            }
          })
          .filter(o => o)
      : [];

  // Calculate date options with respect to min/max dates
  const selectedDate = moment.tz(date, DATE_FORMAT, timezone);
  // How many days before the selected date are available
  const availableBefore = selectedDate.diff(minAvailableDate, 'days');
  // How many days after the selected date are available
  const availableAfter = maxAvailableDate
    ? maxAvailableDate.diff(selectedDate, 'days')
    : 10; // Default to 10 which is more than needed since we only show a max of 5

  // If at least 2 days available in each direction, show 5 with selected date in the middle
  const dateOptions = (availableBefore > 1 && availableAfter > 1
    ? Array(5).fill(selectedDate.add(-2, 'days'))
    : // If fewer than 5 total days around selected date vailable, show them all
      availableBefore + availableAfter < 5
      ? Array(availableBefore + availableAfter + 1).fill(
          selectedDate.add(-availableBefore, 'days'),
        )
      : // Otherwise show range with one endpoint, so date won't be in the middle
        availableBefore < 2
        ? Array(5).fill(selectedDate.add(-availableBefore, 'days'))
        : Array(5).fill(selectedDate.add(-(4 - availableAfter), 'days'))
  ).map((d, i) => d.clone().add(i, 'days'));

  const isScheduled = event && event.coreState !== 'Draft';
  const isReserved = event && event.coreState === 'Draft';
  const dateTimeValue = event
    ? `${moment
        .tz(event.values['Date'], DATE_FORMAT, timezone)
        .format(DATE_DISPLAY_FORMAT)} at ${moment
        .tz(event.values['Time'], TIME_FORMAT, timezone)
        .format(TIME_DISPLAY_FORMAT)} for ${event.values['Duration']} minutes`
    : '';

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
      {!openModal &&
        schedulingErrors.size > 0 && (
          <div className="alert alert-danger">
            {schedulingErrors.map((e, i) => <div key={`error-${i}`}>{e}</div>)}
          </div>
        )}
      {!loading &&
        errors.size === 0 && (
          <div>
            {showTypeSelector && (
              <div className="form-group required">
                <label htmlFor="type-select" className="field-label">
                  Event Type
                </label>
                <select
                  name="type-select"
                  id="type-select"
                  value={type}
                  className="form-control"
                  onChange={handleTypeChange}
                  disabled={scheduling || isScheduled}
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
            {type && (
              <div className="form-group required">
                {expired && (
                  <Alert color="danger" toggle={() => setExpired(false)}>
                    Your selected time has expired.
                  </Alert>
                )}
                <label className="field-label">Date and Time</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    readOnly
                    placeholder="You have not selected a date and time yet"
                    value={dateTimeValue}
                  />
                  {!isScheduled && (
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          toggleModal(true);
                          setExpired(false);
                        }}
                      >
                        {isReserved ? 'Change' : 'Select'} Date and Time
                      </button>
                    </div>
                  )}
                </div>
                {isReserved && (
                  <Timer
                    event={event}
                    isScheduled={isScheduled}
                    timeout={timeout}
                    timeoutCallback={() => setExpired(true)}
                    handleEventDelete={handleEventDelete}
                  />
                )}
              </div>
            )}
          </div>
        )}
      {openModal && (
        <Modal
          isOpen={!!openModal}
          toggle={() => toggleModal(false)}
          size="sm"
          className="scheduler-widget-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => toggleModal(false)}
              >
                Cancel
              </button>
              <span>Schedule</span>
              {now.format(DATE_FORMAT) !== date &&
                !now.isBefore(minAvailableDate) && (
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      handleDateChange({
                        target: { value: now.format(DATE_FORMAT) },
                      });
                      setOpenCalendar(false);
                    }}
                  >
                    Today
                  </button>
                )}
            </h4>
          </div>
          <ModalBody>
            <div className="body-content">
              <div className="date-slider">
                <div
                  className="calendar-box"
                  onClick={() => setOpenCalendar(!openCalendar)}
                >
                  <span
                    className={`fa ${
                      openCalendar
                        ? 'fa-calendar-times-o text-danger'
                        : 'fa-calendar'
                    }`}
                  />
                </div>
                {dateOptions.map(dateVal => {
                  const isSelected = dateVal.format(DATE_FORMAT) === date;
                  return (
                    <div
                      key={dateVal.format(DATE_FORMAT)}
                      className={`date-box ${isSelected ? 'selected' : ''}`}
                      onClick={
                        isSelected
                          ? () => setOpenCalendar(!openCalendar)
                          : () => {
                              handleDateChange({
                                target: {
                                  value: dateVal.format(DATE_FORMAT),
                                },
                              });
                              setOpenCalendar(false);
                            }
                      }
                    >
                      <div className="date-month-year">
                        {dateVal.format('MMM YYYY')}
                      </div>
                      <div className="date-day-number">
                        {dateVal.format('DD')}
                      </div>
                      <div className="date-day-name">
                        {dateVal.format('ddd')}
                      </div>
                    </div>
                  );
                })}
              </div>
              {openCalendar ? (
                <div className="date-picker">
                  <DayPickerSingleDateController
                    date={moment(date, DATE_FORMAT)}
                    onDateChange={selectedDate => {
                      handleDateChange({
                        target: { value: selectedDate.format(DATE_FORMAT) },
                      });
                      setOpenCalendar(false);
                    }}
                    isOutsideRange={d =>
                      d.startOf('day').isBefore(minAvailableDate) ||
                      d.startOf('day').isAfter(maxAvailableDate)
                    }
                    numberOfMonths={1}
                    daySize={36}
                    enableOutsideDays={true}
                    hideKeyboardShortcutsPanel={true}
                    noBorder={true}
                    focused={true}
                  />
                </div>
              ) : (
                <div className="time-picker">
                  {schedulingErrors.size > 0 && (
                    <div className="alert alert-danger">
                      {schedulingErrors.map((e, i) => (
                        <div key={`error-${i}`}>{e}</div>
                      ))}
                    </div>
                  )}
                  {loadingData && (
                    <div className="text-center">
                      <span className="fa fa-spinner fa-spin fa-lg" />
                    </div>
                  )}
                  {!loadingData &&
                    timeOptions.length === 0 && (
                      <div className="text-center text-muted">
                        <strong>
                          There are no available time slots for the selected
                          date.
                        </strong>
                      </div>
                    )}
                  {!loadingData && timeOptions.length > 0 && timeOptions}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              disabled={scheduling || !date || !time}
              onClick={scheduleEvent}
            >
              Reserve Time
            </button>
          </ModalFooter>
        </Modal>
      )}
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
}) => callback => {
  dispatch(actions.setLoadingData(true));
  Promise.all([
    fetchSchedulerOverridesBySchedulerIdAndDate(schedulerId, date),
    fetchScheduledEventsBySchedulerIdAndDate(schedulerId, date),
  ]).then(([overrides, events]) => {
    setResultToState(overrides, setSchedulerOverrides);
    setResultToState(events, setScheduledEvents);
    calculateAvailableTimeslots();
    if (typeof callback === 'function') {
      callback();
    }
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

const setScheduler = ({ dispatch, stateData: { date } }) => ({
  submissions,
}) => {
  if (submissions.length !== 1) {
    dispatch(actions.addErrors(['Scheduler could not be found.']));
  } else {
    const {
      values: {
        Timezone: timezone = moment.tz.guess(),
        'Scheduling Window': schedulingWindow,
        'Scheduling Range Start Date': schedulingStartDate,
        'Scheduling Range End Date': schedulingEndDate,
      },
    } = submissions[0];
    const today = moment.tz(timezone).startOf('day');
    const minDate = schedulingStartDate
      ? moment.tz(schedulingStartDate, DATE_FORMAT, timezone)
      : null;
    const maxDate = schedulingEndDate
      ? moment.tz(schedulingEndDate, DATE_FORMAT, timezone)
      : null;
    const maxWindowDate = parseInt(schedulingWindow, 10)
      ? today.clone().add(parseInt(schedulingWindow, 10), 'day')
      : null;
    const minAvailableDate =
      minDate && minDate.isAfter(today) ? minDate : today;
    const maxAvailableDate =
      maxDate && maxWindowDate
        ? maxDate.isBefore(maxWindowDate)
          ? maxDate
          : maxWindowDate
        : maxDate || maxWindowDate;

    const selectedDate = moment.tz(date, DATE_FORMAT, timezone);
    if (selectedDate.isBefore(minAvailableDate)) {
      dispatch(actions.setDate(minAvailableDate.format(DATE_FORMAT)));
      dispatch(actions.setTime(''));
    } else if (maxAvailableDate && selectedDate.isAfter(maxAvailableDate)) {
      dispatch(actions.setDate(maxAvailableDate.format(DATE_FORMAT)));
      dispatch(actions.setTime(''));
    }
    dispatch(actions.setState({ minAvailableDate, maxAvailableDate }));
    dispatch(actions.setScheduler(submissions[0]));
  }
};

const setScheduledEvent = ({ dispatch }) => ({ submission }) => {
  dispatch(
    actions.setState({
      event: submission,
      schedulerId: submission.values['Scheduler Id'],
      type: submission.values['Event Type'],
    }),
  );
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
          event.coreState !== 'Draft' ||
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
    dispatch(
      actions.setState({
        type: e.target.value,
        time: '',
        durationMultiplier: config.values['Duration Multiplier'] || 1,
      }),
    );
  }
};

const handleDateChange = ({
  dispatch,
  stateData: {
    minAvailableDate,
    maxAvailableDate,
    scheduler: {
      values: { Timezone: timezone = moment.tz.guess() },
    },
  },
}) => e => {
  const selectedDate = moment.tz(e.target.value, DATE_FORMAT, timezone);
  if (!selectedDate.isValid() || selectedDate.isBefore(minAvailableDate)) {
    dispatch(actions.setDate(minAvailableDate.format(DATE_FORMAT)));
    dispatch(actions.setTime(''));
  } else if (maxAvailableDate && selectedDate.isAfter(maxAvailableDate)) {
    dispatch(actions.setDate(maxAvailableDate.format(DATE_FORMAT)));
    dispatch(actions.setTime(''));
  } else {
    dispatch(actions.setDate(e.target.value));
    dispatch(actions.setTime(''));
  }
};

const handleTimeChange = ({ dispatch }) => e => {
  if (moment.utc(e.target.value, TIME_FORMAT).isValid()) {
    dispatch(actions.setTime(e.target.value));
  }
};

const handleScheduleChange = ({ dispatch }) => change => {
  dispatch(actions.editEvent(change));
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
  },
  fetchSchedulerData,
  verifyScheduledEvent,
  eventUpdated,
}) => () => {
  dispatch(actions.setScheduling(true));
  if (false) {
    // TODO validate values
    dispatch(actions.addSchedulingErrors(['Test errors']));
    return;
  }
  const interval = parseInt(timeInterval, 10);
  const values = {
    'Scheduler Id': schedulerId,
    'Event Type': type,
    Date: date,
    Time: time,
    Duration: durationMultiplier * interval,
  };

  if (event) {
    updateScheduledEvent(event.id, values).then(
      ({ submission, serverError, errors }) => {
        if (serverError) {
          dispatch(
            actions.addSchedulingErrors([
              serverError.error || serverError.statusText,
            ]),
          );
        } else if (errors) {
          dispatch(actions.addSchedulingErrors(errors));
        } else {
          dispatch(actions.setState({ event: submission }));
          fetchSchedulerData(verifyScheduledEvent);
        }
      },
    );
  } else {
    createScheduledEvent(values).then(({ submission, serverError, errors }) => {
      if (serverError) {
        dispatch(
          actions.addSchedulingErrors([
            serverError.error || serverError.statusText,
          ]),
        );
      } else if (errors) {
        dispatch(actions.addSchedulingErrors(errors));
      } else {
        dispatch(actions.setState({ event: submission }));
        fetchSchedulerData(verifyScheduledEvent);
      }
    });
  }
};

const verifyScheduledEvent = ({
  dispatch,
  stateData: {
    durationMultiplier,
    event,
    scheduler: {
      values: {
        'Time Interval': timeInterval,
        Timezone: timezone = moment.tz.guess(),
      },
    },
    events,
    timeslots,
  },
  toggleModal,
  eventUpdated,
}) => () => {
  const dateTimeslots = timeslots[event.values['Date']] || [];
  const interval = parseInt(timeInterval, 10);
  const timeMoment = moment.tz(event.values['Time'], TIME_FORMAT, timezone);
  const timeInMinutes = timeMoment.hour() * 60 + timeMoment.minute();
  const timeIndex = Math.floor(timeInMinutes / interval);
  const usedTimeslots = dateTimeslots.slice(
    timeIndex,
    timeIndex + durationMultiplier,
  );
  const isOverbooked =
    usedTimeslots.filter(s => s > 0).length < durationMultiplier;

  // Find events for each slot used if it's overbooked
  if (isOverbooked) {
    const currentEvents = events.filter(
      e => e.values['Date'] === event.values['Date'],
    );
    const isInvalid =
      usedTimeslots
        .map((used, index) => {
          if (used <= 0) {
            const overbookedBy = 1 - used;
            return (
              currentEvents
                .filter(e => {
                  const eventTime = moment.tz(
                    e.values['Time'],
                    TIME_FORMAT,
                    timezone,
                  );
                  const eventTimeInMinutes =
                    eventTime.hour() * 60 + eventTime.minute();
                  const eventTimeIndexStart = Math.floor(
                    eventTimeInMinutes / interval,
                  );
                  const eventTimeIndexEnd = Math.floor(
                    (eventTimeInMinutes + parseInt(e.values['Duration'], 10)) /
                      interval,
                  );
                  return (
                    eventTimeIndexStart <= timeIndex + index &&
                    eventTimeIndexEnd > timeIndex + index
                  );
                })
                .sort(
                  (a, b) =>
                    a.updatedAt < b.updatedAt
                      ? 1
                      : b.updatedAt < a.updatedAt
                        ? -1
                        : 0,
                )
                .slice(0, overbookedBy)
                .map(e => e.id === event.id)
                .filter(e => e).size > 0
            );
          } else {
            return false;
          }
        })
        .filter(s => s).length > 0;

    if (isInvalid) {
      deleteScheduledEvent(event.id).then(() => {
        dispatch(
          actions.setState({
            time: '',
            event: null,
          }),
        );
        dispatch(
          actions.addSchedulingErrors([
            'The selected timeslot is no longer available. Please select a different time.',
          ]),
        );
      });
    } else {
      dispatch(actions.setState({ scheduling: false }));
      if (typeof eventUpdated === 'function') {
        eventUpdated(event);
      }
      toggleModal(false);
    }
  } else {
    dispatch(actions.setState({ scheduling: false }));
    if (typeof eventUpdated === 'function') {
      eventUpdated(event);
    }
    toggleModal(false);
  }
};

const calculateAvailableTimeslots = ({
  dispatch,
  stateData: {
    date,
    scheduler: {
      values: {
        'Time Interval': timeInterval,
        Timezone: timezone = moment.tz.guess(),
      },
    },
    availability,
    overrides,
    events,
    event,
  },
  calculateTotalTimeslots,
}) => () => {
  const interval = parseInt(timeInterval, 10);
  const timeslots = calculateTotalTimeslots();
  const currentEventId = (event && event.id) || '';

  const currentEvents = events.filter(
    e => e.values['Date'] === date && e.id !== currentEventId,
  );
  currentEvents.forEach(e => {
    const startTime = moment.tz(
      `${e.values['Date']}T${e.values['Time']}`,
      `${DATE_FORMAT}T${TIME_FORMAT}`,
      timezone,
    );
    const endTime = startTime
      .clone()
      .add(parseInt(e.values['Duration'], 10), 'minute');
    const startIndex = Math.floor(
      (startTime.hour() * 60 + startTime.minute()) / interval,
    );
    const endIndex = Math.floor(
      (endTime.hour() * 60 + endTime.minute()) / interval,
    );
    for (var i = startIndex; i < endIndex; i++) {
      timeslots[i] = timeslots[i] - 1;
    }
  });

  dispatch(actions.addTimeslots({ [date]: timeslots }));
  dispatch(actions.setLoadingData(false));
};

const calculateTotalTimeslots = ({
  stateData: {
    date,
    scheduler: {
      values: {
        'Time Interval': timeInterval,
        Timezone: timezone = moment.tz.guess(),
      },
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
      const startTime = moment.tz(
        `${date}T${o.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
        timezone,
      );
      const endTime = moment.tz(
        `${date}T${o.values['End Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
        timezone,
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
        parseInt(a.values['Day'], 10) ===
        moment.tz(date, DATE_FORMAT, timezone).day(),
    );
    currentAvailability.forEach(a => {
      const startTime = moment.tz(
        `${date}T${a.values['Start Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
        timezone,
      );
      const endTime = moment.tz(
        `${date}T${a.values['End Time']}`,
        `${DATE_FORMAT}T${TIME_FORMAT}`,
        timezone,
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

const toggleModal = ({
  dispatch,
  stateData: { scheduling, event },
  fetchSchedulerData,
  setOpenModal,
  setOpenCalendar,
}) => open => {
  if (!scheduling) {
    if (open && event) {
      dispatch(actions.editEvent());
    }
    fetchSchedulerData();
    setOpenModal(open);
    setOpenCalendar(false);
  }
};

const handleEventDelete = ({
  dispatch,
  stateData: { event },
  eventDeleted,
}) => () => {
  console.log('DELETE EVENT', event);
  if (event && event.coreState === 'Draft') {
    deleteScheduledEvent(event.id).then(() => {
      dispatch(
        actions.setState({
          time: '',
          event: null,
        }),
      );
    });
    if (typeof eventDeleted === 'function') {
      eventDeleted();
    }
  }
};

export const SchedulerWidget = compose(
  withState('expired', 'setExpired', false),
  withState('openModal', 'setOpenModal', false),
  withState('openCalendar', 'setOpenCalendar', false),
  withReducer(
    'stateData',
    'dispatch',
    reducer,
    ({ schedulerId, scheduledEventId, eventType, eventDate }) =>
      State({
        scheduledEventId: scheduledEventId || null,
        schedulerId: schedulerId || null,
        type: eventType || null,
        date:
          eventDate && moment(eventDate, DATE_FORMAT).isValid()
            ? eventDate
            : moment().format(DATE_FORMAT),
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
    handleEventDelete,
  }),
  withHandlers({
    fetchSchedulerDetails,
    fetchSchedulerData,
  }),
  withHandlers({
    toggleModal,
  }),
  withHandlers({
    verifyScheduledEvent,
  }),
  withHandlers({
    scheduleEvent,
  }),
  lifecycle({
    componentDidMount() {
      if (!this.props.schedulerId) {
        throw new Error(
          'SchedulerWidget failed, schedulerId is a required prop.',
        );
      }
      if (!this.props.showTypeSelector && !this.props.eventType) {
        throw new Error(
          'SchedulerWidget failed, eventType is a required prop.',
        );
      }
      console.log('MOUNT', this.props.stateData.toJS());
      this.props.fetchSchedulerDetails();
    },
    componentDidUpdate(previousProps) {
      const {
        scheduledEventId,
        schedulerId,
        eventType,
        stateData,
        performSubmit,
      } = this.props;
      const {
        scheduledEventId: prevScheduledEventId,
        schedulerId: prevSchedulerId,
        eventType: prevEventType,
        stateData: prevStateData,
        performSubmit: prevPerformSubmit,
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
      // If performSubmit prop is a function, update the event to Submitted state
      if (
        stateData.event &&
        typeof performSubmit === 'function' &&
        !prevPerformSubmit
      ) {
        submitScheduledEvent(stateData.event, 'Scheduled Event').then(
          ({ submission, serverError, errors }) => {
            if (serverError) {
              this.props.dispatch(
                actions.addSchedulingErrors([
                  serverError.error || serverError.statusText,
                ]),
              );
            } else if (errors) {
              this.props.dispatch(actions.addSchedulingErrors(errors));
            } else {
              this.props.dispatch(actions.setState({ event: submission }));
              performSubmit();
            }
          },
        );
      }

      // If state changed, fire appropriate functions
      if (stateData !== prevStateData) {
        console.log(
          'STATE CHANGED',
          Object.keys(stateData.toJS()).reduce((diff, key) => {
            if (stateData[key] !== prevStateData[key]) {
              return {
                ...diff,
                [key]: {
                  old: prevStateData[key],
                  new: stateData[key],
                },
              };
            } else {
              return diff;
            }
          }, {}),
        );

        // If event is reserved
        if (stateData.event && stateData.event.coreState === 'Draft') {
          // If schedulerId or type don't match the event, delete the event
          if (
            (stateData.schedulerId !== prevStateData.schedulerId &&
              stateData.schedulerId !==
                stateData.event.values['Scheduler Id']) ||
            (stateData.type !== prevStateData.type &&
              stateData.type !== stateData.event.values['Event Type'])
          ) {
            // Delete the reserved event
            this.props.handleEventDelete();
            // If schedulerId was changed, fetch new details
            if (stateData.schedulerId !== prevStateData.schedulerId) {
              this.props.fetchSchedulerDetails();
            }
          }
        }

        // If type was changed, set new duration multiplier
        if (stateData.type !== prevStateData.type) {
          const config = stateData.configs.find(
            c => c.values['Event Type'] === stateData.type,
          );
          this.props.dispatch(
            actions.setDurationMultiplier(
              config ? config.values['Duration Multiplier'] : 1,
            ),
          );
        }

        if (
          !stateData.loadingData &&
          (stateData.scheduler !== prevStateData.scheduler ||
            stateData.date !== prevStateData.date)
        ) {
          this.props.fetchSchedulerData();
        }
      }
    },
    componentWillUnmount() {
      if (
        this.props.stateData.event &&
        this.props.stateData.event.coreState === 'Draft'
      ) {
        console.log('UNMOUNT & DELETE');
        this.props.handleEventDelete();
      }
    },
  }),
)(SchedulerWidgetComponent);
