import { Record } from 'immutable';
import { Utils } from 'common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/profile');

export const types = {
  FETCH_PROFILE_REQUEST: ns('FETCH_PROFILE_REQUEST'),
  FETCH_PROFILE_SUCCESS: ns('FETCH_PROFILE_SUCCESS'),
  FETCH_PROFILE_FAILURE: ns('FETCH_PROFILE_FAILURE'),
  UPDATE_PROFILE_REQUEST: ns('UPDATE_PROFILE_REQUEST'),
  UPDATE_PROFILE_SUCCESS: ns('UPDATE_PROFILE_SUCCESS'),
};

export const actions = {
  fetchProfileRequest: withPayload(types.FETCH_PROFILE_REQUEST),
  fetchProfileSuccess: withPayload(types.FETCH_PROFILE_SUCCESS),
  fetchProfileFailure: withPayload(types.FETCH_PROFILE_FAILURE),
  updateProfileRequest: withPayload(types.UPDATE_PROFILE_REQUEST),
  updateProfileSuccess: withPayload(types.UPDATE_PROFILE_SUCCESS),
};

export const State = Record({
  data: null,
  error: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_PROFILE_REQUEST:
      return state.set('data', null).set('error', null);
    case types.FETCH_PROFILE_SUCCESS:
      return state.set('data', payload);
    case types.FETCH_PROFILE_FAILURE:
      return state.set('error', payload);
    case types.UPDATE_PROFILE_REQUEST:
      return state;
    case types.UPDATE_PROFILE_SUCCESS:
      return state.set('data', payload);
    default:
      return state;
  }
};
