import { Record, List } from 'immutable';
import { Utils } from 'common';
const { namespace, noPayload, withPayload } = Utils;

export const METRICS_FORM_SLUG = 'tech-bar-metrics';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const MONTH_FORMAT = 'YYYY-MM';

export const types = {
  FETCH_METRICS: namespace('techBarMetrics', 'FETCH_METRICS'),
  SET_METRICS: namespace('techBarMetrics', 'SET_METRICS'),
  SET_METRICS_ERRORS: namespace('techBarMetrics', 'SET_METRICS_ERRORS'),
};

export const actions = {
  fetchMetrics: withPayload(types.FETCH_METRICS),
  setMetrics: withPayload(types.SET_METRICS),
  setMetricsErrors: withPayload(types.SET_METRICS_ERRORS),
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
  loading: true,
  errors: [],
  metrics: new List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_METRICS:
      return state.set('loading', true);
    case types.SET_METRICS:
      return state
        .set(
          'metrics',
          List(
            payload.map(submission => MetricsData(submission)).filter(d => d),
          ),
        )
        .set('loading', false);
    case types.SET_METRICS_ERRORS:
      return state
        .set('errors', payload)
        .set('metrics', new List())
        .set('loading', false);
    default:
      return state;
  }
};
