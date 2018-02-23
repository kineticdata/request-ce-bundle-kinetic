import { Record, List, Map } from 'immutable';
import { namespace, noPayload, withPayload } from 'common/utils';

export const types = {
  LOAD_APP: namespace('app', 'LOAD_APP'),
  SET_APP: namespace('app', 'SET_APP'),
};

export const actions = {
  loadApp: noPayload(types.LOAD_APP),
  setApp: withPayload(types.SET_APP),
};

// TODO: We use immutable.Map for default state here but it doesn't look like
// we use that type when the actual data is present.
export const State = Record({
  space: Map(),
  kapps: List(),
  profile: Map(),
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_APP:
      return state
        .set('space', payload.space)
        .set('kapps', payload.kapps)
        .set('profile', payload.profile)
        .set('loading', false);
    default:
      return state;
  }
};
