import { call, put, all, takeEvery } from 'redux-saga/effects';
import {
  searchSubmissions,
  SubmissionSearch,
  fetchBridgedResource,
} from '@kineticdata/react';
import { generateKey } from '@kineticdata/react';
import { OrderedMap, Map, fromJS } from 'immutable';
import axios from 'axios';

import { actions, types } from '../modules/calendar';
import {
  getDateRange,
  buildFilterActions,
  updateEvents,
  updateFilterActions,
} from '../../components/calendar/calendarHelpers';

/* Helpers */
export const parseConfig = configString => {
  try {
    return JSON.parse(configString);
  } catch (e) {
    // TODO: better handle error.
    console.log(e);
  }
};

export const convertBool = allDayValue =>
  allDayValue.toLowerCase().trim() === 'true' ? true : false;

export function* fetchCalendarConfigSaga({ payload }) {
  // Fetch timezones
  yield call(fetchLocaleMetaTask);

  const searchBuilder = new SubmissionSearch(true)
    .includes(['details', 'values'])
    .index('values[Status],values[Calendar Slug]')
    .eq('values[Calendar Slug]', payload.slug)
    .eq('values[Status]', 'Active');

  const search = searchBuilder.build();

  const { submissions, error } = yield call(searchSubmissions, {
    search,
    datastore: true,
    form: 'calendar-configurations',
  });

  if (error) {
    // TODO handle error
  } else {
    // The request to DS will only return one result because the index is Unique
    const submission = submissions ? submissions[0] : null;

    if (submission) {
      let eventTypes = parseConfig(submission.values['Event Types']);
      eventTypes = eventTypes.reduce((acc, calendarConfig) => {
        const key = generateKey();
        return acc.set(
          key,
          fromJS({
            name: calendarConfig.name ? calendarConfig.name : '--Blank--',
            //color: calendarConfig.color,
            // TODO: if prop exists what do we do?  question open to Matt H
            defaultFilter: calendarConfig.defaultFilter,
            source: calendarConfig.source,
            coreMapping: calendarConfig.coreMapping
              ? calendarConfig.coreMapping
              : {},
            detailMapping: calendarConfig.detailMapping
              ? OrderedMap(calendarConfig.detailMapping)
              : {},
            filterMapping: calendarConfig.filterMapping
              ? calendarConfig.filterMapping.map(filter => ({
                  ...filter,
                  id: generateKey(),
                  values: filter.values,
                }))
              : [],
          }),
        );
      }, Map());

      const calendarConfig = parseConfig(submission.values['Calendar Config']);

      yield put(
        actions.fetchCalendarEvents({
          key: payload.key,
          eventTypes,
          timezone: payload.timezone,
        }),
      );
      yield put(
        actions.fetchCalendarConfigSuccess({
          key: payload.key,
          eventTypes,
          calendarConfig,
        }),
      );
    } else {
      // TODO: Throw error that config was not found.
    }
  }
}

export function* fetchCalendarEventsSaga({ payload }) {
  yield put(
    actions.fetchCalendarEventsSuccess({ key: payload.key, events: [] }),
  );
  const sources = payload.eventTypes.reduce((acc, eventType, key) => {
    let source = eventType.get('source');
    let values = {};
    if (source.has('parameterFieldNames')) {
      0;
      values = source
        .get('parameterFieldNames')
        .reduce((acc, fieldName, key) => {
          let propertyName = fieldName.trim().length > 0 ? fieldName : key;
          if (key === 'Date Range') {
            acc = { ...getDateRange(propertyName, payload.date), ...acc };
          }
          return acc;
        }, {});
      source = source.remove('parameterFieldNames');
    }
    acc[key] = call(fetchBridgedResource, {
      ...source.toJS(),
      values,
    });
    return acc;
  }, {});

  // response is a JS Object of request responses. Each request responses has a unique key.
  const response = yield all({ ...sources });
  // combine all events from each source and reformat to the needs of the calendar.
  let events = Object.keys(response ? response : {}).reduce((acc, key) => {
    const coreMapping = payload.eventTypes
      .get(key)
      .get('coreMapping')
      .toJS();
    const detailMapping = OrderedMap(
      payload.eventTypes.get(key).get('detailMapping'),
    );
    const localEvents = response[key].records.map(event => {
      // TODO: convert the return object to an immutable Map.
      // The object is passed to EventModal for users to customize their modals.
      // It's inconstant to have details as a Map and the event(return object) as an object
      return {
        // default that all events display when calendar renders.
        filter: false,
        key,
        ...Object.keys(coreMapping).reduce((acc, property) => {
          acc[property] =
            property === 'start' || property === 'end'
              ? new Date(event[coreMapping[property]])
              : property === 'allDay'
                ? convertBool(event[coreMapping[property]])
                : event[coreMapping[property]];
          return acc;
        }, {}),
        details: detailMapping.map(detail => {
          let value;
          if (typeof detail === 'object') {
            value = {
              ...detail,
              value: event[detail.attributeName],
            };
          } else {
            value = event[detail];
          }
          return value;
        }),
      };
    });
    acc = acc.concat(localEvents);
    return acc;
  }, []);

  let filterActions;
  if (payload.filterActions) {
    filterActions = updateFilterActions({
      filterActions: payload.filterActions,
      events});
    events = updateEvents(filterActions, events);
  } else {
    filterActions = buildFilterActions({
      eventTypes: payload.eventTypes,
      events,
    });
  }

  yield put(
    actions.setFilterActions({
      key: payload.key,
      filterActions,
    }),
  );

  // console.log(JSON.stringify(events.map(event => {
  //   delete event.details;
  //   delete event.key;
  //   delete event.filter;
  //   return event;
  // })))
  // TODO: figure out how to handle errors
  yield put(actions.fetchCalendarEventsSuccess({ key: payload.key, events }));
}

// Fetch Locales Metadata Task
export function* fetchLocaleMetaTask() {
  const { locales, timezones } = yield all({
    // locales: call(fetchLocales),
    timezones: call(fetchTimezones),
  });
  yield put(
    actions.fetchLocaleMetaSuccess({
      // locales: locales.data.locales,
      timezones: timezones.data.timezones,
    }),
  );
}

// TODO: Move to react-kinetic-lib
const fetchLocales = () => axios.get(`${bundle.apiLocation()}/meta/locales`);
const fetchTimezones = () =>
  axios.get(`${bundle.apiLocation()}/meta/timezones`);

export function* watchCalendar() {
  yield takeEvery(types.FETCH_CALENDAR_CONFIGURATION, fetchCalendarConfigSaga);
  yield takeEvery(types.FETCH_CALENDAR_EVENTS, fetchCalendarEventsSaga);
}
