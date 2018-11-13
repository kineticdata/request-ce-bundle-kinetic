import { Record, List } from 'immutable';
import { Utils } from 'common';
import moment from 'moment';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_APP_SETTINGS: namespace('app', 'FETCH_APP_SETTINGS'),
  SET_APP_SETTINGS: namespace('app', 'SET_APP_SETTINGS'),
  SET_SIDEBAR_OPEN: namespace('app', 'SET_SIDEBAR_OPEN'),
  FETCH_DISCUSSIONS: namespace('app', 'FETCH_DISCUSSIONS'),
  SEARCH_DISCUSSIONS: namespace('app', 'SEARCH_DISCUSSIONS'),
  SET_CREATE_DISCUSSION_MODAL_OPEN: namespace(
    'app',
    'SET_CREATE_DISCUSSION_MODAL_OPEN',
  ),
  SET_DISCUSSIONS: namespace('app', 'SET_DISCUSSIONS'),
  SET_DISCUSSIONS_ERROR: namespace('app', 'SET_DISCUSSIONS_ERROR'),
  CLEAR_DISCUSSION_PAGE_TOKENS: namespace(
    'app',
    'CLEAR_DISCUSSION_PAGE_TOKENS',
  ),
  PUSH_DISCUSSION_PAGE_TOKEN: namespace('app', 'PUSH_DISCUSSION_PAGE_TOKEN'),
  POP_DISCUSSION_PAGE_TOKEN: namespace('app', 'POP_DISCUSSION_PAGE_TOKEN'),
  SET_DISCUSSIONS_PAGE_TOKEN: namespace('app', 'SET_DISCUSSIONS_PAGE_TOKEN'),
  SET_DISCUSSIONS_SEARCH_TERM: namespace('app', 'SET_DISCUSSIONS_SEARCH_TERM'),
  SET_DISCUSSIONS_SEARCH_INPUT_VALUE: namespace(
    'app',
    'SET_DISCUSSIONS_SEARCH_INPUT_VALUE',
  ),
  DELETE_ALERT: namespace('app', 'DELETE_ALERT'),
  SET_SETTINGS_BACK_PATH: namespace('app', 'SET_SETTINGS_BACK_PATH'),
  TOGGLE_HEADER_DROPDOWN: namespace('app', 'TOGGLE_HEADER_DROPDOWN'),
  TOGGLE_SHOWING_ARCHIVED: namespace('app', 'TOGGLE_SHOWING_ARCHIVED'),
  OPEN_DATE_RANGE_DROPDOWN: namespace('app', 'OPEN_DATE_RANGE_DROPDOWN'),
  RESET_DATE_RANGE_DROPDOWN: namespace('app', 'RESET_DATE_RANGE_DROPDOWN'),
  SUBMIT_DATE_RANGE_DROPDOWN: namespace('app', 'SUBMIT_DATE_RANGE_DROPDOWN'),
  SET_SEARCH_DATE_RANGE: namespace('app', 'SET_SEARCH_DATE_RANGE'),
};

export const actions = {
  fetchAppSettings: noPayload(types.FETCH_APP_SETTINGS),
  setAppSettings: withPayload(types.SET_APP_SETTINGS),
  setSidebarOpen: withPayload(types.SET_SIDEBAR_OPEN),
  fetchDiscussions: noPayload(types.FETCH_DISCUSSIONS),
  searchDiscussions: withPayload(types.SEARCH_DISCUSSIONS),
  setCreateDiscussionModalOpen: withPayload(
    types.SET_CREATE_DISCUSSION_MODAL_OPEN,
  ),
  setDiscussions: withPayload(types.SET_DISCUSSIONS),
  setDiscussionsError: withPayload(types.SET_DISCUSSIONS_ERROR),
  setDiscussionsPageToken: withPayload(types.SET_DISCUSSIONS_PAGE_TOKEN),
  clearDiscussionPageTokens: noPayload(types.CLEAR_DISCUSSION_PAGE_TOKENS),
  pushDiscussionPageToken: withPayload(types.PUSH_DISCUSSION_PAGE_TOKEN),
  popDiscussionPageToken: withPayload(types.POP_DISCUSSION_PAGE_TOKEN),
  setDiscussionsSearchTerm: withPayload(types.SET_DISCUSSIONS_SEARCH_TERM),
  setDiscussionsSearchInputValue: withPayload(
    types.SET_DISCUSSIONS_SEARCH_INPUT_VALUE,
  ),
  deleteAlert: withPayload(types.DELETE_ALERT),
  setSettingsBackPath: withPayload(types.SET_SETTINGS_BACK_PATH),
  toggleHeaderDropdown: noPayload(types.TOGGLE_HEADER_DROPDOWN),
  toggleShowingArchived: noPayload(types.TOGGLE_SHOWING_ARCHIVED),
  openDateRangeDropdown: noPayload(types.OPEN_DATE_RANGE_DROPDOWN),
  resetDateRangeDropdown: noPayload(types.RESET_DATE_RANGE_DROPDOWN),
  submitDateRangeDropdown: noPayload(types.SUBMIT_DATE_RANGE_DROPDOWN),
  setSearchDateRange: withPayload(types.SET_SEARCH_DATE_RANGE),
};

export const selectHasSharedTaskEngine = state =>
  state.app.loading
    ? false
    : Utils.getAttributeValue(state.app.space, 'Task Server Url', '').includes(
        'shared',
      ) ||
      Utils.getAttributeValue(state.app.space, 'Shared Workflow Engine', '')
        .downcase === 'true'
      ? true
      : false;

const validateDateRange = dateRange => {
  const result = [];
  if (typeof dateRange === 'object') {
    if (dateRange.start === '') {
      result.push({ field: 'start', error: 'Start Date is required' });
    }
    if (dateRange.end !== '' && dateRange.end <= dateRange.start) {
      result.push({
        field: 'end',
        error: 'End Date must be after Start Date',
      });
    }
  }
  return result;
};

export const State = Record({
  appLoading: true,
  discussionServerUrl: '',
  discussions: List(),
  discussionsPageToken: null,
  discussionsPageTokens: List(),
  discussionsError: null,
  discussionsLoading: true,
  discussionsSearchTerm: '',
  discussionsSearchInputValue: '',
  isCreateDiscussionModalOpen: false,
  sidebarOpen: true,
  spaceAdmins: List(),
  userAttributeDefinitions: {},
  userProfileAttributeDefinitions: {},
  settingsBackPath: null,
  headerDropdownOpen: false,
  showingArchived: false,
  dateRangeDropdownOpen: false,
  searchDateRange: '30days',
  dirtySearchDateRange: '30days',
  searchDateRangeValidations: [],
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_SETTINGS:
      return state.set('appLoading', true);
    case types.SET_APP_SETTINGS:
      return state
        .set('spaceAdmins', List(payload.spaceAdmins))
        .set('userAttributeDefinitions', payload.userAttributeDefinitions)
        .set(
          'userProfileAttributeDefinitions',
          payload.userProfileAttributeDefinitions,
        )
        .set('appLoading', false);
    case types.SET_SIDEBAR_OPEN:
      return state.set('sidebarOpen', payload);
    case types.SET_CREATE_DISCUSSION_MODAL_OPEN:
      return state.set('isCreateDiscussionModalOpen', payload);
    case types.SEARCH_DISCUSSIONS:
      return state.set('discussionsLoading', true);
    case types.SET_DISCUSSIONS:
      return state
        .set('discussions', payload)
        .set('discussionsError', null)
        .set('discussionsLoading', false);
    case types.SET_DISCUSSIONS_ERROR:
      return state
        .set('discussions', List())
        .set('discussionsError', payload)
        .set('discussionsLoading', false);
    case types.SET_DISCUSSIONS_PAGE_TOKEN:
      return state.set('discussionsPageToken', payload);
    case types.CLEAR_DISCUSSION_PAGE_TOKENS:
      return state.set('discussionsPageTokens', List());
    case types.PUSH_DISCUSSION_PAGE_TOKEN:
      return state.update('discussionsPageTokens', pt => pt.push(payload));
    case types.POP_DISCUSSION_PAGE_TOKEN: {
      return state.update('discussionsPageTokens', pt => {
        const target = pt.indexOf(payload);
        if (target === -1) {
          return List();
        }

        return pt.slice(0, pt.indexOf(payload) + 1);
      });
    }
    case types.SET_DISCUSSIONS_SEARCH_INPUT_VALUE:
      return state.set('discussionsSearchInputValue', payload);
    case types.SET_DISCUSSIONS_SEARCH_TERM:
      return state.set('discussionsSearchTerm', payload);
    case types.SET_SETTINGS_BACK_PATH:
      return state.set('settingsBackPath', payload);
    case types.TOGGLE_HEADER_DROPDOWN:
      return state.update('headerDropdownOpen', boolean => !boolean);
    case types.TOGGLE_SHOWING_ARCHIVED:
      return state
        .update('showingArchived', boolean => !boolean)
        .set('headerDropdownOpen', false);
    case types.OPEN_DATE_RANGE_DROPDOWN:
      return state.set('dateRangeDropdownOpen', true);
    case types.RESET_DATE_RANGE_DROPDOWN:
      return state
        .set('dateRangeDropdownOpen', false)
        .set('dirtySearchDateRange', state.get('searchDateRange'))
        .set('searchDateRangeValidations', []);
    case types.SUBMIT_DATE_RANGE_DROPDOWN:
      return state
        .set('dateRangeDropdownOpen', false)
        .set('searchDateRange', state.get('dirtySearchDateRange'));
    case types.SET_SEARCH_DATE_RANGE:
      return state
        .set('dirtySearchDateRange', payload)
        .set('searchDateRangeValidations', validateDateRange(payload));
    default:
      return state;
  }
};
