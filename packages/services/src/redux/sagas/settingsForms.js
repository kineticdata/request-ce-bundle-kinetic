import { call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI, bundle } from 'react-kinetic-core';
import { toastActions } from 'common';
import axios from 'axios';
import {
  actions,
  types,
  FORM_INCLUDES,
  FORM_FULL_INCLUDES,
  SUBMISSION_INCLUDES,
} from '../modules/settingsForms';

export function* fetchFormSaga(action) {
  const { serverError, form } = yield call(CoreAPI.fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.formSlug,
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(actions.setFormsError(serverError));
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
  // Loop over items in q and append them as "eq"
  // to search build
  if (q) {
    for (const key in q) {
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
    yield put(actions.setFormsError(serverError));
  } else {
    yield put(actions.setFormSubmissions({ submissions, nextPageToken }));
  }
}

export function* fetchFormSubmissionSaga(action) {
  const id = action.payload.id;
  const { submission, serverError } = yield call(CoreAPI.fetchSubmission, {
    id,
    include: SUBMISSION_INCLUDES,
  });
  if (serverError) {
    yield put(actions.setFormsError(serverError));
  } else {
    yield put(actions.setFormSubmission(submission));
  }
}

export function* fetchKappSaga(action) {
  const { serverError, kapp } = yield call(CoreAPI.fetchKapp, {
    kappSlug: action.payload,
    include: 'formTypes, categories, formAttributeDefinitions',
  });

  if (serverError) {
    yield put(actions.setFormsError(serverError));
  } else {
    const me = yield select(state => state.app.profile);
    if (
      me.spaceAdmin &&
      !kapp.formAttributeDefinitions.find(d => d.name === 'Form Configuration')
    ) {
      // Create Form Configuration Definition if it doesn't exist
      yield call(axios.request, {
        method: 'post',
        url: `${bundle.apiLocation()}/kapps/${
          kapp.slug
        }/formAttributeDefinitions`,
        data: {
          name: 'Form Configuration',
          allowsMultiple: false,
        },
      });
    }

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
      'Form Configuration': [
        JSON.stringify({
          columns: currentFormChanges.columns.toJS(),
        }),
      ],
    },
    status: currentFormChanges.status,
    type: currentFormChanges.type,
    description: currentFormChanges.description,
    categorizations: currentFormChanges.categories,
  };
  const { serverError } = yield call(CoreAPI.updateForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: currentForm.slug,
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (!serverError) {
    yield put(
      toastActions.addSuccess('Updated the form successfully.', 'Updated Form'),
    );
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
    yield put(
      toastActions.addError(
        'There was a problem retrieving notifications.',
        'Retrieving Notifications',
      ),
    );
    yield put(actions.setFormsError(serverError));
  } else {
    yield put(actions.setNotifications(submissions));
  }
}

export function* createFormSaga(action) {
  const { serverError, form } = yield call(CoreAPI.fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.inputs['Template to Clone'],
    include: FORM_FULL_INCLUDES,
  });

  if (serverError) {
    yield put(actions.setFormsError(serverError));
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
    include: FORM_FULL_INCLUDES,
  });
  if (createdForm.serverError || createdForm.error) {
    yield put(
      toastActions.addError(
        createdForm.error || createdForm.serverError.statusText,
      ),
    );
  } else {
    yield put(
      toastActions.addSuccess(
        `Form "${action.payload.inputs.Name}" was successfully created.`,
        'Created Form',
      ),
    );
    if (typeof action.payload.callback === 'function') {
      action.payload.callback(createdForm.form.slug);
    }
  }
}

export function* fetchAllSubmissionsSaga(action) {
  const { pageToken, accumulator, formSlug, kappSlug, q } = action.payload;
  const searcher = new CoreAPI.SubmissionSearch(true);

  if (q) {
    for (const key in q) {
      searcher.eq(key, q[key]);
    }
  }
  searcher.include('values');
  searcher.limit(1000);
  if (pageToken) {
    searcher.pageToken(pageToken);
  }

  const { submissions, nextPageToken = null, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: searcher.build(),
      form: formSlug,
      kapp: kappSlug,
    },
  );

  // Update the action with the new results
  action = {
    ...action,
    payload: {
      ...action.payload,
      accumulator: [...accumulator, ...submissions],
      pageToken: nextPageToken,
    },
  };

  yield put(actions.setExportCount(action.payload.accumulator.length));
  if (nextPageToken) {
    yield call(fetchAllSubmissionsSaga, action);
  } else {
    if (serverError) {
      // What should we do?
      console.log(serverError);
    } else {
      yield put(actions.setExportSubmissions(action.payload.accumulator));
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
  yield takeEvery(types.FETCH_FORM_SUBMISSION, fetchFormSubmissionSaga);
  yield takeEvery(types.FETCH_ALL_SUBMISSIONS, fetchAllSubmissionsSaga);
}
