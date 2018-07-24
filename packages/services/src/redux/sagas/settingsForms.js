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

export function* fetchFormSubmissionsSaga(action) {
  const kappSlug = action.payload.kappSlug;
  const pageToken = action.payload.pageToken;
  const formSlug = action.payload.formSlug;
  const q = action.payload.q;
  const searchBuilder = new CoreAPI.SubmissionSearch().includes([
    'details',
    'values',
  ]);
  // Add some of the optional parameters to the search
  if (pageToken) searchBuilder.pageToken(pageToken);
  if (q) {
    for (const key in q) {
      console.log(key, q[key]);
      searchBuilder.eq(key, q[key]);
    }
  }
  searchBuilder.end();
  const search = searchBuilder.build();

  const { submissions, nextPageToken, serverError } = yield call(
    CoreAPI.searchSubmissions,
    { search, kapp: kappSlug, form: formSlug },
  );

  if (serverError) {
    yield put(actions.setFormsErrors(serverError));
  } else {
    yield put(actions.setFormSubmissions({ submissions, nextPageToken }));
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
  const { serverError, form } = yield call(CoreAPI.fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.inputs['Template to Clone'],
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(actions.setFormsErrors(serverError));
  }

  const formContent = {
    ...form,
    slug: action.payload.inputs.Slug,
    name: action.payload.inputs.Name,
    description: action.payload.inputs.Description,
    status: action.payload.inputs.Status,
    type: action.payload.inputs.Type,
    attributesMap: {
      ...form.attributesMap,
      'Owning Team': action.payload.inputs['Owning Team'],
    },
  };
  const createdForm = yield call(CoreAPI.createForm, {
    kappSlug: action.payload.kappSlug,
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (createdForm.serverError || createdForm.error) {
    yield put(toastActions.addError(error || serverError.statusText));
  } else {
    // TODO: Build Initial Bridge Model and Mapping here
    if (typeof action.payload.callback === 'function') {
      action.payload.callback(createdForm.form.slug);
    }
  }
}

export function* watchSettingsForms() {
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
  yield takeEvery(types.FETCH_KAPP, fetchKappSaga);
  yield takeEvery(types.UPDATE_FORM, updateFormSaga);
  yield takeEvery(types.CREATE_FORM, createFormSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
  yield takeEvery(types.FETCH_FORM_SUBMISSIONS, fetchFormSubmissionsSaga);
}
