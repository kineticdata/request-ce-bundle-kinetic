import { Record, List } from 'immutable';
import moment from 'moment';
import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('app');

export const types = {
  FETCH_APP_REQUEST: ns('FETCH_APP_REQUEST'),
  FETCH_APP_SUCCESS: ns('FETCH_APP_SUCCESS'),
  FETCH_APP_FAILURE: ns('FETCH_APP_FAILURE'),

  FETCH_SPACE_REQUEST: ns('FETCH_SPACE_REQUEST'),
  FETCH_SPACE_SUCCESS: ns('FETCH_SPACE_SUCCESS'),
  FETCH_SPACE_FAILURE: ns('FETCH_SPACE_FAILURE'),

  FETCH_KAPPS_REQUEST: ns('FETCH_KAPPS_REQUEST'),
  FETCH_KAPPS_SUCCESS: ns('FETCH_KAPPS_SUCCESS'),
  FETCH_KAPPS_FAILURE: ns('FETCH_KAPPS_FAILURE'),

  FETCH_PROFILE_REQUEST: ns('FETCH_PROFILE_REQUEST'),
  FETCH_PROFILE_SUCCESS: ns('FETCH_PROFILE_SUCCESS'),
  FETCH_PROFILE_FAILURE: ns('FETCH_PROFILE_FAILURE'),

  FETCH_LOCALE_META_REQUEST: ns('FETCH_LOCALE_META_REQUEST'),
  FETCH_LOCALE_META_SUCCESS: ns('FETCH_LOCALE_META_SUCCESS'),
  FETCH_LOCALE_META_FAILURE: ns('FETCH_LOCALE_META_FAILURE'),

  SET_USER_LOCALE: ns('SET_USER_LOCALE'),
  SET_KAPP_SLUG: ns('SET_KAPP_SLUG'),
  SET_CORE_VERSION: ns('SET_CORE_VERSION'),
};

export const actions = {
  fetchApp: withPayload(types.FETCH_APP_REQUEST),
  fetchAppSuccess: withPayload(types.FETCH_APP_SUCCESS),
  fetchAppFailure: withPayload(types.FETCH_APP_FAILURE),

  fetchSpaceRequest: noPayload(types.FETCH_SPACE_REQUEST),
  fetchSpaceSuccess: withPayload(types.FETCH_SPACE_SUCCESS),
  fetchSpaceFailure: withPayload(types.FETCH_SPACE_FAILURE),

  fetchKappsRequest: noPayload(types.FETCH_KAPPS_REQUEST),
  fetchKappsSuccess: withPayload(types.FETCH_KAPPS_SUCCESS),
  fetchKappsFailure: withPayload(types.FETCH_KAPPS_FAILURE),

  fetchProfileRequest: noPayload(types.FETCH_PROFILE_REQUEST),
  fetchProfileSuccess: withPayload(types.FETCH_PROFILE_SUCCESS),
  fetchProfileFailure: withPayload(types.FETCH_PROFILE_FAILURE),

  fetchLocaleMetaRequest: noPayload(types.FETCH_LOCALE_META_REQUEST),
  fetchLocaleMetaSuccess: withPayload(types.FETCH_LOCALE_META_SUCCESS),
  fetchLocaleMetaFailure: withPayload(types.FETCH_LOCALE_META_FAILURE),

  setUserLocale: withPayload(types.SET_USER_LOCALE),
  setKappSlug: withPayload(types.SET_KAPP_SLUG),
  setCoreVersion: withPayload(types.SET_CORE_VERSION),
};

export const State = Record({
  coreVersion: null,
  locales: null,
  timezones: null,
  locale: moment.locale(),
  space: null,
  kapp: null,
  kapps: List(),
  profile: null,
  errors: List(),
  kappSlug: null,
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_REQUEST:
      return state.set('errors', List());
    case types.FETCH_APP_SUCCESS:
      return state.set('errors', List()).set('loading', false);
    case types.FETCH_APP_FAILURE:
      return state
        .update('errors', errors => errors.push(payload))
        .set('loading', false);
    case types.FETCH_SPACE_SUCCESS:
      return state.set('space', payload);
    case types.FETCH_SPACE_FAILURE:
      return state.update('errors', errors => errors.push(payload));
    case types.FETCH_KAPPS_SUCCESS:
      return state
        .set('kapps', payload)
        .set('kapp', payload.find(kapp => kapp.slug === state.kappSlug));
    case types.FETCH_KAPPS_FAILURE:
      return state.update('errors', errors => errors.push(payload));
    case types.FETCH_PROFILE_SUCCESS:
      return state.set('profile', payload);
    case types.FETCH_PROFILE_FAILURE:
      return state.update('errors', errors => errors.push(payload));
    case types.FETCH_LOCALE_META_SUCCESS:
      return state
        .set('timezones', payload.timezones)
        .set('locales', payload.locales);
    case types.FETCH_LOCALE_META_FAILURE:
      return state.update('errors', errors => errors.push(payload));
    case types.SET_USER_LOCALE:
      return state.set('locale', payload || moment.locale());
    case types.SET_KAPP_SLUG:
      return state
        .set('kappSlug', payload)
        .set('kapp', state.kapps.find(kapp => kapp.slug === payload));
    case types.SET_CORE_VERSION:
      return state.set('coreVersion', payload);
    case LOCATION_CHANGE:
      const path = '/kapps/:kappSlug';
      const match = matchPath(payload.location.pathname, { path });
      const kappSlug = match && match.params.kappSlug;
      return state
        .set('kappSlug', kappSlug)
        .set('kapp', state.kapps.find(kapp => kapp.slug === kappSlug));
    default:
      return state;
  }
};
