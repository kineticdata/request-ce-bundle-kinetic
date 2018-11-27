import { Record, Map, List } from 'immutable';
import { Utils } from 'common';
const { namespace, withPayload, noPayload } = Utils;

export const types = {
  FETCH_RELATED_DISCUSSIONS: namespace(
    'discussions',
    'FETCH_RELATED_DISCUSSIONS',
  ),
  SET_RELATED_DISCUSSIONS: namespace('discussions', 'SET_RELATED_DISCUSSIONS'),
  SET_SEARCH_ARCHIVED: namespace('discussions', 'SET_SEARCH_ARCHIVED'),
};

export const actions = {
  fetchRelatedDiscussions: withPayload(
    types.FETCH_RELATED_DISCUSSIONS,
    'type',
    'key',
    'loadCallback',
  ),
  setRelatedDiscussions: withPayload(types.SET_RELATED_DISCUSSIONS),
  setSearchArchived: withPayload(types.SET_SEARCH_ARCHIVED),
};

export const State = Record({
  loading: false,
  relatedDiscussions: List(),
  searchArchived: false,
  nextPageToken: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_RELATED_DISCUSSIONS:
      return state.set('relatedDiscussions', payload);
    case types.SET_SEARCH_ARCHIVED:
      return state.set('searchArchived', payload);
    default:
      return state;
  }
};
