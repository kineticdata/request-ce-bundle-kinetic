import { Map } from 'immutable';
import { all, takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/settingsServices';
import { actions as kinopsActions } from 'app/src/redux/modules/app';
import { toastActions } from 'common';

import { CoreAPI } from 'react-kinetic-core';

const SERVICES_SETTING_INCLUDES = 'formTypes,attributesMap,forms,forms.details';
const TEAMS_SETTING_INCLUDES = 'teams';
const SPACE_SETTING_INCLUDES = 'kapps,kapps.forms,attributesMap';
const FORM_INCLUDES = 'details,fields,attributesMap,categorizations';

export function* fetchServicesSettingsSaga({ payload }) {
  const [{ serverError, kapp }, manageableForms] = yield all([
    call(CoreAPI.fetchKapp, {
      include: SERVICES_SETTING_INCLUDES,
      kappSlug: 'services',
    }),
    call(CoreAPI.fetchForms, {
      kappSlug: 'services',
      manage: 'true',
    }),
  ]);

  if (serverError) {
    yield put(
      toastActions.addError(
        'Fetch Settings',
        'Failed to fetch Services settings.',
      ),
    );
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    const manageableFormsSlugs = (manageableForms.forms || []).map(
      form => form.slug,
    );
    yield put(
      actions.setServicesSettings({
        ...kapp,
        forms: (kapp.forms || []).map(form => ({
          ...form,
          canManage: manageableFormsSlugs.includes(form.slug),
        })),
      }),
    );
  }
}

export function* fetchTeamsSaga({ payload }) {
  const { serverError, teams } = yield call(CoreAPI.fetchTeams, {
    include: TEAMS_SETTING_INCLUDES,
    teams: payload,
  });

  if (serverError) {
    yield put(toastActions.addError('Fetch Teams', 'Failed to fetch teams.'));
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setServicesSettingsTeams(teams));
  }
}

export function* fetchUsersSaga({ payload }) {
  const { serverError, users } = yield call(CoreAPI.fetchUsers, {
    include: 'details',
  });

  if (serverError) {
    yield put(toastActions.addError('Fetch Users', 'Failed to fetch users.'));
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setServicesSettingsUsers(users));
  }
}

export function* fetchSpaceSaga({ payload }) {
  const { serverError, space } = yield call(CoreAPI.fetchSpace, {
    include: SPACE_SETTING_INCLUDES,
    space: payload,
  });

  if (serverError) {
    yield put(toastActions.addError('Fetch Space', 'Failed to fetch space.'));
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
    yield put(
      toastActions.addError('Update Settings', 'Failed to update settings.'),
    );
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(
      toastActions.addSuccess(
        'Update Settings',
        'Updated settings successfully.',
      ),
    );
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
    yield put(
      toastActions.addError(
        'Fetch Notifications',
        'Failed to fetch notifications.',
      ),
    );
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setNotifications(submissions));
  }
}

export function* fetchFormSaga(action) {
  const { serverError, form } = yield call(CoreAPI.fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.formSlug,
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(toastActions.addError('Fetch Form', 'Failed to fetch form.'));
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(actions.setForm(form));
  }
}

export function* watchSettingsServices() {
  yield takeEvery(types.FETCH_SERVICES_SETTINGS, fetchServicesSettingsSaga);
  yield takeEvery(types.FETCH_SERVICES_SETTINGS_TEAMS, fetchTeamsSaga);
  yield takeEvery(types.FETCH_SERVICES_SETTINGS_USERS, fetchUsersSaga);
  yield takeEvery(types.FETCH_SERVICES_SETTINGS_SPACE, fetchSpaceSaga);
  yield takeEvery(types.UPDATE_SERVICES_SETTINGS, updateServicesSettingsSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
}
