import { call, put, takeEvery } from 'redux-saga/effects';
import {
  fetchForm,
  fetchForms,
  SubmissionSearch,
  searchSubmissions,
  fetchSubmission,
  createForm,
  updateForm,
  deleteForm,
} from '@kineticdata/react';
import { addToast, addToastAlert } from 'common';
import {
  actions,
  types,
  FORM_INCLUDES,
  FORM_FULL_INCLUDES,
  SUBMISSION_INCLUDES,
} from '../modules/settingsForms';
import {
  DEFAULT_SURVEY_TYPE,
  DEFAULT_TEMPLATE_INCLUDES,
} from '../../constants';

export function* fetchFormSaga({ payload }) {
  const { error, form } = yield call(fetchForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.formSlug,
    include: FORM_INCLUDES,
  });

  if (error) {
    yield put(actions.fetchFormFailure(error));
  } else {
    yield put(actions.fetchFormSuccess(form));
  }
}

export function* fetchTemplatesSaga({ payload }) {
  const { forms, error } = yield call(fetchForms, {
    kappSlug: payload.kappSlug,
    include: 'details,attributes',
    q: 'type = "Template"',
  });

  if (error) {
    addToastAlert({
      title: 'Failed to load Survey Templates.',
      message: error.message,
    });
  } else {
    const templates = forms.map(form => ({ name: form.name, slug: form.slug }));
    yield put(
      actions.fetchSurveyTemplatesComplete({
        templates,
      }),
    );
  }
}

export function* createFormSaga({ payload }) {
  const { form: template, error: templateError } = yield call(fetchForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.form.template,
    include: DEFAULT_TEMPLATE_INCLUDES,
  });

  if (templateError) {
    yield put(actions.fetchFormFailure(templateError));
  } else {
    const { form, error } = yield call(createForm, {
      kappSlug: payload.kappSlug,
      form: {
        ...template,
        name: payload.form.name,
        slug: payload.form.slug,
        description: payload.form.description,
        type: DEFAULT_SURVEY_TYPE,
      },
    });
    if (error) {
      yield put(actions.createFormFailure(error));
      yield addToastAlert({
        title: 'Error Cloning Survey',
        message: error.message,
      });
    } else {
      yield put(actions.createFormSuccess(form));
      yield addToast(
        `${form.slug} cloned successfully from ${payload.form.template}`,
      );
      if (typeof payload.callback === 'function') {
        payload.callback(form);
      }
    }
  }
}

export function* cloneFormSaga({ payload }) {
  const { error: cloneError, form: cloneForm } = yield call(fetchForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.cloneFormSlug,
    include: FORM_FULL_INCLUDES,
  });

  if (cloneError) {
    addToastAlert({
      title: 'Error Cloning Form',
      message: 'Could not find form to clone.',
    });
    yield put(actions.cloneFormComplete(payload));
  } else {
    const { error, form } = yield call(updateForm, {
      kappSlug: payload.kappSlug,
      formSlug: payload.formSlug,
      form: {
        bridgedResources: cloneForm.bridgedResources,
        customHeadContent: cloneForm.customHeadContent,
        pages: cloneForm.pages,
        securityPolicies: cloneForm.securityPolicies,
        attributesMap: cloneForm.attributesMap,
        categorizations: cloneForm.categorizations,
      },
    });

    if (error) {
      addToastAlert({
        title: 'Error Cloning Form',
        message: error.message,
      });
      yield put(actions.cloneFormComplete(payload));
    }

    addToast(`${form.name} cloned successfully from ${cloneForm.name}`);
    if (typeof payload.callback === 'function') {
      payload.callback(form);
    }
    yield put(actions.cloneFormComplete(payload));
  }
}

export function* fetchSubmissionSaga({ payload }) {
  const { submission, error } = yield call(fetchSubmission, {
    id: payload.id,
    include: SUBMISSION_INCLUDES,
  });
  if (error) {
    yield put(actions.fetchSubmissionFailure(error));
  } else {
    yield put(actions.fetchSubmissionSuccess(submission));
  }
}

export function* fetchFormSubmissionsSaga(action) {
  const kappSlug = action.payload.kappSlug;
  const pageToken = action.payload.pageToken;
  const formSlug = action.payload.formSlug;
  const q = action.payload.q;
  const searchBuilder = new SubmissionSearch().includes(['details', 'values']);
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
    searchSubmissions,
    { search, kapp: kappSlug, form: formSlug },
  );

  if (serverError) {
    yield put(actions.setFormsError(serverError));
  } else {
    yield put(actions.setFormSubmissions({ submissions, nextPageToken }));
  }
}

export function* fetchAllSubmissionsSaga(action) {
  const { pageToken, accumulator, formSlug, kappSlug, q } = action.payload;
  const searcher = new SubmissionSearch(true);

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
    searchSubmissions,
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

export function* deleteFormSaga({ payload }) {
  const { form, error } = yield call(deleteForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.formSlug,
  });
  if (form) {
    if (typeof payload.onSuccess === 'function') {
      yield call(payload.onSuccess, form);
    }
    yield put(actions.deleteFormComplete(payload));
    addToast('Form deleted successfully.');
  } else {
    addToastAlert({ title: 'Error Deleting Form', message: error.message });
  }
}

export function* watchSettingsForms() {
  yield takeEvery(types.FETCH_FORM_REQUEST, fetchFormSaga);
  yield takeEvery(types.DELETE_FORM_REQUEST, deleteFormSaga);
  yield takeEvery(types.CLONE_FORM_REQUEST, cloneFormSaga);
  yield takeEvery(types.FETCH_SUBMISSION_REQUEST, fetchSubmissionSaga);
  yield takeEvery(types.FETCH_FORM_SUBMISSIONS, fetchFormSubmissionsSaga);
  yield takeEvery(types.FETCH_ALL_SUBMISSIONS, fetchAllSubmissionsSaga);

  yield takeEvery(types.CREATE_FORM_REQUEST, createFormSaga);
  yield takeEvery(types.FETCH_SURVEY_TEMPLATES, fetchTemplatesSaga);
}
