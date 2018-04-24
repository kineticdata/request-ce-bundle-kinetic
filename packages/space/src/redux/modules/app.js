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
  SET_DISCUSSIONS_LIMIT: namespace('app', 'SET_DISCUSSIONS_LIMIT'),
  SET_DISCUSSIONS_OFFSET: namespace('app', 'SET_DISCUSSIONS_OFFSET'),
  SET_DISCUSSIONS_SEARCH_TERM: namespace('app', 'SET_DISCUSSIONS_SEARCH_TERM'),
  SET_DISCUSSIONS_SEARCH_INPUT_VALUE: namespace(
    'app',
    'SET_DISCUSSIONS_SEARCH_INPUT_VALUE',
  ),
  CREATE_DISCUSSION: namespace('app', 'CREATE_DISCUSSION'),
  DELETE_ALERT: namespace('app', 'DELETE_ALERT'),
  SET_SETTINGS_BACK_PATH: namespace('app', 'SET_SETTINGS_BACK_PATH'),
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
  setDiscussionsLimit: withPayload(types.SET_DISCUSSIONS_LIMIT),
  setDiscussionsOffset: withPayload(types.SET_DISCUSSIONS_OFFSET),
  setDiscussionsSearchTerm: withPayload(types.SET_DISCUSSIONS_SEARCH_TERM),
  setDiscussionsSearchInputValue: withPayload(
    types.SET_DISCUSSIONS_SEARCH_INPUT_VALUE,
  ),
  createDiscussion: withPayload(types.CREATE_DISCUSSION),
  deleteAlert: withPayload(types.DELETE_ALERT),
  setSettingsBackPath: withPayload(types.SET_SETTINGS_BACK_PATH),
};

export const selectServerUrl = state =>
  state.kinops.space && `/${state.kinops.space.slug}/kinetic-response`;

export const selectIsMoreDiscussions = state =>
  state.app.discussions.size === state.app.discussionsLimit;

export const selectGroupedDiscussions = state =>
  state.app.discussions
    .sort(
      (s1, s2) =>
        moment(s1.messages_updated_at).isBefore(s2.messages_updated_at)
          ? 1
          : moment(s1.messages_updated_at).isAfter(s2.messages_updated_at)
            ? -1
            : 0,
    )
    .groupBy(discussion => moment(discussion.messages_updated_at).fromNow());

export const State = Record({
  appLoading: true,
  discussionServerUrl: '',
  discussions: List(),
  discussionsLimit: 10,
  discussionsOffset: 0,
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
        .set('discussions', List(payload))
        .set('discussionsError', null)
        .set('discussionsLoading', false);
    case types.SET_DISCUSSIONS_ERROR:
      return state
        .set('discussions', List())
        .set('discussionsError', payload)
        .set('discussionsLoading', false);
    case types.SET_DISCUSSIONS_LIMIT:
      return state.set('discussionsLimit', payload);
    case types.SET_DISCUSSIONS_OFFSET:
      return state.set('discussionsOffset', payload);
    case types.SET_DISCUSSIONS_SEARCH_INPUT_VALUE:
      return state.set('discussionsSearchInputValue', payload);
    case types.SET_DISCUSSIONS_SEARCH_TERM:
      return state.set('discussionsSearchTerm', payload);
    case types.SET_SETTINGS_BACK_PATH:
      return state.set('settingsBackPath', payload);
    default:
      return state;
  }
};
