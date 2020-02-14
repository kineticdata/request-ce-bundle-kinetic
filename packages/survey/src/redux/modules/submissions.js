import { List, Record } from 'immutable';
import { Utils } from 'common';
import * as constants from '../../constants';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('survey/submissions');

export const types = {
  FETCH_SUBMISSIONS_REQUEST: ns('FETCH_SUBMISSIONS_REQUEST'),
  FETCH_SUBMISSIONS_NEXT: ns('FETCH_SUBMISSIONS_NEXT'),
  FETCH_SUBMISSIONS_PREVIOUS: ns('FETCH_SUBMISSIONS_PREVIOUS'),
  FETCH_SUBMISSIONS_CURRENT: ns('FETCH_SUBMISSIONS_CURRENT'),
  FETCH_SUBMISSIONS_SUCCESS: ns('FETCH_SUBMISSIONS_SUCCESS'),
  FETCH_SUBMISSIONS_FAILURE: ns('FETCH_SUBMISSIONS_FAILURE'),
};

export const actions = {
  fetchSubmissionsRequest: withPayload(types.FETCH_SUBMISSIONS_REQUEST),
  fetchSubmissionsNext: noPayload(types.FETCH_SUBMISSIONS_NEXT),
  fetchSubmissionsPrevious: noPayload(types.FETCH_SUBMISSIONS_PREVIOUS),
  fetchSubmissionsCurrent: noPayload(types.FETCH_SUBMISSIONS_CURRENT),
  fetchSubmissionsSuccess: withPayload(types.FETCH_SUBMISSIONS_SUCCESS),
  fetchSubmissionsFailure: withPayload(types.FETCH_SUBMISSIONS_FAILURE),

  fetchSubmissions: coreState => ({
    type: types.FETCH_SUBMISSIONS,
    payload: { coreState },
  }),
  fetchNextPage: coreState => ({
    type: types.FETCH_NEXT_PAGE,
    payload: { coreState },
  }),
  fetchPreviousPage: coreState => ({
    type: types.FETCH_PREVIOUS_PAGE,
    payload: { coreState },
  }),
  fetchCurrentPage: coreState => ({
    type: types.FETCH_CURRENT_PAGE,
    payload: { coreState },
  }),
  setSubmissions: (submissions, nextPageToken) => ({
    type: types.SET_SUBMISSIONS,
    payload: { submissions, nextPageToken },
  }),
};

export const State = Record({
  error: null,
  data: null,
  coreState: null,
  limit: constants.PAGE_SIZE,
  paging: false,
  pageToken: null,
  nextPageToken: null,
  previousPageTokens: List(),
});

const reducer = (state = State(), { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_SUBMISSIONS_REQUEST:
      return state
        .set('data', null)
        .set('error', null)
        .set('coreState', payload.coreState)
        .set('limit', payload.limit || constants.PAGE_SIZE)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List());
    case types.FETCH_SUBMISSIONS_NEXT:
      return state
        .update('previousPageTokens', t => t.push(state.pageToken))
        .set('pageToken', state.nextPageToken)
        .set('nextPageToken', null)
        .set('paging', true);
    case types.FETCH_SUBMISSIONS_PREVIOUS:
      return state
        .set('nextPageToken', null)
        .set('pageToken', state.previousPageTokens.last())
        .update('previousPageTokens', t => t.pop())
        .set('paging', true);
    case types.FETCH_SUBMISSIONS_CURRENT:
      return state.set('paging', true);
    case types.FETCH_SUBMISSIONS_SUCCESS:
      return state
        .set('data', List(payload.submissions))
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_SUBMISSIONS_FAILURE:
      return state.set('error', payload).set('paging', false);
    default:
      return state;
  }
};

export default reducer;
