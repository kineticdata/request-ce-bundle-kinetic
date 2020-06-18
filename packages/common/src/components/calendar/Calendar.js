import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { generateKey } from '@kineticdata/react';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { List, Map, fromJS } from 'immutable';
import { actions } from '../../redux/modules/calendar';

import { updateEvents } from './calendarHelpers';
import { MainCalendar } from './MainCalendar';
import { FilterList, MiniCalendar, Timezones } from './CalendarElements';

/* helpers */
/**
 * This function returns true if any filter has a value of false for
 * isChecked.  This means that at least one filter is not checked.
 *
 * @param {*} filterActions
 * @param {*} eventTypeId
 */
const getCheckedFiltersState = (filterActions, eventTypeId) =>
  filterActions
    .get(eventTypeId)
    .filter(property => Map.isMap(property))
    .some(filter => !filter.get('isChecked'));

export const CalendarWrapper = props => (
  <Fragment>
    {props.title &&
      props.title({
        ...props.calendarConfig,
        selectedDate: props.selectedDate,
        timezone: props.timezone,
      })}
    <div className="calendar-component column-container">
      <div className="calendar-panel calendar-panel--left">
        <MiniCalendar {...props} />
        <Timezones {...props} />
        <FilterList {...props} />
      </div>
      <div className="calendar-panel calendar-panel--right">
        <MainCalendar {...props} />
      </div>
    </div>
  </Fragment>
);

export const handleMainDateSelect = props => args => {
  let modalOpen;
  if (args == null) {
    modalOpen = false;
  } else {
    modalOpen = true;
  }
  props.setCalendarDateSelect({ key: props.calendarKey, args, modalOpen });
};

export const handleMainEventSelect = props => args => {
  let modalOpen;
  if (args == null) {
    modalOpen = false;
  } else {
    modalOpen = true;
  }
  props.setCalendarEventSelect({ key: props.calendarKey, args, modalOpen });
};

export const handleMiniDateChange = props => args => {
  if (!props.selectedDate.isSame(args, 'month')) {
    props.fetchCalendarEvents({
      filterActions: props.filterActions,
      eventTypes: props.eventTypes,
      key: props.calendarKey,
      date: args,
      timezone: props.timezone,
    });
  }
  props.setMiniDateChange({ key: props.calendarKey, miniDate: args });
};

export const handleMainViewChange = props => view => {
  props.setMainViewChange({ key: props.calendarKey, view });
};

export const handleMainNavigateChange = props => date => {
  props.fetchCalendarEvents({
    filterActions: props.filterActions,
    eventTypes: props.eventTypes,
    key: props.calendarKey,
    date,
    timezone: props.timezone,
  });
  props.setMainNavigateChange({ key: props.calendarKey, date });
};

export const handleEventTypeOpen = props => event => {
  // the value of the button is a boolean that controls if filters are active.
  const filterActions = props.filterActions.setIn(
    [event.currentTarget.getAttribute('data-event-type-id'), 'eventTypeOpen'],
    !(event.currentTarget.value === 'true'),
  );
  props.updateFromFilter({
    key: props.calendarKey,
    events: props.events,
    filterActions,
  });
};

export const handleFilterOpen = props => event => {
  const eventTypeId = event.currentTarget.getAttribute('data-event-type-id');
  const filterId = event.currentTarget.getAttribute('data-filter-id');

  // The value property of the button is a boolean that controls if filters are active.
  let filterActions = props.filterActions
    .setIn([eventTypeId, 'activeFilter'], filterId)
    .setIn([eventTypeId, 'isActive'], event.currentTarget.value === 'true')
    .setIn(
      [eventTypeId, filterId, 'filterOpen'],
      !(event.currentTarget.value === 'true'),
    );

  // Close previously open filter
  const previousActiveFilter = props.filterActions
    .get(eventTypeId)
    .get('activeFilter');
  if (previousActiveFilter && previousActiveFilter !== filterId) {
    filterActions = filterActions.setIn(
      [eventTypeId, previousActiveFilter, 'filterOpen'],
      event.currentTarget.value === 'true',
    );
  }

  // Check if a filter is open
  const isOpen = filterActions
    .get(eventTypeId)
    .filter(prop => Map.isMap(prop))
    .every(filter => !filter.get('filterOpen'));
  let events = props.events;
  if (!isOpen) {
    // Set events color based on open filter
    const filterOptions = filterActions
      .get(eventTypeId)
      .get(filterId)
      .filter(prop => Map.isMap(prop));
    const filterName = filterActions
      .get(eventTypeId)
      .get(filterId)
      .get('value');
    events = events.map(event => {
      const filterColor = filterOptions
        .get(event.details.get(filterName))
        .get('value');
      return { ...event, classNames: [`event-${filterColor}`] };
    });
  } else {
    // Set events color based on eventType
    events = events.map(event => {
      const eventTypeColor = filterActions.get(eventTypeId).get('color');
      return { ...event, classNames: [`event-${eventTypeColor}`] };
    });
  }

  props.updateFromFilter({
    key: props.calendarKey,
    events,
    filterActions,
  });
};

export const handleEventTypeCheckboxChange = props => synthEvent => {
  // update events
  const isChecked = synthEvent.target.checked;
  const events = props.events
    .filter(event => event.key === synthEvent.target.value)
    .map(event => ({ ...event, filter: !isChecked }));
  let filterActions = props.filterActions.setIn(
    [synthEvent.target.value, 'isChecked'],
    isChecked,
  );

  filterActions = filterActions.map((eventType, eventTypeKey ) => {
    const eventTypeTemp = eventType
      .filter(property => Map.isMap(property))
      .map(eventTypeFilter => {
        const eventTypeFilterTemp = eventTypeFilter
          .filter(property => Map.isMap(property))
          .map((option) => {
            return option.set('isChecked', isChecked);
          });
        eventTypeFilter = eventTypeFilter.set('isChecked', isChecked);
        return eventTypeFilter.merge(eventTypeFilterTemp);
      })
    return eventType.merge(eventTypeTemp);
  });

  props.updateFromFilter({ key: props.calendarKey, events, filterActions });
};

export const handleFilterCheckboxChange = props => synthEvent => {
  const eventTypeId = synthEvent.target.getAttribute('data-event-type-id');

  // Update the isChecked property. The target value is used to "know"
  // which filter and filter options to update.
  let filterActions = props.filterActions
    .setIn(
      [eventTypeId, synthEvent.target.value],
      props.filterActions
        .get(eventTypeId)
        .get(synthEvent.target.value)
        .map(filterOption => {
          if (Map.isMap(filterOption)) {
            filterOption = filterOption.set(
              'isChecked',
              synthEvent.target.checked,
            );
          }
          return filterOption;
        }),
    )
    .setIn(
      [eventTypeId, synthEvent.target.value, 'isChecked'],
      synthEvent.target.checked,
    );

  // Change the state of the event type checkbox if > 1 filter is selected
  const checkedFiltersState = getCheckedFiltersState(
    filterActions,
    eventTypeId,
  );
  filterActions = filterActions
    .setIn([eventTypeId, 'isChecked'], !checkedFiltersState)
    .setIn([eventTypeId, 'displayDash'], checkedFiltersState);

  // update filter value
  const events = updateEvents(filterActions, props.events);

  props.updateFromFilter({
    key: props.calendarKey,
    events: events,
    filterActions,
  });
};

export const handleOptionChange = props => synthEvent => {
  const eventTypeId = synthEvent.target.getAttribute('data-event-type-id');
  const filterId = synthEvent.target.getAttribute('data-filter-id');
  const value = synthEvent.target.value;
  const activeFilter = props.filterActions.get(eventTypeId).get('activeFilter');
  const options = props.filterActions
    .get(eventTypeId)
    .get(activeFilter)
    .filter(option => Map.isMap(option));

  // Change selected option checked state
  let filterActions = props.filterActions.setIn(
    [eventTypeId, filterId, value, 'isChecked'],
    synthEvent.target.checked,
  );

  // Change the state of the filter checkbox if > 1 option is selected
  const checkedOptions = options.reduce((acc, option, key) => {
    return (option.get('isChecked') && key !== value) ||
      (key === value && synthEvent.target.checked)
      ? acc.push(key)
      : acc;
  }, List());
  filterActions = filterActions
    .setIn(
      [eventTypeId, filterId, 'isChecked'],
      options.size === checkedOptions.size,
    )
    .setIn(
      [eventTypeId, filterId, 'displayDash'],
      options.size !== checkedOptions.size && checkedOptions.size > 0,
    );

  // Change the state of the event type checkbox if > 1 filter is selected
  const checkedFiltersState = getCheckedFiltersState(
    filterActions,
    eventTypeId,
  );
  filterActions = filterActions
    .setIn([eventTypeId, 'isChecked'], !checkedFiltersState)
    .setIn([eventTypeId, 'displayDash'], checkedFiltersState);

  // update filter value
  const events = updateEvents(filterActions, props.events);

  props.updateFromFilter({ key: props.calendarKey, events, filterActions });
};

export const handleTimezoneChange = props => event => {
  props.setTimezone(event.target.value);
};

const mapStateToProps = (state, props) => {
  const calendar = state.calendar.get(props.calendarKey)
    ? state.calendar.get(props.calendarKey)
    : state.calendar.get('default');
  return {
    selectedDate: calendar.selectedDate,
    mainCalendarDate: calendar.mainCalendarDate,
    mainCalendarEvent: calendar.mainCalendarEvent,
    mainCalendarView: calendar.mainCalendarView,
    miniDateActive: calendar.miniDateActive,
    datePickerKey: calendar.datePickerKey,
    dateModalOpen: calendar.dateModalOpen,
    eventModalOpen: calendar.eventModalOpen,
    events: calendar.events,
    eventTypes: calendar.eventTypes,
    filterActions: calendar.filterActions,
    calendarConfig: calendar.calendarConfig,
    timezones: fromJS(state.calendar.get('timezones')),
  };
};

const mapDispatchToProps = {
  fetchConfig: actions.fetchCalendarConfig,
  setCalendarDateSelect: actions.setCalendarDateSelect,
  setCalendarEventSelect: actions.setCalendarEventSelect,
  setMainViewChange: actions.setCalendarViewChange,
  setMainNavigateChange: actions.setCalendarNavigateChange,
  setMiniDateChange: actions.setMiniDateChange,
  updateFromFilter: actions.updateFromFilter,
  setFilterOptions: actions.setFilterOptions,
  fetchCalendarEvents: actions.fetchCalendarEvents,
};

export const Calendar = compose(
  // calendarKey is used as a prop in mapStateToProps so it must come before.
  withState('calendarKey', 'setCalendarKey', () => generateKey()),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState(
    'timezone',
    'setTimezone',
    props => (props.timezone ? props.timezone : moment.tz.guess()),
  ),
  withHandlers({
    handleMainDateSelect,
    handleMainEventSelect,
    handleMiniDateChange,
    handleMainViewChange,
    handleMainNavigateChange,
    handleEventTypeCheckboxChange,
    handleFilterCheckboxChange,
    handleOptionChange,
    handleEventTypeOpen,
    handleFilterOpen,
    handleTimezoneChange,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchConfig({
        slug: this.props.slug,
        key: this.props.calendarKey,
        timezone: this.props.timezone,
      });
    },
    componentDidUpdate(prevProps) {},
  }),
)(CalendarWrapper);
