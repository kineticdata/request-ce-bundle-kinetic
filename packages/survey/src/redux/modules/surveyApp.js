import { Record, List } from 'immutable';
import { Utils } from 'common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('survey/app');

export const types = {
  FETCH_APP_DATA_REQUEST: ns('FETCH_APP_DATA_REQUEST'),
  FETCH_APP_DATA_SUCCESS: ns('FETCH_APP_DATA_SUCCESS'),
  FETCH_APP_DATA_FAILURE: ns('FETCH_APP_DATA_FAILURE'),
};

export const actions = {
  fetchAppDataRequest: withPayload(types.FETCH_APP_DATA_REQUEST),
  fetchAppDataSuccess: withPayload(types.FETCH_APP_DATA_SUCCESS),
  fetchAppDataFailure: withPayload(types.FETCH_APP_DATA_FAILURE),
};

export const State = Record({
  loading: true,
  error: null,
  forms: null,
});

const surveyAppReducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_DATA_REQUEST:
      return state.set('error', null);
    case types.FETCH_APP_DATA_SUCCESS:
      return state.set('forms', List(payload.forms)).set('loading', false);
    case types.FETCH_APP_DATA_FAILURE:
      return state.set('error', payload);
    default:
      return state;
  }
};

export default surveyAppReducer;
