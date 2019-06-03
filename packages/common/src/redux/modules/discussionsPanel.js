import { Record } from 'immutable';
import { namespaceBuilder, withPayload } from '../../utils';
const ns = namespaceBuilder('common/discussions');

export const types = {
  FETCH_RELATED_DISCUSSIONS_REQUEST: ns('FETCH_RELATED_DISCUSSIONS_REQUEST'),
  FETCH_RELATED_DISCUSSIONS_SUCCESS: ns('FETCH_RELATED_DISCUSSIONS_SUCCESS'),
};

export const actions = {
  fetchRelatedDiscussionsRequest: withPayload(
    types.FETCH_RELATED_DISCUSSIONS_REQUEST,
  ),
  fetchRelatedDiscussionsSuccess: withPayload(
    types.FETCH_RELATED_DISCUSSIONS_SUCCESS,
  ),
};

export const State = Record({
  type: null,
  key: null,
  relatedDiscussions: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_RELATED_DISCUSSIONS_REQUEST:
      return state
        .update(
          'relatedDiscussions',
          relatedDiscussions =>
            state.type !== payload.type || state.key !== payload.key
              ? null
              : relatedDiscussions,
        )
        .set('type', payload.type)
        .set('key', payload.key);
    case types.FETCH_RELATED_DISCUSSIONS_SUCCESS:
      return state.set('relatedDiscussions', payload);
    default:
      return state;
  }
};
