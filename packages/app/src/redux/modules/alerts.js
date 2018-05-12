import { Record, List } from 'immutable';
import * as Utils from 'common/src/utils';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  FETCH_ALERTS: namespace('alerts', 'FETCH_ALERTS'),
  SET_ALERTS: namespace('alerts', 'SET_ALERTS'),
  SET_ALERTS_ERROR: namespace('alerts', 'SET_ALERTS_ERROR'),
};

export const actions = {
  fetchAlerts: noPayload(types.FETCH_ALERTS),
  setAlerts: withPayload(types.SET_ALERTS),
  setAlertsError: withPayload(types.SET_ALERTS_ERROR),
};

export const State = Record({
  loading: true,
  data: List(),
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ALERTS:
      return state.set('loading', true);
    case types.SET_ALERTS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('data', payload);
    case types.SET_ALERTS_ERROR:
      return state.set('loading', false).set('error', payload);
    default:
      return state;
  }
};
