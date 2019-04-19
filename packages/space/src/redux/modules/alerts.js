import { Record } from 'immutable';
import * as Utils from 'common/src/utils';

const { namespace, noPayload, withPayload } = Utils;
const MODULE_NAME = 'alerts';

export const types = {
  FETCH_ALERTS_REQUEST: namespace(MODULE_NAME, 'FETCH_ALERTS_REQUEST'),
  FETCH_ALERTS_SUCCESS: namespace(MODULE_NAME, 'FETCH_ALERTS_SUCCESS'),
  FETCH_ALERTS_FAILURE: namespace(MODULE_NAME, 'FETCH_ALERTS_FAILURE'),
  DELETE_ALERT_REQUEST: namespace(MODULE_NAME, 'DELETE_ALERT_REQUEST'),
};

export const actions = {
  fetchAlerts: noPayload(types.FETCH_ALERTS_REQUEST),
  fetchAlertsSuccess: withPayload(types.FETCH_ALERTS_SUCCESS),
  fetchAlertsFailure: withPayload(types.FETCH_ALERTS_FAILURE),
  deleteAlert: noPayload(types.DELETE_ALERT_REQUEST),
};

export const State = Record({
  data: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ALERTS_SUCCESS:
      return state.set('error', null).set('data', payload);
    case types.FETCH_ALERTS_FAILURE:
      return state.set('error', payload).set('data', null);
    default:
      return state;
  }
};
