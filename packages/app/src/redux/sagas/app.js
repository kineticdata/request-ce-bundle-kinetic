import { takeEvery, call, put, all, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  fetchVersion,
  fetchProfile,
  fetchSpace,
  fetchKapps,
  fetchDefaultLocale,
  fetchLocales,
  fetchTimezones,
  importLocale,
} from '@kineticdata/react';
import semver from 'semver';
import { enableSearchHistory, Utils } from 'common';

import { actions, types } from '../modules/app';
import { actions as alertsActions } from '../modules/alerts';

const MINIMUM_CE_VERSION = '5.0.0';
const SPACE_INCLUDES = ['details', 'attributes', 'attributesMap'];
const KAPP_INCLUDES = ['details', 'attributes', 'attributesMap'];
const PROFILE_INCLUDES = [
  'details',
  'attributes',
  'profileAttributes',
  'profileAttributesMap',
  'memberships',
  'memberships.team',
  'memberships.team.attributes',
  'memberships.team.attributesMap',
  'memberships.team.memberships',
  'memberships.team.memberships.user',
];

// Fetch Entire App
export function* fetchAppTask({ payload }) {
  const authenticated = yield select(state => state.app.authenticated);
  const { version } = yield call(fetchVersion, { public: !authenticated });
  const initialLoad = payload;
  // Check to make sure the version is compatible with this bundle.
  if (
    semver.satisfies(semver.coerce(version.version), `>=${MINIMUM_CE_VERSION}`)
  ) {
    // Set data needed for initialization from server into redux
    yield all([
      call(fetchSpaceTask, authenticated),
      call(fetchKappsTask, authenticated),
      call(fetchProfileTask, authenticated),
      call(fetchLocaleMetaTask, authenticated),
      put(actions.setCoreVersion(version.version)),
    ]);

    // Fetch data needed for initialization from redux
    const { currentRoute, space, profile, kapps, errors } = yield select(
      state => ({
        errors: state.app.errors,
        currentRoute: state.router.location.pathname,
        space: state.app.space,
        profile: state.app.profile,
        kapps: state.app.kapps,
      }),
    );

    // Make sure there were no errors fetching metadata
    if (errors.isEmpty()) {
      // Configure Search History for Kapps
      yield all([
        ...kapps.map(kapp => {
          return put(
            enableSearchHistory({
              kappSlug: kapp.slug,
              value: Utils.getAttributeValue(kapp, 'Record Search History', ''),
            }),
          );
        }),
      ]);

      // Preload locale before displaying the app to get rid of flicker
      if (profile.preferredLocale) {
        importLocale(profile.preferredLocale);
        yield put(actions.setUserLocale(profile.preferredLocale));
      } else {
        const { defaultLocale } = yield call(fetchDefaultLocale, {
          public: !authenticated,
        });
        importLocale((defaultLocale && defaultLocale.code) || 'en');
        yield put(actions.setUserLocale(defaultLocale && defaultLocale.code));
      }

      // Determine default kapp route
      if (initialLoad && currentRoute === '/') {
        const defaultUserKapp = Utils.getProfileAttributeValue(
          profile,
          'Default Kapp Display',
        );
        const defaultSpaceKapp = Utils.getAttributeValue(
          space,
          'Default Kapp Display',
        );
        if (defaultUserKapp && kapps.find(k => k.slug === defaultUserKapp)) {
          yield put(push(`/kapps/${defaultUserKapp}`));
        } else if (
          defaultUserKapp &&
          ['discussions'].includes(defaultUserKapp)
        ) {
          yield put(push(`/${defaultUserKapp}`));
        } else if (
          defaultSpaceKapp &&
          kapps.find(k => k.slug === defaultSpaceKapp)
        ) {
          yield put(push(`/kapps/${defaultSpaceKapp}`));
        }
      }
      yield put(actions.fetchAppSuccess());
      if (authenticated) {
        yield put(alertsActions.fetchAlertsRequest());
      }
    }
  } else {
    window.alert(
      `You must be running Kinetic Request v${MINIMUM_CE_VERSION} or later in order to use this app. You are currently running v${
        version.version
      }.`,
    );
  }
}

// Fetch Kapps Task
export function* fetchKappsTask(authenticated) {
  const { kapps, error } = yield call(fetchKapps, {
    include: KAPP_INCLUDES.join(','),
    public: !authenticated,
  });
  if (error) {
    yield put(actions.fetchKappsFailure(error));
  } else {
    yield put(actions.fetchKappsSuccess(kapps));
  }
}

// Fetch Space Task
export function* fetchSpaceTask(authenticated) {
  const { space, error } = yield call(fetchSpace, {
    include: SPACE_INCLUDES.join(','),
    public: !authenticated,
  });
  if (error) {
    yield put(actions.fetchSpaceFailure(error));
  } else {
    yield put(actions.fetchSpaceSuccess(space));
  }
}

// Fetch Profile Task
export function* fetchProfileTask(authenticated) {
  const { profile, error } = yield call(fetchProfile, {
    include: PROFILE_INCLUDES.join(','),
    public: !authenticated,
  });
  if (error) {
    yield put(actions.fetchProfileFailure(error));
  } else {
    yield put(actions.fetchProfileSuccess(profile));
  }
}

// Fetch Locales Metadata Task
export function* fetchLocaleMetaTask() {
  const { locales, timezones } = yield all({
    locales: call(fetchLocales),
    timezones: call(fetchTimezones),
  });
  yield put(
    actions.fetchLocaleMetaSuccess({
      locales: locales.data.locales,
      timezones: timezones.data.timezones,
    }),
  );
}

export function* setAuthenticatedTask() {
  const { authenticated, authRedirect } = yield select(state => state.app);
  if (authenticated && authRedirect) {
    yield put(push(authRedirect));
  }
}

export function* watchApp() {
  yield takeEvery(types.FETCH_APP_REQUEST, fetchAppTask);
  yield takeEvery(types.SET_AUTHENTICATED, setAuthenticatedTask);
}
