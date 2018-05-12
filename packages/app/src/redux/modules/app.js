import { Record, List, Map } from 'immutable';
import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';
import * as Utils from 'common/src/utils';
const { namespace, noPayload, withPayload } = Utils;

export const types = {
  LOAD_APP: namespace('app', 'LOAD_APP'),
  SET_APP: namespace('app', 'SET_APP'),
  SET_KAPP_SLUG: namespace('app', 'SET_KAPP_SLUG'),
};

export const actions = {
  loadApp: noPayload(types.LOAD_APP),
  setApp: withPayload(types.SET_APP),
  setKappSlug: withPayload(types.SET_KAPP_SLUG),
};

// TODO: We use immutable.Map for default state here but it doesn't look like
// we use that type when the actual data is present.
export const State = Record({
  space: Map(),
  kapps: List(),
  profile: Map(),
  loading: true,
  kappSlug: null,
  version: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_APP:
      return state
        .set('space', payload.space)
        .set('kapps', payload.kapps)
        .set('profile', payload.profile)
        .set('version', payload.version)
        .set('loading', false);
    case LOCATION_CHANGE:
      const path = '/kapps/:kappSlug';
      const match = matchPath(payload.location.pathname, { path });
      return state.set('kappSlug', match && match.params.kappSlug);
    case types.SET_KAPP_SLUG:
      return state.set('kappSlug', payload);
    default:
      return state;
  }
};
