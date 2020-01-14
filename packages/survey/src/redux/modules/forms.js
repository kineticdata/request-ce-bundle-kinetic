import { List, Record } from 'immutable';
import { Form } from '../../models';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('survey/forms');

export const types = {
  FETCH_FORMS_REQUEST: ns('FETCH_FORMS_REQUEST'),
  FETCH_FORMS_NEXT: ns('FETCH_FORMS_NEXT'),
  FETCH_FORMS_PREVIOUS: ns('FETCH_FORMS_PREVIOUS'),
  FETCH_FORMS_SUCCESS: ns('FETCH_FORMS_SUCCESS'),
  FETCH_FORMS_FAILURE: ns('FETCH_FORMS_FAILURE'),
};

export const actions = {
  fetchFormsRequest: withPayload(types.FETCH_FORMS_REQUEST),
  fetchFormsNext: noPayload(types.FETCH_FORMS_NEXT),
  fetchFormsPrevious: noPayload(types.FETCH_FORMS_PREVIOUS),
  fetchFormsSuccess: withPayload(types.FETCH_FORMS_SUCCESS),
  fetchFormsFailure: withPayload(types.FETCH_FORMS_FAILURE),
};

export const State = Record({
  error: null,
  data: null,
  limit: 10,
  paging: false,
  pageToken: null,
  nextPageToken: null,
  previousPageTokens: List(),
});

const reducer = (state = State(), { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_FORMS_REQUEST:
      return state
        .set('data', null)
        .set('error', null)
        .set('limit', (payload && payload.limit) || 10)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List());
    case types.FETCH_FORMS_NEXT:
      return state
        .update('previousPageTokens', t => t.push(state.pageToken))
        .set('pageToken', state.nextPageToken)
        .set('nextPageToken', null)
        .set('paging', true);
    case types.FETCH_FORMS_PREVIOUS:
      return state
        .set('nextPageToken', null)
        .set('pageToken', state.previousPageTokens.last())
        .update('previousPageTokens', t => t.pop())
        .set('paging', true);
    case types.FETCH_FORMS_SUCCESS:
      return state
        .set('data', List(payload.forms).map(Form))
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_FORMS_FAILURE:
      return state.set('error', payload).set('paging', false);
    default:
      return state;
  }
};

export default reducer;
