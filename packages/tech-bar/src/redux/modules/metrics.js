import { Record, List } from 'immutable';
import { Utils } from 'common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('techbar/metrics');

export const types = {
  FETCH_METRICS_REQUEST: ns('FETCH_METRICS_REQUEST'),
  FETCH_METRICS_SUCCESS: ns('FETCH_METRICS_SUCCESS'),
  FETCH_METRICS_FAILURE: ns('FETCH_METRICS_FAILURE'),
  FETCH_METRICS_RESET: ns('FETCH_METRICS_RESET'),
};

export const actions = {
  fetchMetricsRequest: withPayload(types.FETCH_METRICS_REQUEST),
  fetchMetricsSuccess: withPayload(types.FETCH_METRICS_SUCCESS),
  fetchMetricsFailure: withPayload(types.FETCH_METRICS_FAILURE),
  fetchMetricsReset: withPayload(types.FETCH_METRICS_RESET),
};

export const MetricsData = object => {
  try {
    return {
      schedulerId: object.values['Scheduler Id'],
      periodType: object.values['Period Type'],
      period: object.values['Period'],
      data: JSON.parse(object.values['Data']),
    };
  } catch (e) {
    console.warn(
      'Fetched Metrics record is invalid. Please contact an administrator.',
    );
    return null;
  }
};

export const State = Record({
  data: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_METRICS_REQUEST:
      return state.set('error', null).set('data', null);
    case types.FETCH_METRICS_SUCCESS:
      return state.set(
        'data',
        List(payload.map(submission => MetricsData(submission)).filter(d => d)),
      );
    case types.FETCH_METRICS_FAILURE:
      return state.set('error', payload);
    case types.FETCH_METRICS_RESET:
      return state.set('data', null).set('error', null);
    default:
      return state;
  }
};
