import { call, put, takeEvery, select } from 'redux-saga/effects';
import {
  bundle,
  fetchForm,
  SubmissionSearch,
  searchSubmissions,
  fetchSubmission,
  fetchKapp,
  updateForm,
  createForm,
  deleteForm,
} from '@kineticdata/react';
import { addSuccess, addError, addToast, addToastAlert } from 'common';
import axios from 'axios';
import {
  actions,
  types,
  FORM_INCLUDES,
  FORM_FULL_INCLUDES,
  SUBMISSION_INCLUDES,
} from '../modules/settingsForms';

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

export function* createFormSaga(action) {
  const { serverError, form } = yield call(fetchForm, {
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

  const createdForm = yield call(createForm, {
    kappSlug: action.payload.kappSlug,
    form: formContent,
    include: FORM_FULL_INCLUDES,
  });
  if (createdForm.serverError || createdForm.error) {
    yield put(
      addError(createdForm.error || createdForm.serverError.statusText),
    );
  } else {
    yield put(
      addSuccess(
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
  yield takeEvery(types.FETCH_SUBMISSION_REQUEST, fetchSubmissionSaga);

  yield takeEvery(types.CREATE_FORM, createFormSaga);
  yield takeEvery(types.FETCH_ALL_SUBMISSIONS, fetchAllSubmissionsSaga);
}
