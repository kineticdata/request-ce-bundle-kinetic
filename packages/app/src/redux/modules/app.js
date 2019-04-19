import { Record, List } from 'immutable';
import moment from 'moment';
import * as Utils from 'common/src/utils';

const { namespace, noPayload, withPayload } = Utils;
const MODULE_NAME = 'app';

export const types = {
  FETCH_APP_REQUEST: namespace(MODULE_NAME, 'FETCH_APP_REQUEST'),
  FETCH_APP_SUCCESS: namespace(MODULE_NAME, 'FETCH_APP_SUCCESS'),
  FETCH_APP_FAILURE: namespace(MODULE_NAME, 'FETCH_APP_FAILURE'),

  FETCH_SPACE_REQUEST: namespace(MODULE_NAME, 'FETCH_SPACE_REQUEST'),
  FETCH_SPACE_SUCCESS: namespace(MODULE_NAME, 'FETCH_SPACE_SUCCESS'),
  FETCH_SPACE_FAILURE: namespace(MODULE_NAME, 'FETCH_SPACE_FAILURE'),

  FETCH_KAPPS_REQUEST: namespace(MODULE_NAME, 'FETCH_KAPPS_REQUEST'),
  FETCH_KAPPS_SUCCESS: namespace(MODULE_NAME, 'FETCH_KAPPS_SUCCESS'),
  FETCH_KAPPS_FAILURE: namespace(MODULE_NAME, 'FETCH_KAPPS_FAILURE'),

  FETCH_PROFILE_REQUEST: namespace(MODULE_NAME, 'FETCH_PROFILE_REQUEST'),
  FETCH_PROFILE_SUCCESS: namespace(MODULE_NAME, 'FETCH_PROFILE_SUCCESS'),
  FETCH_PROFILE_FAILURE: namespace(MODULE_NAME, 'FETCH_PROFILE_FAILURE'),

  FETCH_LOCALE_META_REQUEST: namespace(
    MODULE_NAME,
    'FETCH_LOCALE_META_REQUEST',
  ),
  FETCH_LOCALE_META_SUCCESS: namespace(
    MODULE_NAME,
    'FETCH_LOCALE_META_SUCCESS',
  ),
  FETCH_LOCALE_META_FAILURE: namespace(
    MODULE_NAME,
    'FETCH_LOCALE_META_FAILURE',
  ),
  SET_USER_LOCALE: namespace(MODULE_NAME, 'SET_USER_LOCALE'),
  SET_KAPP_SLUG: namespace(MODULE_NAME, 'SET_USER_LOCALE'),
  SET_CORE_VERSION: namespace(MODULE_NAME, 'SET_CORE_VERSION'),
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
  kapps: null,
  profile: null,
  errors: List(),
  kappSlug: null,
  loading: true,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_REQUEST:
      return state.set('errors', List()).set('loading', true);
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
      return state.set('kapps', payload);
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
      return state.set('kappSlug', payload);
    case types.SET_CORE_VERSION:
      return state.set('coreVersion', payload);
    default:
      return state;
  }
};
