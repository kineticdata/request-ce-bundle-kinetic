import React, { Fragment } from 'react';
import {
  compose,
  lifecycle,
  withHandlers,
  withReducer,
  withState,
} from 'recompose';
import moment from 'moment';
import { Alert, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { LoadingMessage, ErrorMessage } from '../StateMessages';
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
  createScheduledEvent,
  updateScheduledEvent,
  submitScheduledEvent,
  deleteScheduledEvent,
  createScheduledEventAction,
} from '../../helpers/schedulerWidget';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerSingleDateController } from 'react-dates';
import { I18n, Moment } from '@kineticdata/react';

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
        <div>
          <span>
            <I18n>You have</I18n>{' '}
          </span>
          <strong>
            {Math.floor(time / 60)}:{time % 60 < 10 ? 0 : ''}
            {time % 60}
          </strong>
          <span>
            {' '}
            <I18n>
              remaining to complete your request to guarantee your time slot.
            </I18n>{' '}
          </span>
        </div>
        {time > 0 && (
          <div>
            <button onClick={handleEventDelete} className="btn btn-link">
              <I18n>Cancel Reservation</I18n>
            </button>
          </div>
        )}
      </div>
    ) : null,
);

const SchedulerWidgetComponent = ({
  showTypeSelector = false,
  canReschedule = false,
  canCancel = false,
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
        'Cancellation Reasons': cancellationReasons = [],
      },
    },
    minAvailableDate,
    maxAvailableDate,
    configs,
    timeslots,
    scheduling,
    schedulingErrors,
    event,
    rescheduleEvent,
    eventCancelled,
  },
  handleTypeChange,
  handleDateChange,
  handleTimeChange,
  handleScheduleChange,
  handleEventDelete,
  openModal,
  toggleModal,
  openCancel,
  toggleCancel,
  openCalendar,
  setOpenCalendar,
  expired,
  setExpired,
  rescheduled,
  cancelled,
  scheduleEvent,
  cancelEvent,
  cancelReason,
  setCancelReason,
  cancelReasonOther,
  setCancelReasonOther,
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
                  <Moment
                    timestamp={availableTimeStart}
                    format={Moment.formats.time}
                  />
                  {' - '}
                  <Moment
                    timestamp={availableTimeEnd}
                    format={Moment.formats.time}
                  />
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

  const dateOptions = (!selectedDate.isValid() ||
  availableBefore < 0 ||
  availableAfter < 0
    ? // If invalid date set, make empty array for options
      []
    : // If at least 2 days available in each direction, show 5 with selected date in the middle
      availableBefore > 1 && availableAfter > 1
      ? Array(5).fill(selectedDate.add(-2, 'days'))
      : // If fewer than 5 total days around selected date available, show them all
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
            {schedulingErrors.map((e, i) => (
              <div key={`error-${i}`}>
                <I18n>{e}</I18n>
              </div>
            ))}
          </div>
        )}
      {!loading &&
        errors.size === 0 && (
          <div>
            {showTypeSelector && (
              <div className="form-group required">
                <label htmlFor="type-select" className="field-label">
                  <I18n>Event Type</I18n>
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
                      <I18n
                        render={translate => (
                          <option
                            value={c.values['Event Type']}
                            key={c.values['Event Type']}
                          >
                            {`${translate(
                              c.values['Event Type'],
                            )} (${duration} ${translate('minutes')})`}
                          </option>
                        )}
                      />
                    );
                  })}
                </select>
              </div>
            )}
            {type && (
              <div className="form-group required">
                {expired && (
                  <Alert color="danger" toggle={() => setExpired(false)}>
                    <I18n>Your selected time has expired.</I18n>
                  </Alert>
                )}
                {cancelled && (
                  <Alert color="info">
                    <span>
                      <I18n>Your event has been successfully cancelled.</I18n>{' '}
                    </span>
                    <em>
                      <I18n>
                        It may take several minutes for your list to reflect the
                        changes.
                      </I18n>
                    </em>
                  </Alert>
                )}
                {rescheduled &&
                  !cancelled && (
                    <Alert color="info">
                      <span>
                        <I18n>
                          Your event has been successfully rescheduled.
                        </I18n>{' '}
                      </span>
                      <em>
                        <I18n>
                          It may take several minutes for your list to reflect
                          the changes.
                        </I18n>
                      </em>
                    </Alert>
                  )}
                <label className="field-label">
                  <I18n>Date and Time</I18n>
                </label>
                <div className="cards__wrapper cards__wrapper--appt pb-0">
                  <div className="card card--appt">
                    <i
                      className="fa fa-calendar fa-fw card-icon"
                      style={{ background: 'rgb(255, 74, 94)' }}
                    />
                    {!eventCancelled ? (
                      <div className="card-body">
                        {rescheduleEvent || event ? (
                          <Fragment>
                            <span className="card-title">
                              <Moment
                                timestamp={moment.tz(
                                  (rescheduleEvent || event).values['Date'],
                                  DATE_FORMAT,
                                  timezone,
                                )}
                                format={Moment.formats.dateWithDay}
                              />
                            </span>
                            <p className="card-subtitle">
                              <Moment
                                timestamp={moment.tz(
                                  (rescheduleEvent || event).values['Time'],
                                  TIME_FORMAT,
                                  timezone,
                                )}
                                format={Moment.formats.time}
                              />
                              {` - `}
                              <Moment
                                timestamp={moment
                                  .tz(
                                    (rescheduleEvent || event).values['Time'],
                                    TIME_FORMAT,
                                    timezone,
                                  )
                                  .add(
                                    (rescheduleEvent || event).values[
                                      'Duration'
                                    ],
                                    'minute',
                                  )}
                                format={Moment.formats.time}
                              />
                            </p>
                          </Fragment>
                        ) : (
                          <span className="card-title">
                            <I18n>Date and time not selected</I18n>
                          </span>
                        )}
                        {!isScheduled &&
                          !scheduling && (
                            <div className="card-actions">
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  toggleModal(true);
                                  setExpired(false);
                                }}
                              >
                                <I18n>
                                  {isReserved ? 'Change' : 'Select'} Date and
                                  Time
                                </I18n>
                              </button>
                            </div>
                          )}
                        {isScheduled &&
                          !scheduling && (
                            <div className="card-actions">
                              {canReschedule && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    toggleModal(true);
                                  }}
                                >
                                  <I18n>Reschedule</I18n>
                                </button>
                              )}
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="card-body">
                        <h1 className="card-message text-danger">
                          <I18n>Cancelled</I18n>
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
                {!eventCancelled &&
                  isScheduled &&
                  !scheduling &&
                  canCancel && (
                    <button
                      type="button"
                      className="btn btn-danger mt-3"
                      onClick={() => {
                        toggleCancel(true);
                      }}
                    >
                      <I18n>Cancel Reservation</I18n>
                    </button>
                  )}
                {!scheduling &&
                  isReserved && (
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
                <I18n>Close</I18n>
              </button>
              <span>
                <I18n>Schedule</I18n>
              </span>
              {date &&
                now.format(DATE_FORMAT) !== date &&
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
                    <I18n>Today</I18n>
                  </button>
                )}
            </h4>
          </div>
          <ModalBody>
            <div className="body-content">
              {dateOptions.length > 0 ? (
                <Fragment>
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
                            <Moment timestamp={dateVal} format="MMM YYYY" />
                          </div>
                          <div className="date-day-number">
                            <Moment timestamp={dateVal} format="DD" />
                          </div>
                          <div className="date-day-name">
                            <Moment timestamp={dateVal} format="ddd" />
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
                            <div key={`error-${i}`}>
                              <I18n>{e}</I18n>
                            </div>
                          ))}
                        </div>
                      )}
                      {!scheduling &&
                        loadingData && (
                          <div className="text-center">
                            <span className="fa fa-spinner fa-spin fa-lg" />
                          </div>
                        )}
                      {!loadingData &&
                        timeOptions.length === 0 && (
                          <div className="text-center text-muted">
                            <strong>
                              <I18n>
                                There are no available time slots for the
                                selected date.
                              </I18n>
                            </strong>
                          </div>
                        )}
                      {(scheduling || !loadingData) &&
                        timeOptions.length > 0 &&
                        timeOptions}
                    </div>
                  )}
                </Fragment>
              ) : (
                <h5 className="m-3 text-danger">No Dates Available</h5>
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
              {scheduling ? (
                <span>
                  <span className="fa fa-spinner fa-spin" />
                  <span>
                    {' '}
                    <I18n>Reserving</I18n>
                  </span>
                </span>
              ) : (
                <I18n>Reserve Time</I18n>
              )}
            </button>
          </ModalFooter>
        </Modal>
      )}
      {openCancel && (
        <Modal
          isOpen={!!openCancel}
          toggle={() => toggleCancel(false)}
          size="sm"
          className="scheduler-widget-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => toggleCancel(false)}
              >
                <I18n>Close</I18n>
              </button>
              <span>
                <I18n>Confirm Cancel</I18n>
              </span>
            </h4>
          </div>
          <ModalBody className="modal-body--padding">
            <div className="body-content">
              {cancellationReasons.length > 0 ? (
                <I18n>Why are you canceling?</I18n>
              ) : (
                <I18n>Are you sure you want to cancel this event?</I18n>
              )}
              {cancellationReasons.length > 0 && (
                <Fragment>
                  <div className="form-group">
                    {cancellationReasons.map((reason, i) => (
                      <label htmlFor={`cancel-reason-${i}`} key={reason}>
                        <input
                          type="radio"
                          name="cancel-reason"
                          id={`cancel-reason-${i}`}
                          value={reason}
                          onChange={e => {
                            setCancelReason(e.target.value);
                            setCancelReasonOther('');
                          }}
                        />
                        <span>
                          {' '}
                          <I18n>{reason}</I18n>
                        </span>
                      </label>
                    ))}
                    <label htmlFor="cancel-reason-other">
                      <input
                        type="radio"
                        name="cancel-reason"
                        id="cancel-reason-other"
                        value="Other"
                        onChange={e => setCancelReason(e.target.value)}
                      />
                      <span>
                        {' '}
                        <I18n>Other</I18n>
                      </span>
                    </label>
                  </div>
                  {cancelReason === 'Other' && (
                    <div className="form-group">
                      <I18n
                        render={translate => (
                          <textarea
                            name="cancel-reason-other-value"
                            id="cancel-reason-other-value"
                            className="form-control"
                            rows="2"
                            value={cancelReasonOther}
                            onChange={e => setCancelReasonOther(e.target.value)}
                            placeholder={translate('Please enter a reason')}
                          />
                        )}
                      />
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              onClick={cancelEvent}
              disabled={
                cancellationReasons.length > 0 &&
                (!cancelReason ||
                  (cancelReason === 'Other' && !cancelReasonOther.trim()))
              }
            >
              <I18n>Cancel Event</I18n>
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
  setEventResultToState,
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
    event && setEventResultToState(event, setScheduledEvent);
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
  const { error } = result;
  if (error) {
    dispatch(actions.addErrors([error.message]));
  } else {
    set(result);
  }
};

const setEventResultToState = ({ dispatch }) => (result, set) => {
  const { error } = result;
  if (error.statusCode === 404) {
    dispatch(
      actions.setState({
        eventCancelled: true,
      }),
    );
  } else if (error) {
    dispatch(actions.addErrors([error.message]));
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
    if (maxAvailableDate && maxAvailableDate.isBefore(minAvailableDate)) {
      dispatch(actions.setDate(moment.tz(timezone).format(DATE_FORMAT)));
      dispatch(actions.setTime(''));
    } else if (selectedDate.isBefore(minAvailableDate)) {
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
      schedulerId: submission && submission.values['Scheduler Id'],
      type: submission && submission.values['Event Type'],
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
      values: {
        'Time Interval': timeInterval,
        Timezone: timezone = moment.tz.guess(),
      },
    },
    availability,
    overrides,
    timeslots,
    event,
  },
  fetchSchedulerData,
  verifyScheduledEvent,
  completeReschedule,
  eventUpdated,
}) => () => {
  dispatch(actions.setScheduling(true));
  if (false) {
    // TODO perform validations
    // dispatch(actions.addSchedulingErrors(['Test errors']));
    return;
  }
  const interval = parseInt(timeInterval, 10);
  const values = {
    'Scheduler Id': schedulerId,
    'Event Type': type,
    Date: date,
    Time: time,
    Duration: durationMultiplier * interval,
    Timestamp: moment.tz(`${date}T${time}`, timezone).toISOString(),
  };

  if (event) {
    if (event.coreState === 'Draft') {
      updateScheduledEvent(event.id, values).then(({ submission, error }) => {
        if (error) {
          dispatch(actions.addSchedulingErrors([error.message]));
        } else {
          dispatch(actions.setState({ event: submission }));
          fetchSchedulerData(verifyScheduledEvent);
        }
      });
    } else {
      // Reschedule event: create new, verify, update existing, delete new
      createScheduledEvent(values).then(({ submission, error }) => {
        if (error) {
          dispatch(actions.addSchedulingErrors([error.message]));
        } else {
          dispatch(
            actions.setState({
              event: submission,
              rescheduleEvent: event,
            }),
          );
          fetchSchedulerData(() => verifyScheduledEvent(completeReschedule));
        }
      });
    }
  } else {
    createScheduledEvent(values).then(({ submission, error }) => {
      if (error) {
        dispatch(actions.addSchedulingErrors([error.message]));
      } else {
        dispatch(actions.setState({ event: submission }));
        fetchSchedulerData(verifyScheduledEvent);
      }
    });
  }
};

const cancelEvent = ({
  dispatch,
  stateData: { event },
  appointmentRequestId,
  toggleCancel,
  setCancelled,
  cancelReason,
  cancelReasonOther,
}) => () => {
  deleteScheduledEvent(event.id).then(() => {
    createScheduledEventAction({
      Action: 'Cancel',
      'Scheduled Event Id': event.id,
      'Request Id': appointmentRequestId,
      'Data Map': !!cancelReason
        ? JSON.stringify({
            'Cancellation Reason': cancelReason,
            'Cancellation Reason Other': cancelReasonOther,
          })
        : undefined,
    }).then(({ error }) => {
      if (error) {
        dispatch(
          actions.addSchedulingErrors([
            'Your event was cancelled, but the details failed to update. Please contact an administrator.',
          ]),
        );
      }
      dispatch(
        actions.setState({
          eventCancelled: true,
          time: '',
          event: null,
          rescheduleEvent: null,
        }),
      );
      toggleCancel(false);
      setCancelled(true);
    });
  });
};

const verifyScheduledEvent = ({
  dispatch,
  stateData: {
    durationMultiplier,
    event,
    rescheduleEvent,
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
}) => successCallback => {
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
            event: rescheduleEvent,
            rescheduleEvent: null,
          }),
        );
        dispatch(
          actions.addSchedulingErrors([
            'The selected timeslot is no longer available. Please select a different time.',
          ]),
        );
      });
    } else {
      if (typeof successCallback === 'function') {
        successCallback(event, rescheduleEvent);
      } else {
        dispatch(actions.setState({ scheduling: false }));
        if (typeof eventUpdated === 'function') {
          eventUpdated(event);
        }
        toggleModal(false);
      }
    }
  } else {
    if (typeof successCallback === 'function') {
      successCallback(event, rescheduleEvent);
    } else {
      dispatch(actions.setState({ scheduling: false }));
      if (typeof eventUpdated === 'function') {
        eventUpdated(event);
      }
      toggleModal(false);
    }
  }
};

const completeReschedule = ({
  dispatch,
  stateData: {
    durationMultiplier,
    event,
    rescheduleEvent,
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
  appointmentRequestId,
  rescheduleDataMap,
  setRescheduled,
}) => () => {
  // Update scheduled event, create Reschedule record, and delete temp draft
  updateScheduledEvent(rescheduleEvent.id, {
    'Scheduler Id': event.values['Scheduler Id'],
    'Event Type': event.values['Event Type'],
    Date: event.values['Date'],
    Time: event.values['Time'],
    Duration: event.values['Duration'],
    Timestamp: moment
      .tz(`${event.values['Date']}T${event.values['Time']}`, timezone)
      .toISOString(),
  }).then(({ submission, error }) => {
    if (error) {
      dispatch(
        actions.addSchedulingErrors(['Failed to update your current event.']),
      );
      dispatch(
        actions.setState({
          event: rescheduleEvent,
          rescheduleEvent: null,
        }),
      );
    } else {
      createScheduledEventAction({
        Action: 'Reschedule',
        'Scheduled Event Id': submission.id,
        'Request Id': appointmentRequestId,
        'Data Map': JSON.stringify(rescheduleDataMap),
      }).then(({ error }) => {
        if (error) {
          dispatch(
            actions.addSchedulingErrors([
              'Your event was rescheduled, but the details failed to update. Please contact an administrator.',
            ]),
          );
        }
        deleteScheduledEvent(event.id);
        dispatch(
          actions.setState({
            scheduling: false,
            event: submission,
            rescheduleEvent: null,
          }),
        );
        toggleModal(false);
        setRescheduled(true);
      });
    }
  });
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
    rescheduleEvent,
  },
  calculateTotalTimeslots,
}) => () => {
  const interval = parseInt(timeInterval, 10);
  const timeslots = calculateTotalTimeslots();
  const currentEventIds = [
    (event && event.id) || null,
    (rescheduleEvent && rescheduleEvent.id) || null,
  ].filter(e => e);

  const currentEvents =
    currentEventIds.length > 0
      ? events.filter(
          e => e.values['Date'] === date && !currentEventIds.includes(e.id),
        )
      : events;
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
      const startIndex = Math.ceil(
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
      const startIndex = Math.ceil(
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
    if (!open) {
      dispatch(actions.clearSchedulingErrors());
    }
    fetchSchedulerData();
    setOpenModal(open);
    setOpenCalendar(false);
  }
};

const toggleCancel = ({
  dispatch,
  stateData: { scheduling },
  setOpenCancel,
  setCancelReason,
  setCancelReasonOther,
}) => open => {
  if (!scheduling) {
    setOpenCancel(open);
    if (!open) {
      setCancelReason('');
      setCancelReasonOther('');
    }
  }
};

const handleEventDelete = ({
  dispatch,
  stateData: { event },
  eventDeleted,
}) => () => {
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
  withState('rescheduled', 'setRescheduled', false),
  withState('cancelled', 'setCancelled', false),
  withState('openModal', 'setOpenModal', false),
  withState('openCancel', 'setOpenCancel', false),
  withState('cancelReason', 'setCancelReason', ''),
  withState('cancelReasonOther', 'setCancelReasonOther', ''),
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
  }),
  withHandlers({
    setResultToState,
    setEventResultToState,
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
    toggleCancel,
  }),
  withHandlers({
    verifyScheduledEvent,
    completeReschedule,
  }),
  withHandlers({
    scheduleEvent,
    cancelEvent,
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
        // console.log(
        //   'STATE CHANGED',
        //   Object.keys(stateData.toJS()).reduce((diff, key) => {
        //     if (stateData[key] !== prevStateData[key]) {
        //       return {
        //         ...diff,
        //         [key]: {
        //           old: prevStateData[key],
        //           new: stateData[key],
        //         },
        //       };
        //     } else {
        //       return diff;
        //     }
        //   }, {}),
        // );

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
        this.props.handleEventDelete();
      }
    },
  }),
)(SchedulerWidgetComponent);
