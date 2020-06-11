import { Record } from 'immutable';
import * as Utils from 'common/src/utils';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/alerts');

export const types = {
  FETCH_ALERTS_REQUEST: ns('FETCH_ALERTS_REQUEST'),
  FETCH_ALERTS_SUCCESS: ns('FETCH_ALERTS_SUCCESS'),
  FETCH_ALERTS_FAILURE: ns('FETCH_ALERTS_FAILURE'),
  DELETE_ALERT_REQUEST: ns('DELETE_ALERT_REQUEST'),
};

export const actions = {
  fetchAlertsRequest: noPayload(types.FETCH_ALERTS_REQUEST),
  fetchAlertsSuccess: withPayload(types.FETCH_ALERTS_SUCCESS),
  fetchAlertsFailure: withPayload(types.FETCH_ALERTS_FAILURE),
  deleteAlertRequest: withPayload(types.DELETE_ALERT_REQUEST),
};

export const State = Record({
  data: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ALERTS_REQUEST:
      return state.set('error', null).set('data', null);
    case types.FETCH_ALERTS_SUCCESS:
      return state.set('error', null).set('data', payload);
    case types.FETCH_ALERTS_FAILURE:
      return state.set('error', payload).set('data', null);
    default:
      return state;
  }
};
