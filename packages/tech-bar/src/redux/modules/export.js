import { Record, List } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('techbar/appointments');

export const types = {
  FETCH_EXPORT_SUBMISSIONS_REQUEST: ns('FETCH_EXPORT_SUBMISSIONS_REQUEST'),
  FETCH_EXPORT_SUBMISSIONS_SUCCESS: ns('FETCH_EXPORT_SUBMISSIONS_SUCCESS'),
  FETCH_EXPORT_SUBMISSIONS_FAILURE: ns('FETCH_EXPORT_SUBMISSIONS_FAILURE'),
  FETCH_EXPORT_SUBMISSIONS_COMPLETE: ns('FETCH_EXPORT_SUBMISSIONS_COMPLETE'),
};

export const actions = {
  fetchExportSubmissionsRequest: withPayload(
    types.FETCH_EXPORT_SUBMISSIONS_REQUEST,
  ),
  fetchExportSubmissionsSuccess: withPayload(
    types.FETCH_EXPORT_SUBMISSIONS_SUCCESS,
  ),
  fetchExportSubmissionsFailure: withPayload(
    types.FETCH_EXPORT_SUBMISSIONS_FAILURE,
  ),
  fetchExportSubmissionsComplete: noPayload(
    types.FETCH_EXPORT_SUBMISSIONS_COMPLETE,
  ),
};

export const State = Record({
  exporting: false,
  data: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_EXPORT_SUBMISSIONS_REQUEST:
      return state
        .set('data', List())
        .set('error', false)
        .set('exporting', true);
    case types.FETCH_EXPORT_SUBMISSIONS_SUCCESS:
      return state.update('data', data => data.push(...payload));
    case types.FETCH_EXPORT_SUBMISSIONS_FAILURE:
      return state.set('error', payload).set('exporting', false);
    case types.FETCH_EXPORT_SUBMISSIONS_COMPLETE:
      return state.set('exporting', false);
    default:
      return state;
  }
};
