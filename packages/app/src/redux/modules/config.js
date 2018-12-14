import { Record, List } from 'immutable';
import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';
import * as Utils from 'common/src/utils';
const { namespace, withPayload } = Utils;

export const types = {
  SET_VERSION: namespace('config', 'SET_APP'),
  SET_KAPP_SLUG: namespace('config', 'SET_KAPP_SLUG'),
  SET_LOCALE_METADATA: namespace('config', 'SET_LOCALE_METADATA'),
};

export const actions = {
  setVersion: withPayload(types.SET_VERSION),
  setKappSlug: withPayload(types.SET_KAPP_SLUG),
  setLocaleMetadata: withPayload(types.SET_LOCALE_METADATA),
};

export const State = Record({
  kappSlug: null,
  version: null,
  locales: List(),
  timezones: List(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_VERSION:
      return state.set('version', payload.version);
    case LOCATION_CHANGE:
      const path = '/kapps/:kappSlug';
      const match = matchPath(payload.location.pathname, { path });
      return state.set('kappSlug', match && match.params.kappSlug);
    case types.SET_KAPP_SLUG:
      return state.set('kappSlug', payload);
    case types.SET_LOCALE_METADATA:
      return state
        .set('locales', List(payload.locales))
        .set('timezones', payload.timezones);
    default:
      return state;
  }
};
