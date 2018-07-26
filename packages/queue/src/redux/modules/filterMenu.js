import { Map } from 'immutable';

export const types = {
  OPEN: '@kd/queue/filterMenu/OPEN',
  CLOSE: '@kd/queue/filterMenu/CLOSE',
  RESET: '@kd/queue/filterMenu/RESET',
  SET_FILTER_NAME: '@kd/queue/filterMenu/SET_FILTER_NAME',
  SHOW_SECTION: '@kd/queue/filterMenu/SHOW_SECTION',
  TOGGLE_ASSIGNMENT: '@kd/queue/filterMenu/TOGGLE_ASSIGNMENT',
  TOGGLE_CREATED_BY_ME: '@kd/queue/filterMenu/TOGGLE_CREATED_BY_ME',
  TOGGLE_TEAM: '@kd/queue/filterMenu/TOGGLE_TEAM',
  TOGGLE_STATUS: '@kd/queue/filterMenu/TOGGLE_STATUS',
  SET_DATE_RANGE_TIMELINE: '@kd/queue/filterMenu/SET_DATE_RANGE_TIMELINE',
  SET_DATE_RANGE_PRESET: '@kd/queue/filterMenu/SET_DATE_RANGE_PRESET',
  TOGGLE_DATE_RANGE_CUSTOM: '@kd/queue/filterMenu/TOGGLE_DATE_RANGE_CUSTOM',
  SET_DATE_RANGE_START: '@kd/queue/filterMenu/SET_DATE_RANGE_START',
  SET_DATE_RANGE_END: '@kd/queue/filterMenu/SET_DATE_RANGE_END',
  SET_SORTED_BY: '@kd/queue/filterMenu/SET_SORTED_BY',
};

export const actions = {
  open: initialFilter => ({ type: types.OPEN, payload: initialFilter }),
  close: () => ({ type: types.CLOSE }),
  reset: () => ({ type: types.RESET }),
  setFilterName: filterName => ({
    type: types.SET_FILTER_NAME,
    payload: filterName,
  }),
  showSection: section => ({ type: types.SHOW_SECTION, payload: section }),
  toggleAssignment: payload => ({ type: types.TOGGLE_ASSIGNMENT, payload }),
  toggleCreatedByMe: payload => ({ type: types.TOGGLE_CREATED_BY_ME, payload }),
  toggleTeam: payload => ({ type: types.TOGGLE_TEAM, payload }),
  toggleStatus: payload => ({ type: types.TOGGLE_STATUS, payload }),
  setDateRangeTimeline: payload => ({
    type: types.SET_DATE_RANGE_TIMELINE,
    payload,
  }),
  setDateRangePreset: payload => ({
    type: types.SET_DATE_RANGE_PRESET,
    payload,
  }),
  toggleDateRangeCustom: () => ({ type: types.TOGGLE_DATE_RANGE_CUSTOM }),
  setDateRangeStart: payload => ({ type: types.SET_DATE_RANGE_START, payload }),
  setDateRangeEnd: payload => ({ type: types.SET_DATE_RANGE_END, payload }),
  setSortedBy: payload => ({ type: types.SET_SORTED_BY, payload }),
};

export const defaultState = Map({
  isOpen: false,
  initialFilter: null,
  currentFilter: null,
  activeSection: null,
  filterName: '',
});

export const reducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case types.OPEN:
      return state
        .set('isOpen', true)
        .set('initialFilter', payload)
        .set('currentFilter', payload)
        .set('filterName', payload.type === 'custom' ? payload.name : '');
    case types.CLOSE:
      return defaultState;
    case types.RESET:
      return state.set('currentFilter', state.get('initialFilter'));
    case types.SET_FILTER_NAME:
      return state.set('filterName', payload);
    case types.SHOW_SECTION:
      return state.set('activeSection', payload);
    case types.TOGGLE_ASSIGNMENT:
      return state.updateIn(
        ['currentFilter', 'assignments', payload],
        bool => !bool,
      );
    case types.TOGGLE_CREATED_BY_ME:
      return state.setIn(['currentFilter', 'createdByMe'], payload);
    case types.TOGGLE_TEAM:
      return state.getIn(['currentFilter', 'teams']).includes(payload)
        ? state.updateIn(['currentFilter', 'teams'], teams =>
            teams.delete(teams.indexOf(payload)),
          )
        : state.updateIn(['currentFilter', 'teams'], teams =>
            teams.push(payload),
          );
    case types.TOGGLE_STATUS:
      const currentStatuses = state.getIn(['currentFilter', 'status']);
      return (
        state
          .updateIn(
            ['currentFilter', 'status'],
            statuses =>
              statuses.includes(payload)
                ? statuses.delete(statuses.indexOf(payload))
                : statuses.push(payload),
          )
          // If we are adding 'Complete' or 'Cancelled' to statuses and there is
          // no date range selected we default the date range preset to 30 days.
          .updateIn(
            ['currentFilter', 'dateRange', 'preset'],
            preset =>
              !currentStatuses.includes('Complete') &&
              !currentStatuses.includes('Cancelled') &&
              (payload === 'Complete' || payload === 'Cancelled') &&
              preset === '' &&
              !state.getIn(['currentFilter', 'dateRange', 'custom'])
                ? '30days'
                : preset,
          )
      );
    case types.SET_DATE_RANGE_TIMELINE:
      return state.setIn(['currentFilter', 'dateRange', 'timeline'], payload);
    case types.SET_DATE_RANGE_PRESET:
      return state
        .setIn(['currentFilter', 'dateRange', 'preset'], payload)
        .setIn(['currentFilter', 'dateRange', 'custom'], false);
    case types.TOGGLE_DATE_RANGE_CUSTOM:
      return state
        .updateIn(['currentFilter', 'dateRange', 'custom'], bool => !bool)
        .setIn(['currentFilter', 'dateRange', 'preset'], '');
    case types.SET_DATE_RANGE_START:
      return state.setIn(['currentFilter', 'dateRange', 'start'], payload);
    case types.SET_DATE_RANGE_END:
      return state.setIn(['currentFilter', 'dateRange', 'end'], payload);
    case types.SET_SORTED_BY:
      return state.setIn(['currentFilter', 'sortBy'], payload);
    default:
      return state;
  }
};
