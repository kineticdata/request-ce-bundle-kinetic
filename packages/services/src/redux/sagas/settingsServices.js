import { Map } from 'immutable';
import { takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/settingsServices';
import { actions as kinopsActions } from 'app/src/redux/modules/app';

import { CoreAPI } from 'react-kinetic-core';

const SERVICES_SETTING_INCLUDES = 'formTypes, attributesMap';

const TEAMS_SETTING_INCLUDES = 'teams';

const SPACE_SETTING_INCLUDES = 'kapps,kapps.forms,attributesMap';

export function* fetchServicesSettingsSaga({ payload }) {
  const { serverError, kapp } = yield call(CoreAPI.fetchKapp, {
    include: SERVICES_SETTING_INCLUDES,
    kappSlug: 'services',
  });

  if (serverError) {
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setServicesSettings(kapp));
  }
}

export function* fetchTeamsSaga({ payload }) {
  const { serverError, teams } = yield call(CoreAPI.fetchTeams, {
    include: TEAMS_SETTING_INCLUDES,
    teams: payload,
  });

  if (serverError) {
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setServicesSettingsTeams(teams));
  }
}

export function* fetchSpaceSaga({ payload }) {
  const { serverError, space } = yield call(CoreAPI.fetchSpace, {
    include: SPACE_SETTING_INCLUDES,
    space: payload,
  });

  if (serverError) {
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setServicesSettingsSpace(space));
  }
}

export function* updateServicesSettingsSaga({ payload }) {
  const attributes = Map(payload)
    .filter(value => value)
    .map(value => (value.constructor === Array ? value : [value]))
    .toJS();

  const { serverError, kapp } = yield call(CoreAPI.updateKapp, {
    include: SERVICES_SETTING_INCLUDES,
    kapp: {
      attributesMap: attributes,
    },
    kappSlug: 'services',
  });

  if (serverError) {
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(kinopsActions.loadApp());
  }
}

export function* fetchNotificationsSaga() {
  const search = new CoreAPI.SubmissionSearch(true)
    .index('values[Name]')
    .includes(['details', 'values'])
    .build();

  const { serverError, submissions } = yield call(CoreAPI.searchSubmissions, {
    search,
    form: 'notification-data',
    datastore: true,
  });

  if (serverError) {
    yield put(actions.setFormsErrors(serverError));
  } else {
    yield put(actions.setNotifications(submissions));
  }
}

export function* watchSettingsServices() {
  yield takeEvery(types.FETCH_SERVICES_SETTINGS, fetchServicesSettingsSaga);
  yield takeEvery(types.FETCH_SERVICES_SETTINGS_TEAMS, fetchTeamsSaga);
  yield takeEvery(types.FETCH_SERVICES_SETTINGS_SPACE, fetchSpaceSaga);
  yield takeEvery(types.UPDATE_SERVICES_SETTINGS, updateServicesSettingsSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
}
