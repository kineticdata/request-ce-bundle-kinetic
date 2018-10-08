import { Map } from 'immutable';
import { all, takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/settingsQueue';
import { toastActions, commonActions } from 'common';

import { CoreAPI } from 'react-kinetic-core';

const QUEUE_SETTING_INCLUDES = 'formTypes,attributesMap,forms,forms.details';
const TEAMS_SETTING_INCLUDES = 'teams';
const SPACE_SETTING_INCLUDES = 'kapps,kapps.forms,attributesMap';
const FORM_INCLUDES = 'details,fields,attributesMap,categorizations';

export function* fetchQueueSettingsSaga({ payload }) {
  const [{ serverError, kapp }, manageableForms] = yield all([
    call(CoreAPI.fetchKapp, {
      include: QUEUE_SETTING_INCLUDES,
      kappSlug: 'queue',
    }),
    call(CoreAPI.fetchForms, {
      kappSlug: 'queue',
      manage: 'true',
    }),
  ]);

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    const manageableFormsSlugs = (manageableForms.forms || []).map(
      form => form.slug,
    );
    yield put(
      actions.setQueueSettings({
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
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsTeams(teams));
  }
}

export function* fetchUsersSaga({ payload }) {
  const { serverError, users } = yield call(CoreAPI.fetchUsers, {
    include: 'details',
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsUsers(users));
  }
}

export function* fetchSpaceSaga({ payload }) {
  const { serverError, space } = yield call(CoreAPI.fetchSpace, {
    include: SPACE_SETTING_INCLUDES,
    space: payload,
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsSpace(space));
  }
}

export function* updateQueueSettingsSaga({ payload }) {
  const attributes = Map(payload)
    .filter(value => value)
    .map(value => (value.constructor === Array ? value : [value]))
    .toJS();

  const { serverError, kapp } = yield call(CoreAPI.updateKapp, {
    include: QUEUE_SETTING_INCLUDES,
    kapp: {
      attributesMap: attributes,
    },
    kappSlug: 'queue',
  });

  if (serverError) {
    yield put(
      toastActions.addError('Failed to update settings.', 'Update Settings'),
    );
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(
      toastActions.addSuccess(
        'Updated settings successfully.',
        'Update Settings',
      ),
    );
    yield put(commonActions.loadApp());
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
    yield put(actions.updateQueueSettingsError(serverError));
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
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setForm(form));
  }
}

export function* watchSettingsQueue() {
  yield takeEvery(types.FETCH_QUEUE_SETTINGS, fetchQueueSettingsSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_TEAMS, fetchTeamsSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_USERS, fetchUsersSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_SPACE, fetchSpaceSaga);
  yield takeEvery(types.UPDATE_QUEUE_SETTINGS, updateQueueSettingsSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
}
