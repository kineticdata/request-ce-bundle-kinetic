import { Record, List } from 'immutable';
import { namespace, withPayload } from '../../utils';

export const types = {
  FETCH_RELATED_DISCUSSIONS: namespace(
    'discussions',
    'FETCH_RELATED_DISCUSSIONS',
  ),
  SET_RELATED_DISCUSSIONS: namespace('discussions', 'SET_RELATED_DISCUSSIONS'),
};

export const actions = {
  fetchRelatedDiscussions: withPayload(
    types.FETCH_RELATED_DISCUSSIONS,
    'type',
    'key',
    'loadCallback',
  ),
  setRelatedDiscussions: withPayload(types.SET_RELATED_DISCUSSIONS),
};

export const State = Record({
  loading: false,
  relatedDiscussions: List(),
  nextPageToken: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_RELATED_DISCUSSIONS:
      return state.set('relatedDiscussions', payload);
    default:
      return state;
  }
};
