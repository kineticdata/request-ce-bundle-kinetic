import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import axios from 'axios';
import {
  bundle,
  fetchVersion,
  fetchProfile,
  fetchDefaultLocale,
} from 'react-kinetic-lib';
import {
  actions as configActions,
  types as configTypes,
} from '../modules/config';
import { actions as kappActions } from '../modules/kapps';
import {
  actions as loadingActions,
  types as loadingTypes,
} from '../modules/loading';
import { actions as profileActions } from '../modules/profile';
import { actions as spaceActions } from '../modules/space';
import { importLocale, searchHistoryActions, Utils } from 'common';

import semver from 'semver';

const MINIMUM_CE_VERSION = '2.0.2';
const MINIMUM_TRANSLATIONS_CE_VERSION = '2.3.0';

// Fetch Entire App
export function* fetchAppTask({ payload }) {
  const { version } = yield call(fetchVersion);
  const initialLoad = payload;
  // Check to make sure the version is compatible with this bundle.
  if (
    semver.satisfies(semver.coerce(version.version), `>=${MINIMUM_CE_VERSION}`)
  ) {
    const { profile } = yield call(fetchProfile, {
      include:
        'attributes,profileAttributes,profileAttributesMap,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user,attributes,space,space.details,space.attributes,space.attributesMap,space.kapps,space.kapps.attributes',
    });

    const space = Map(profile.space)
      .delete('kapps')
      .toJS();
    const kapps = profile.space.kapps;
    const me = Map(profile)
      .delete('space')
      .toJS();

    yield all([
      put(configActions.setVersion(version)),
      put(kappActions.setKapps(kapps)),
      put(profileActions.setProfile(me)),
      put(spaceActions.setSpace(space)),
      ...kapps.map(kapp => {
        return put(
          searchHistoryActions.enableSearchHistory({
            kappSlug: kapp.slug,
            value: Utils.getAttributeValue(kapp, 'Record Search History', ''),
          }),
        );
      }),
    ]);
    const defaultKappDisplaySpace =
      profile.space.attributesMap &&
      profile.space.attributesMap['Default Kapp Display'] &&
      profile.space.attributesMap['Default Kapp Display'].length > 0
        ? profile.space.attributesMap['Default Kapp Display'][0]
        : undefined;
    const defaultKappDisplayProfile =
      profile.space.attributesMap &&
      profile.profileAttributesMap['Default Kapp Display'] &&
      profile.profileAttributesMap['Default Kapp Display'].length > 0
        ? profile.profileAttributesMap['Default Kapp Display'][0]
        : undefined;

    // Preload locale before displaying the app to get rid of flicker
    // Set locale in config
    if (me.preferredLocale) {
      importLocale(me.preferredLocale);
      yield put(configActions.setLocale(me.preferredLocale));
    } else if (
      semver.satisfies(
        semver.coerce(version.version),
        `>=${MINIMUM_TRANSLATIONS_CE_VERSION}`,
      )
    ) {
      const { defaultLocale } = yield call(fetchDefaultLocale);
      importLocale((defaultLocale && defaultLocale.code) || 'en');
      yield put(configActions.setLocale(defaultLocale && defaultLocale.code));
    }

    const currentRoute = yield select(state => state.router.location.pathname);
    if (
      initialLoad &&
      (defaultKappDisplaySpace || defaultKappDisplayProfile) &&
      currentRoute === '/'
    ) {
      yield put(
        push(`/kapps/${defaultKappDisplayProfile || defaultKappDisplaySpace}`),
      );
    }

    const { locales, timezones } = yield all({
      locales: call(fetchLocales),
      timezones: call(fetchTimezones),
    });

    yield put(
      configActions.setLocaleMetadata({
        locales: locales.data.locales,
        timezones: timezones.data.timezones,
      }),
    );
    yield put(loadingActions.setLoading(false));
  } else {
    window.alert(
      `You must be running Kinetic Request v${MINIMUM_CE_VERSION} or later in order to use this app. You are currently running v${version}.`,
    );
  }
}

const fetchLocales = () => axios.get(`${bundle.apiLocation()}/meta/locales`);
const fetchTimezones = () =>
  axios.get(`${bundle.apiLocation()}/meta/timezones`);

export function* watchApp() {
  yield takeEvery(loadingTypes.LOAD_APP, fetchAppTask);
}
