import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { fromJS, Seq, Map, List } from 'immutable';
import { push } from 'connected-react-router';

import { actions as systemErrorActions } from '../modules/errors';
import { toastActions } from 'common';
import {
  actions,
  types,
  selectCurrentForm,
  selectCurrentFormChanges,
  DATASTORE_LIMIT,
  SUBMISSION_INCLUDES,
  FORMS_INCLUDES,
  FORM_INCLUDES,
  SPACE_INCLUDES,
  BRIDGE_MODEL_INCLUDES,
} from '../modules/settingsDatastore';
import { DatastoreFormSave } from '../../records';

export function* fetchFormsSaga() {
  const [displayableForms, manageableForms, space] = yield all([
    call(CoreAPI.fetchForms, {
      datastore: true,
      include: FORMS_INCLUDES,
    }),
    call(CoreAPI.fetchForms, {
      datastore: true,
      manage: 'true',
    }),
    call(CoreAPI.fetchSpace, {
      include: SPACE_INCLUDES,
    }),
  ]);

  const manageableFormsSlugs = manageableForms.forms
    ? manageableForms.forms.map(form => form.slug)
    : [];

  yield put(
    actions.setForms({
      manageableForms: manageableFormsSlugs,
      displayableForms: displayableForms.forms || [],
      bridges: space.space ? space.space.bridges : [],
    }),
  );
}

export function* fetchFormSaga(action) {
  const [formCall, modelsCall] = yield all([
    call(CoreAPI.fetchForm, {
      datastore: true,
      formSlug: action.payload,
      include: FORM_INCLUDES,
    }),
    call(CoreAPI.fetchBridgeModels, {
      include: BRIDGE_MODEL_INCLUDES,
    }),
  ]);

  if (formCall.serverError) {
    yield put(systemErrorActions.setSystemError(formCall.serverError));
  } else if (formCall.errors) {
    yield put(actions.setFormsErrors(formCall.errors));
  } else {
    const { form } = formCall;
    const { bridgeModels } = modelsCall;
    yield put(actions.setForm({ form, bridgeModels }));
  }
}

export function* updateFormSaga() {
  const currentForm = yield select(selectCurrentForm);
  const currentFormChanges = yield select(selectCurrentFormChanges);
  let updateError = null;
  let slug = currentForm.slug;

  const formContent = DatastoreFormSave(currentForm).set('attributesMap', {
    'Datastore Configuration': [
      JSON.stringify(currentFormChanges.columns.toJS()),
    ],
  });
  const formContentChanges = DatastoreFormSave(currentFormChanges).set(
    'attributesMap',
    {
      'Datastore Configuration': [
        JSON.stringify(currentFormChanges.columns.toJS()),
      ],
    },
  );

  // Update form if content has changed
  if (!formContent.equals(formContentChanges)) {
    const { serverError, error, form } = yield call(CoreAPI.updateForm, {
      datastore: true,
      formSlug: currentForm.slug,
      form: formContentChanges,
      include: FORM_INCLUDES,
    });
    if (error || serverError) {
      updateError = error || serverError.statusText;
    } else {
      slug = form.slug;
    }
  }

  // Update bridge model if bridge info has changed
  if (
    !updateError &&
    (!currentForm.bridgeModel.equals(currentFormChanges.bridgeModel) ||
      !currentForm.bridgeModelMapping.equals(
        currentFormChanges.bridgeModelMapping,
      ))
  ) {
    const modelName = currentForm.bridgeModel.name;
    const bridgeModel = currentFormChanges.bridgeModel
      .set('name', `Datastore - ${currentFormChanges.name}`)
      .set('activeMappingName', `Datastore - ${currentFormChanges.name}`)
      .set('mappings', [
        currentFormChanges.bridgeModelMapping.set(
          'name',
          `Datastore - ${currentFormChanges.name}`,
        ),
      ])
      .toJS();
    const { error, serverError } = !!modelName
      ? yield call(CoreAPI.updateBridgeModel, {
          modelName,
          bridgeModel,
        })
      : yield call(CoreAPI.createBridgeModel, {
          bridgeModel,
        });
    if (error || serverError) {
      updateError = error || serverError.statusText;
    }
  }

  if (updateError) {
    yield put(toastActions.addError(updateError));
  } else {
    yield put(toastActions.addSuccess('Form updated.'));
    yield put(actions.fetchForm(slug));
    yield put(actions.fetchForms());
  }
}

export function* createFormSaga(action) {
  const form = action.payload.form;
  const formContent = {
    attributesMap: {
      'Datastore Configuration': [JSON.stringify(form.columns.toJS())],
    },
    slug: form.slug,
    name: form.name,
    description: form.description,
  };
  const { error, serverError } = yield call(CoreAPI.createForm, {
    datastore: true,
    form: formContent,
    include: FORM_INCLUDES,
  });
  if (serverError || error) {
    yield put(toastActions.addError(error || serverError.statusText));
  } else {
    yield put(actions.fetchForms());
    if (typeof action.payload.callback === 'function') {
      action.payload.callback();
    }
  }
}

export const selectSearchParams = state => ({
  searchParams: state.space.settingsDatastore.searchParams,
  form: state.space.settingsDatastore.currentForm,
  pageToken: state.space.settingsDatastore.nextPageToken,
  pageTokens: state.space.settingsDatastore.pageTokens,
  simpleSearchActive: state.space.settingsDatastore.simpleSearchActive,
  simpleSearchParam: state.space.settingsDatastore.simpleSearchParam,
  simpleSearchNextPageIndex:
    state.space.settingsDatastore.simpleSearchNextPageIndex,
});

export function* fetchSubmissionsSimpleSaga() {
  const {
    form,
    pageToken,
    simpleSearchParam,
    simpleSearchNextPageIndex,
  } = yield select(selectSearchParams);

  if (pageToken) {
    const index = form.indexDefinitions.find(definition => {
      console.log(index);
      return definition.name === simpleSearchNextPageIndex;
    });
    const query = new CoreAPI.SubmissionSearch(true);
    query.include(SUBMISSION_INCLUDES);
    query.limit(DATASTORE_LIMIT);
    query.index(index.name);
    query.sw(index.parts[0], simpleSearchParam);
    query.pageToken(pageToken);

    const { submissions, nextPageToken = null, serverError } = yield call(
      CoreAPI.searchSubmissions,
      { search: query.build(), datastore: true, form: form.slug },
    );

    if (serverError) {
      // What should we do?
    } else {
      // If we made a request for page > 2, then push that page token to the stack.
      if (pageToken) {
        yield put(actions.pushPageToken(pageToken));
      }
      // Set the next available page token to the one returned.
      yield put(actions.setNextPageToken(nextPageToken));
    }
    yield put(actions.setSubmissions(submissions));
  } else {
    const searchQueries = form.indexDefinitions
      .filter(
        definition =>
          definition.status === 'Built' &&
          definition.parts.length === 1 &&
          definition.name.startsWith('values['),
      )
      .map(index => {
        const query = new CoreAPI.SubmissionSearch(true);
        query.include(SUBMISSION_INCLUDES);
        query.limit(DATASTORE_LIMIT);
        query.index(index.name);
        query.sw(index.parts[0], simpleSearchParam);
        return query;
      });

    const searchCalls = searchQueries.map(searchQuery =>
      call(CoreAPI.searchSubmissions, {
        search: searchQuery.build(),
        datastore: true,
        form: form.slug,
      }),
    );

    const responses = fromJS(yield all(searchCalls));
    const responsesWithResults = responses.filter(
      result => result.get('submissions').size > 0,
    );
    const responsesWithPageTokens = responses.filter(
      result => result.get('nextPageToken') !== null,
    );

    if (responsesWithResults.size > 1 && responsesWithPageTokens.size > 0) {
      // Multiple searches had results and at least one had a next page token);
      yield all([
        put(actions.setSubmissions(List())),
        put(actions.setAdvancedSearchOpen(true)),
        put(
          toastActions.addError(
            'There were too many matching results. You will need to use an advanced search to create a better query.',
            'Too many results.',
          ),
        ),
      ]);
    } else if (
      responsesWithResults.size === 1 &&
      responsesWithPageTokens.size === 1
    ) {
      // One search had results and next page token
      const indexWithNextPage = responses.indexOf(
        responsesWithPageTokens.first(),
      );
      yield put(
        actions.setSimpleSearchNextPageIndex(
          searchQueries[indexWithNextPage].searchMeta.index,
        ),
      );
      yield put(
        actions.setNextPageToken(
          responsesWithPageTokens.first().get('nextPageToken'),
        ),
      );
      yield put(
        actions.setSubmissions(
          responsesWithPageTokens
            .first()
            .get('submissions')
            .toJS(),
        ),
      );
    } else {
      // Multiple searches had Results but none had next page token.
      const combinedSubmissions = responses
        .flatMap(searchResult => searchResult.get('submissions'))
        .toSet()
        .toJS();
      yield put(actions.setSubmissions(combinedSubmissions));
    }
  }
}

export function* fetchSubmissionsAdvancedSaga() {
  const { searchParams, form, pageToken } = yield select(selectSearchParams);

  const searcher = new CoreAPI.SubmissionSearch(true);

  searcher.include(SUBMISSION_INCLUDES);
  searcher.limit(DATASTORE_LIMIT);
  if (pageToken) {
    searcher.pageToken(pageToken);
  }
  searcher.index(searchParams.index.name);
  searchParams.indexParts.forEach(part => {
    switch (part.operation) {
      case 'Is Between':
        searcher.between(
          part.name,
          part.value.values.get(0),
          part.value.values.get(1),
        );
        break;
      case 'Equal To':
        const partWithInput =
          part.value.input !== ''
            ? part.updateIn(['value', 'values'], values =>
                values.push(part.value.input),
              )
            : part;
        if (partWithInput.value.values.size > 1) {
          searcher.in(partWithInput.name, partWithInput.value.values.toJS());
        } else {
          searcher.eq(partWithInput.name, partWithInput.value.values.get(0));
        }
        break;
      case 'Is Greater Than':
        searcher.gt(part.name, part.value.input);
        break;
      case 'Is Less Than':
        searcher.lt(part.name, part.value.input);
        break;
      case 'Is Greater Than or Equal':
        searcher.gteq(part.name, part.value.input);
        break;
      case 'Is Less Than or Equal':
        searcher.lteq(part.name, part.value.input);
        break;
      case 'Starts With':
        searcher.sw(part.name, part.value.input);
        break;
      case 'All':
        // Don't do anything with 'All'.
        break;
      default:
        console.warn(`Invalid operation: "${part.operation}"`);
    }
  });

  const { submissions, nextPageToken = null, serverError } = yield call(
    CoreAPI.searchSubmissions,
    { search: searcher.build(), datastore: true, form: form.slug },
  );

  if (serverError) {
    // What should we do?
  } else {
    // If we made a request for page > 2, then push that page token to the stack.
    if (pageToken) {
      yield put(actions.pushPageToken(pageToken));
    }

    // Set the next available page token to the one returned.
    yield put(actions.setNextPageToken(nextPageToken));
    // Reset the client-side page offset.
    yield put(actions.setSubmissions(submissions));
  }
}

export function* fetchSubmissionSaga(action) {
  const include =
    'details,values,form,form.attributes,activities,activities.details';
  const { submission, serverError } = yield call(CoreAPI.fetchSubmission, {
    id: action.payload,
    include,
    datastore: true,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else {
    yield put(actions.setSubmission(submission));
  }
}

export function* cloneSubmissionSaga(action) {
  const include = 'details,values,form,form.fields.details';
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    { id: action.payload, include, datastore: true },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.cloneSubmissionErrors(errors));
  } else {
    // The values of attachment fields cannot be cloned so we will filter them out
    // of the values POSTed to the new submission.
    const attachmentFields = Seq(submission.form.fields)
      .filter(field => field.dataType === 'file')
      .map(field => field.name)
      .toSet();

    const form = yield select(selectCurrentForm);

    // Some values on the original submission should be reset.
    const overrideFields = Map({
      Status: 'Draft',
      'Discussion Id': null,
      Observers: [],
    });

    // Copy the values from the original submission with the transformations
    // described above.
    const values = Seq(submission.values)
      .filter((value, fieldName) => !attachmentFields.contains(fieldName))
      .map((value, fieldName) => overrideFields.get(fieldName) || value)
      .toJS();

    // Make the call to create the clone.
    const {
      submission: cloneSubmission,
      postErrors,
      postServerError,
    } = yield call(CoreAPI.createSubmission, {
      datastore: true,
      formSlug: form.slug,
      values,
      completed: false,
    });

    if (postServerError) {
      yield put(systemErrorActions.setSystemError(serverError));
    } else if (postErrors) {
      yield put(actions.cloneSubmissionErrors(postErrors));
    } else {
      yield put(actions.cloneSubmissionSuccess());
      yield put(push(`/datastore/${form.slug}/${cloneSubmission.id}`));
    }
  }
}

export function* deleteSubmissionSaga(action) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id: action.payload.id,
    datastore: true,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.deleteSubmissionErrors(errors));
  } else {
    yield put(actions.deleteSubmissionSuccess());
    if (typeof action.payload.callback === 'function') {
      action.payload.callback();
    }
  }
}

export function* watchSettingsDatastore() {
  yield takeEvery(types.FETCH_FORMS, fetchFormsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
  yield takeEvery(types.FETCH_SUBMISSION, fetchSubmissionSaga);
  yield takeEvery(
    types.FETCH_SUBMISSIONS_ADVANCED,
    fetchSubmissionsAdvancedSaga,
  );
  yield takeEvery(types.FETCH_SUBMISSIONS_SIMPLE, fetchSubmissionsSimpleSaga);
  yield takeEvery(types.CLONE_SUBMISSION, cloneSubmissionSaga);
  yield takeEvery(types.DELETE_SUBMISSION, deleteSubmissionSaga);
  yield takeEvery(types.UPDATE_FORM, updateFormSaga);
  yield takeEvery(types.CREATE_FORM, createFormSaga);
}
