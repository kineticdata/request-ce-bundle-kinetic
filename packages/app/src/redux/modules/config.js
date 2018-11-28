import { Record } from 'immutable';
import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';
import moment from 'moment';
import * as Utils from 'common/src/utils';
const { namespace, withPayload } = Utils;

export const types = {
  SET_VERSION: namespace('config', 'SET_APP'),
  SET_KAPP_SLUG: namespace('config', 'SET_KAPP_SLUG'),
  SET_LOCALE: namespace('config', 'SET_LOCALE'),
};

export const actions = {
  setVersion: withPayload(types.SET_VERSION),
  setKappSlug: withPayload(types.SET_KAPP_SLUG),
  setLocale: withPayload(types.SET_LOCALE),
};

export const State = Record({
  kappSlug: null,
  version: null,
  locale: moment.locale(),
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
    case types.SET_LOCALE:
      return state.set('locale', payload || moment.locale());
    default:
      return state;
  }
};
