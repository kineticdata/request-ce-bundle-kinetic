import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  fetchForm,
  SubmissionSearch,
  createSubmission,
  searchSubmissions,
  fetchSubmission,
  createForm,
  updateForm,
  deleteForm,
  createTree,
  fetchTree,
} from '@kineticdata/react';
import { addToast, addToastAlert, Utils } from 'common';
import {
  actions,
  types,
  FORM_INCLUDES,
  FORM_FULL_INCLUDES,
  SUBMISSION_INCLUDES,
} from '../modules/surveys';
import {
  DEFAULT_SURVEY_TYPE,
  DEFAULT_TEMPLATE_INCLUDES,
} from '../../constants';

export function* fetchFormSaga({ payload }) {
  const space = yield select(state => state.app.space);
  const taskSourceName = Utils.getAttributeValue(space, 'Task Source Name');

  // fetch form
  const { error, form } = yield call(fetchForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.formSlug,
    public: payload.public,
    include: FORM_INCLUDES,
  });

  if (error) {
    yield put(actions.fetchFormFailure(error));
  } else {
    // check if custom workflow is selected
    const customWorkflow =
      form.attributesMap['Survey Configuration'] &&
      form.attributesMap['Survey Configuration'][0] &&
      JSON.parse(form.attributesMap['Survey Configuration'][0])[
        'Use Custom Workflow'
      ];
    if (customWorkflow === 'true') {
      // try to fetch associated tree
      const { tree } = yield call(fetchTree, {
        name: 'Submitted',
        sourceGroup: `Submissions > ${payload.kappSlug} > ${payload.formSlug}`,
        sourceName: taskSourceName,
      });
      if (tree) {
        yield put(
          actions.fetchAssociatedTreeComplete({
            tree,
          }),
        );
        yield put(actions.fetchFormSuccess(form));
      } else {
        // if no associated tree found, create one
        const { tree: newTree, error: newError } = yield call(createTree, {
          tree: {
            sourceName: taskSourceName,
            sourceGroup: `Submissions > ${payload.kappSlug} > ${
              payload.formSlug
            }`,
            name: 'Submitted',
          },
        });
        if (newTree) {
          yield put(
            actions.fetchAssociatedTreeComplete({
              newTree,
            }),
          );

          // ...and refetch form
          yield put(
            actions.fetchFormRequest({
              kappSlug: payload.kappSlug,
              formSlug: payload.formSlug,
              public: payload.public,
            }),
          );
        } else {
          yield addToastAlert({
            title: 'Error Saving Tree',
            message: newError.message,
          });
          throw (newError.statusCode === 400 && newError.message) ||
            'There was an error saving the workflow';
        }
      }
    } else yield put(actions.fetchFormSuccess(form));
  }
}

export function* createFormSaga({ payload }) {
  const { form: template, error: templateError } = yield call(fetchForm, {
    kappSlug: payload.kappSlug,
    formSlug: payload.form.template,
    include: DEFAULT_TEMPLATE_INCLUDES,
    export: true,
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
        fields: cloneForm.fields,
        securityPolicies: cloneForm.securityPolicies,
        attributesMap: cloneForm.attributesMap,
        categorizations: cloneForm.categorizations,
        status: cloneForm.status,
        type: cloneForm.type,
      },
    });

    if (error) {
      addToastAlert({
        title: 'Error Cloning Survey',
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
  const authenticated = yield select(state => state.app.authenticated);
  const { submission, error } = yield call(fetchSubmission, {
    id: payload.id,
    include: SUBMISSION_INCLUDES,
    public: !authenticated,
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

  const { submissions, nextPageToken, error } = yield call(searchSubmissions, {
    search,
    kapp: kappSlug,
    form: formSlug,
  });

  if (error) {
    yield put(actions.setFormsError([error]));
  } else {
    yield put(actions.setFormSubmissions({ submissions, nextPageToken }));
  }
}

export function* fetchAllSubmissionsSaga(action) {
  const {
    pageToken,
    accumulator,
    formSlug,
    kappSlug,
    createdAt,
    submittedAt,
    coreState,
    q,
  } = action.payload;
  const searcher = new SubmissionSearch(false);

  if (q) {
    for (const key in q) {
      searcher.eq(key, q[key]);
    }
  }
  if (createdAt) {
    createdAt['startDate'] && searcher.startDate(createdAt['startDate']);
    createdAt['endDate'] && searcher.endDate(createdAt['endDate']);
  }
  if (submittedAt) {
    submittedAt['startDate'] && searcher.startDate(submittedAt['startDate']);
    submittedAt['endDate'] && searcher.endDate(submittedAt['endDate']);
  }
  if (coreState) {
    searcher.coreState(coreState);
  }
  searcher.include('values');
  searcher.limit(1000);
  if (pageToken) {
    searcher.pageToken(pageToken);
  }

  const { submissions, nextPageToken = null, error } = yield call(
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
    if (error) {
      // What should we do?
      console.log(error);
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

export function* callFormActionSaga({
  payload: { formSlug, surveySubmissionId },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const { submission, error } = yield call(createSubmission, {
    kappSlug,
    formSlug,
    values: {
      'Survey Submission Id': surveySubmissionId,
    },
  });
  if (error) {
    yield addToastAlert({
      title: 'Survey Action Failed',
      message: error.message,
    });
  } else {
    addToast({
      message: 'Resending Invitation',
    });
    return submission;
  }
}

export function* fetchSurveyPollersSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);
  const formSlug = 'survey-pollers';
  const searchBuilder = new SubmissionSearch().includes(['values']);
  searchBuilder.end();
  const search = searchBuilder.build();

  const { submissions, error } = yield call(searchSubmissions, {
    search,
    kapp: kappSlug,
    form: formSlug,
  });

  if (error) {
    return error;
  } else {
    const pollers = submissions
      .map(s => s.values)
      .filter(s => s['Status'] === 'Active');
    yield put(actions.fetchSurveyPollersComplete(pollers));
  }
}

export function* watchSurveys() {
  yield takeEvery(types.FETCH_FORM_REQUEST, fetchFormSaga);
  yield takeEvery(types.DELETE_FORM_REQUEST, deleteFormSaga);
  yield takeEvery(types.CLONE_FORM_REQUEST, cloneFormSaga);
  yield takeEvery(types.FETCH_SUBMISSION_REQUEST, fetchSubmissionSaga);
  yield takeEvery(types.FETCH_FORM_SUBMISSIONS, fetchFormSubmissionsSaga);
  yield takeEvery(types.FETCH_ALL_SUBMISSIONS, fetchAllSubmissionsSaga);
  yield takeEvery(types.CREATE_FORM_REQUEST, createFormSaga);
  yield takeEvery(types.FETCH_SURVEY_POLLERS, fetchSurveyPollersSaga);
  yield takeEvery(types.CALL_FORM_ACTION, callFormActionSaga);
}
