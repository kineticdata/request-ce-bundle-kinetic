import { List, Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('discussions/data');

export const types = {
  FETCH_DISCUSSIONS_REQUEST: ns('FETCH_DISCUSSIONS_REQUEST'),
  FETCH_DISCUSSIONS_NEXT: ns('FETCH_DISCUSSIONS_NEXT'),
  FETCH_DISCUSSIONS_PREVIOUS: ns('FETCH_DISCUSSIONS_PREVIOUS'),
  FETCH_DISCUSSIONS_SUCCESS: ns('FETCH_DISCUSSIONS_SUCCESS'),
  FETCH_DISCUSSIONS_FAILURE: ns('FETCH_DISCUSSIONS_FAILURE'),
};

export const actions = {
  fetchDiscussionsRequest: withPayload(types.FETCH_DISCUSSIONS_REQUEST),
  fetchDiscussionsNext: noPayload(types.FETCH_DISCUSSIONS_NEXT),
  fetchDiscussionsPrevious: noPayload(types.FETCH_DISCUSSIONS_PREVIOUS),
  fetchDiscussionsSuccess: withPayload(types.FETCH_DISCUSSIONS_SUCCESS),
  fetchDiscussionsFailure: withPayload(types.FETCH_DISCUSSIONS_FAILURE),
};

export const State = Record({
  title: '',
  archived: false,
  dateRange: '30days',
  data: null,
  paging: false,
  pageSize: 10,
  pageToken: null,
  nextPageToken: null,
  previousPageTokens: List(),
  error: null,
});

export const reducer = (state = State(), { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_DISCUSSIONS_REQUEST:
      return state
        .update(
          'data',
          data =>
            payload.clear ||
            state.title !== payload.title ||
            state.archived !== payload.archived ||
            state.dateRange !== payload.dateRange
              ? null
              : data,
        )
        .set('title', payload.title)
        .set('archived', !!payload.archived)
        .set('dateRange', payload.dateRange)
        .set('error', null)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List());
    case types.FETCH_DISCUSSIONS_NEXT:
      return state
        .update('previousPageTokens', t => t.push(state.pageToken))
        .set('pageToken', state.nextPageToken)
        .set('nextPageToken', null)
        .set('paging', true);
    case types.FETCH_DISCUSSIONS_PREVIOUS:
      return state
        .set('nextPageToken', null)
        .set('pageToken', state.previousPageTokens.last())
        .update('previousPageTokens', t => t.pop())
        .set('paging', true);
    case types.FETCH_DISCUSSIONS_SUCCESS:
      return state
        .set('data', payload.data)
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_DISCUSSIONS_FAILURE:
      return state
        .set('data', null)
        .set('error', payload)
        .set('paging', false);
    default:
      return state;
  }
};
