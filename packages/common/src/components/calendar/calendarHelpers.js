import { Map, Set } from 'immutable';
import md5 from 'md5';

const COLORS = [
  'blue',
  'blue-gray',
  'blue-sky',
  'blue-lake',
  'blue-slate',
  'green',
  'green-grass',
  'green-teal',
  'orange',
  'purple',
  'indigo',
  'red-purple',
  'red',
  'red-rose',
  'sunflower',
  'yellow',
];

export const getColorClass = string =>
  string
    ? COLORS[parseInt(md5(string).slice(0, 6), 16) % COLORS.length]
    : COLORS[5];

/**
 * This function is called when the calendar calls for new events.
 * The options may have changed between event sets.
 * 
 * @param {*} 
 *  @param filterActions
 *  @param events 
 */
export const updateFilterActions = ({ filterActions, events }) =>
  filterActions.map((eventType, eventTypeKey ) => {
    events = events.filter(event => event.key === eventTypeKey);
    const eventTypeTemp = eventType
      .filter(property => Map.isMap(property))
      .map(eventTypeFilter => {
        const newOptionSet = events.reduce((acc, event) => 
          acc.add(event.details.get(eventTypeFilter.get("value"))),
          Set()
        )
        // Delete options that are not in new Set
        eventTypeFilter
          .filter(property => Map.isMap(property))
          .map((option, optionKey) => {
            if (!newOptionSet.has(optionKey)) {
              eventTypeFilter = eventTypeFilter.delete(optionKey);
            }
          })
        // Add new options
        newOptionSet.map(option => {
          if (!eventTypeFilter.has(option)) {
            eventTypeFilter = eventTypeFilter.set(option, Map({
              isChecked: true,
              value: getColorClass(option),
            }))
          }
        })
        return eventTypeFilter;
      })
    return eventType.merge(eventTypeTemp); 
  });

export const buildFilterActions = ({ eventTypes, events }) =>
  eventTypes.reduce(
    (acc, eventType, key) =>
      acc.set(
        key,
        Map({
          // Tracking of checkbox state
          isChecked: true,
          eventTypeOpen: false,
          isActive: true,
          displayDash: false,
          color: eventType.has('color')
            ? eventType.get('color')
            : getColorClass(eventType.get('name')),
          count: events.filter(event => event.key === key).length,
          // TODO: if prop exists what do we do?  question open to Matt H
          defaultFilter: eventType.has('defaultFilter') ? false : true,
        }).merge(
          eventType.has('filterMapping')
            ? eventType.get('filterMapping').reduce(
                (acc, filter) =>
                  acc.set(
                    filter.get('id'),
                    Map({
                      value: filter.get('value'),
                      isChecked: true,
                      filterOpen: false,
                      displayDash: false,
                      color: 'blue',
                    }).merge(
                      filter.has('value')
                        ? events
                            .reduce(
                              (acc, event) =>
                                acc.add(event.details.get(filter.get('value'))),
                              Set(),
                            )
                            .reduce(
                              (acc, name) =>
                                acc.set(
                                  name,
                                  Map({
                                    isChecked: true,
                                    value: getColorClass(name),
                                  }),
                                ),
                              Map(),
                            )
                        : Map(),
                    ),
                  ),
                Map(),
              )
            : Map(),
        ),
      ),
    Map(),
  );

export const updateEvents = (filterActions, events) => {
  // Build list of filters that have checked options per event type
  const filterList = filterActions.reduce((acc, filterAction, key) => {
    return acc.set(
      key,
      filterAction
        .filter(property => Map.isMap(property))
        .reduce((acc, filter) => {
          const checkedOptions = filter
            .filter(property => Map.isMap(property))
            .reduce((acc, option, optionKey) => {
              if (option.get('isChecked')) {
                acc.push(optionKey);
              }
              return acc;
            }, []);
          if (checkedOptions.length > 0) {
            acc = acc.set(filter.get('value'), checkedOptions);
          }
          return acc;
        }, Map()),
    );
  }, Map());

  // return a list of filtered events
  return events.map(
    event =>
      filterList
        .get(event.key)
        .every((options, optionName) =>
          options.includes(event.details.get(optionName)),
        )
        ? { ...event, filter: false }
        : { ...event, filter: true },
  );
};

export const getDateRange = (fieldName, date) => {
  date = date ? moment(date).format() : moment().format();
  const mDate = moment(date, 'YYYY-MM');

  const daysCount = mDate.daysInMonth();
  // mDate is mutated below so get month here
  const month = mDate.format('YYYY-MM');
  const dates = Array(daysCount)
    .fill(null)
    .map((v, index) => {
      const addDays = index === 0 ? 0 : 1;
      return mDate.add(addDays, 'days').format('YYYY-MM-DD');
    });
  dates.push(month);
  return { [fieldName]: `(${dates.map(date => `"${date}"`).join(',')})` };
};

export const getStartDate = (fieldName, date) => {
  return { [fieldName]: moment(date).startOf('month').format('MM/DD/YYYY') };
};

export const getEndDate = (fieldName, date) => {
  return { [fieldName]: moment(date).endOf('month').format('MM/DD/YYYY') };
}
