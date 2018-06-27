import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI, bundle } from 'react-kinetic-core';
import { toastActions } from 'common';
import { actions, types, FORM_INCLUDES } from '../modules/settingsForms';

export function* fetchFormSaga(action) {
  const { serverError, form } = yield call(CoreAPI.fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.formSlug,
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(actions.setFormsErrors(serverError));
  } else {
    yield put(actions.setForm(form));
  }
}

export function* fetchKappSaga(action) {
  const { serverError, kapp } = yield call(CoreAPI.fetchKapp, {
    kappSlug: action.payload,
    include: 'formTypes, categories',
  });

  if (serverError) {
    yield put(actions.setFormsErrors(serverError));
  } else {
    yield put(actions.setKapp(kapp));
  }
}

export function* updateFormSaga(action) {
  const currentForm = action.payload.form;
  const currentFormChanges = action.payload.inputs;
  const formContent = {
    attributesMap: {
      Icon: [currentFormChanges.icon],
      'Task Form Slug': currentFormChanges['Task Form Slug']
        ? [currentFormChanges['Task Form Slug']]
        : [],
      'Service Days Due': currentFormChanges['Service Days Due']
        ? [currentFormChanges['Service Days Due']]
        : [],
      'Approval Form Slug': currentFormChanges['Approval Form Slug']
        ? [currentFormChanges['Approval Form Slug']]
        : [],
      'Task Form Slug': currentFormChanges['Task Form Slug']
        ? [currentFormChanges['Task Form Slug']]
        : [],
      Approver: currentFormChanges.Approver
        ? [currentFormChanges.Approver]
        : [],
      'Task Assignee Team': currentFormChanges['Task Assignee Team']
        ? [currentFormChanges['Task Assignee Team']]
        : [],
      'Notification Template Name - Create': currentFormChanges[
        'Notification Template Name - Create'
      ]
        ? [currentFormChanges['Notification Template Name - Create']]
        : [],
      'Notification Template Name - Complete': currentFormChanges[
        'Notification Template Name - Complete'
      ]
        ? [currentFormChanges['Notification Template Name - Complete']]
        : [],
      'Owning Team': currentFormChanges['Owning Team']
        ? currentFormChanges['Owning Team']
        : [],
    },
    status: currentFormChanges.status,
    type: currentFormChanges.type,
    description: currentFormChanges.description,
    categorizations: currentFormChanges.categories,
  };
  const { serverError, form } = yield call(CoreAPI.updateForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: currentForm.slug,
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (!serverError) {
    yield put(
      actions.fetchForm({
        kappSlug: action.payload.kappSlug,
        formSlug: currentForm.slug,
      }),
    );
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

export function* createFormSaga(action) {
  const form = action.payload.form;
  const formContent = {
    slug: form.slug,
    name: form.name,
    description: form.description,
  };
  const { error, serverError } = yield call(CoreAPI.createForm, {
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (serverError || error) {
    yield put(toastActions.addError(error || serverError.statusText));
  } else {
    // TODO: Build Initial Bridge Model and Mapping here
    if (typeof action.payload.callback === 'function') {
      action.payload.callback();
    }
  }
}

export function* watchSettingsForms() {
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
  yield takeEvery(types.FETCH_KAPP, fetchKappSaga);
  yield takeEvery(types.UPDATE_FORM, updateFormSaga);
  yield takeEvery(types.CREATE_FORM, createFormSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
}
