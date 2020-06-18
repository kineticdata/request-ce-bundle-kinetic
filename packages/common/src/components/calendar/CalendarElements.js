import React from 'react';
import { Map } from 'immutable';
import { DayPickerSingleDateController } from 'react-dates';
import classNames from 'classnames';
import { generateKey } from '@kineticdata/react';

export const MiniCalendar = props => (
  <DayPickerSingleDateController
    key={props.datePickerKey}
    date={props.selectedDate}
    onDateChange={selectedDate => {
      props.handleMiniDateChange(selectedDate);
    }}
    numberOfMonths={1}
    daySize={30}
    hideKeyboardShortcutsPanel={true}
    noBorder={true}
    focused={true}
  />
);

export const FilterList = props => (
  <div className="calendar--filter">
    {props.filterActions.size > 0 &&
      props.eventTypes
        .map((eventType, eventTypeId) => (
          <div key={eventTypeId}>
            <div className="checkbox__filter">
              <EventTypeFilterCheckBox
                {...props}
                eventType={eventType}
                eventTypeId={eventTypeId}
              />
              <div>
                <small>
                  {
                    props.events.filter(
                      event => event.key === eventTypeId && !event.filter,
                    ).length
                  }
                </small>
                <EventTypeOpenButton
                  handleEventTypeOpen={props.handleEventTypeOpen}
                  eventTypeOpen={props.filterActions
                    .get(eventTypeId)
                    .get('eventTypeOpen')}
                  eventTypeId={eventTypeId}
                />
              </div>
            </div>
            {props.filterActions.get(eventTypeId).get('eventTypeOpen') &&
              eventType.get('filterMapping').map(filter => (
                <div className="calendar-filter" key={filter.get('id')}>
                  <div className="checkbox__filter">
                    <FilterCheckBox
                      filterActions={props.filterActions}
                      filter={filter}
                      eventTypeId={eventTypeId}
                      handleFilterCheckboxChange={
                        props.handleFilterCheckboxChange
                      }
                    />
                    <FilterOpenButton
                      handleFilterOpen={props.handleFilterOpen}
                      eventTypeId={eventTypeId}
                      filterId={filter.get('id')}
                      filterOpen={props.filterActions
                        .get(eventTypeId)
                        .get(filter.get('id'))
                        .get('filterOpen')}
                    />
                  </div>
                  {props.filterActions
                    .get(eventTypeId)
                    .get(filter.get('id'))
                    .get('filterOpen') &&
                    props.filterActions
                      .get(eventTypeId)
                      .get(filter.get('id'))
                      .filter(option => Map.isMap(option))
                      .map((value, key) => (
                        <div className="calendar-options" key={key}>
                          <div className="checkbox__filter">
                            <FilterOptionCheckBox
                              filterActions={props.filterActions}
                              filterId={filter.get('id')}
                              eventTypeId={eventTypeId}
                              value={value}
                              name={key}
                              handleOptionChange={props.handleOptionChange}
                            />
                            <small>
                              {
                                props.events.filter(
                                  event =>
                                    event.key === eventTypeId &&
                                    !event.filter &&
                                    key ===
                                      event.details.get(filter.get('value')),
                                ).length
                              }
                            </small>
                          </div>
                        </div>
                      ))
                      .toList()}
                </div>
              ))}
          </div>
        ))
        .toList()}
  </div>
);

export const EventTypeFilterCheckBox = ({
  eventTypeId,
  handleEventTypeCheckboxChange,
  eventType,
  filterActions,
}) => {
  const eventTypeAction = filterActions.get(eventTypeId);
  return (
    <span
      className={classNames(
        'filter-checkbox',
        `checkbox-${eventTypeAction.get('color')}`,
        { 'filter-checkbox--dash': eventTypeAction.get('displayDash') },
      )}
    >
      <input
        id={eventTypeId}
        value={eventTypeId}
        type="checkbox"
        onChange={handleEventTypeCheckboxChange}
        checked={eventTypeAction.get('isChecked')}
      />
      <label htmlFor={eventTypeId}>
        <span className="ellipsis">{eventType.get('name')}</span>
      </label>
    </span>
  );
};

export const FilterCheckBox = ({
  eventTypeId,
  handleFilterCheckboxChange,
  filter,
  filterActions,
}) => {
  const filterAction = filterActions.get(eventTypeId).get(filter.get('id'));
  return (
    <span
      className={classNames(
        'filter-checkbox',
        `checkbox-${filterAction.get('color')}`,
        { 'filter-checkbox--dash': filterAction.get('displayDash') },
      )}
    >
      <input
        id={filter.get('id')}
        value={filter.get('id')}
        type="checkbox"
        data-event-type-id={eventTypeId}
        onChange={handleFilterCheckboxChange}
        checked={filterAction.get('isChecked')}
      />
      <label htmlFor={filter.get('id')}>
        {' '}
        <span className="ellipsis">{filter.get('name')}</span>
      </label>
    </span>
  );
};

export const FilterOptionCheckBox = ({
  eventTypeId,
  handleOptionChange,
  filterId,
  name,
  filterActions,
}) => {
  const optionAction = filterActions
    .get(eventTypeId)
    .get(filterId)
    .get(name);
  const key = generateKey();
  return (
    <span
      className={classNames(
        'filter-checkbox',
        `checkbox-${optionAction.get('value')}`,
      )}
    >
      <input
        id={key}
        value={name}
        type="checkbox"
        data-event-type-id={eventTypeId}
        data-filter-id={filterId}
        onChange={handleOptionChange}
        checked={optionAction.get('isChecked')}
      />
      <label htmlFor={key}>
        {' '}
        <span className="ellipsis">{name ? name : '__blank__'}</span>
      </label>
    </span>
  );
};

export const EventTypeOpenButton = ({
  eventTypeId,
  handleEventTypeOpen,
  eventTypeOpen,
}) => (
  <button
    className="btn-no-style"
    value={eventTypeOpen}
    data-event-type-id={eventTypeId}
    onClick={handleEventTypeOpen}
  >
    <i
      className={`fa fa-chevron-${eventTypeOpen ? 'down' : 'up'}`}
      aria-hidden="true"
    />
  </button>
);

export const FilterOpenButton = props => (
  <button
    className="btn-no-style"
    value={props.filterOpen}
    data-event-type-id={props.eventTypeId}
    data-filter-id={props.filterId}
    onClick={props.handleFilterOpen}
  >
    <i
      className={`fa fa-chevron-${props.filterOpen ? 'down' : 'up'}`}
      aria-hidden="true"
    />
  </button>
);

export const Timezones = props => {
  return (
    <div className="form-group">
      <label htmlFor="timezone">Timezone</label>
      <select
        type="text"
        id="timezone"
        name="timezone"
        className="form-control"
        onChange={props.handleTimezoneChange}
        value={props.timezone}
      >
        <option value="">None Selected</option>
        {props.timezones
          // there are some timezones returned that aren't supported by moment
          .filter(timezone => moment.tz.zone(timezone.get('id')))
          // sort by offset
          .sortBy(timezone => moment.tz(timezone.get('id')).utcOffset())
          .map(timezone => (
            <option value={timezone.get('id')} key={timezone.get('id')}>
              {moment.tz(timezone.get('id')).format('Z')} {timezone.get('name')}{' '}
              ({timezone.get('id')})
            </option>
          ))}
      </select>
    </div>
  );
};
