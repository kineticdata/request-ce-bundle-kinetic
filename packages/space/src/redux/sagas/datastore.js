import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { fromJS, Seq, Map } from 'immutable';
import { push } from 'connected-react-router';

import {
  actions,
  types,
  DATASTORE_LIMIT,
  SUBMISSION_INCLUDES,
  FORMS_INCLUDES,
  FORM_INCLUDES,
} from '../modules/datastore';

import { actions as systemErrorActions } from '../modules/errors';

export const selectCurrentForm = state =>
  state.datastore.currentForm

export const selectColumnConfigs = state =>
  state.datastore.columnsConfig

export function* fetchFormsSaga() {
  const displayableForms = yield call(CoreAPI.fetchForms, {
    datastore: true,
    include: FORMS_INCLUDES,
  });

  const manageableForms = yield call(CoreAPI.fetchForms, {
    datastore: true,
    manage: 'true',
  });

  if (displayableForms.serverError || manageableForms.serverError) {
    yield put(
      systemErrorActions.setSystemError(
        displayableForms.serverError || manageableForms.serverError,
      ),
    );
  } else if (displayableForms.errors || manageableForms.errors) {
    yield put(
      actions.setFormsErrors(displayableForms.errors || manageableForms.errors),
    );
  } else {
    const manageableFormsSlugs = manageableForms.forms.map(form => form.slug);
    yield put(
      actions.setForms({
        manageableForms: manageableFormsSlugs,
        displayableForms: displayableForms.forms,
      }),
    );
  }
}

export function* fetchFormSaga(action) {
  const { form, errors, serverError } = yield call(CoreAPI.fetchForm, {
    datastore: true,
    formSlug: action.payload,
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFormsErrors(errors));
  } else {
    yield put(actions.setForm(form));
  }
}

// export function* updateFormSaga() {
//   const formSlug = yield select(selectCurrentForm).slug;
//   const columnsConfig = yield select(selectColumnConfigs);
//   const form = {form:{attributesMap: {'Datastore Configuration': [columnsConfig.toJS()]}}}
//
//   const { serverError } = yield call(CoreAPI.updateForm, {
//     formSlug,
//     form,
//     include: FORM_INCLUDES,
//   });
//   if (!serverError) {
//     // TODO: What should we do on success?
//     // const newFilters = newProfile.profileAttributes['Queue Personal Filters']
//     //   ? newProfile.profileAttributes['Queue Personal Filters'].map(f => f)
//     //   : List();
//   }
// }

export const selectSearchParams = state => ({
  searchParams: state.datastore.searchParams,
  form: state.datastore.currentForm,
  pageToken: state.datastore.nextPageToken,
  pageTokens: state.datastore.pageTokens,
  simpleSearchActive: state.datastore.simpleSearchActive,
  simpleSearchParam: state.datastore.simpleSearchParam,
});

export function* fetchSubmissionsSaga() {
  const {
    searchParams,
    form,
    pageToken,
    simpleSearchActive,
    simpleSearchParam,
  } = yield select(selectSearchParams);

  if (simpleSearchActive) {
    // Get build field indexes
    /// HANDLE UNIQUE???
    const indiciesToSearch = form.indexDefinitions.filter(
      def => def.status === 'Built' && def.parts.length === 1 && def.name.startsWith('values['),
    );

    const searchActions = indiciesToSearch.map(index => {
      const searcher = new CoreAPI.SubmissionSearch(true);
      searcher.include(SUBMISSION_INCLUDES);
      searcher.limit(DATASTORE_LIMIT);
      searcher.index(index.name);
      searcher.sw(index.parts[0], simpleSearchParam);

      return call(CoreAPI.searchSubmissions, {
        search: searcher.build(),
        datastore: true,
        form: form.slug,
      });
    });

    // Search each field index
    const searchResults = yield all(searchActions);
    // Combine the results together and make sure they are unique
    const combinedSubmissions = fromJS(searchResults)
      .flatMap(searchResult => searchResult.get('submissions'))
      .toSet()
      .toJS();

    yield put(actions.setSubmissions(combinedSubmissions));

  } else {
    const searcher = new CoreAPI.SubmissionSearch(true);

    searcher.include(SUBMISSION_INCLUDES);
    searcher.limit(DATASTORE_LIMIT);
    if (pageToken) {
      searcher.pageToken(pageToken);
    }
    searcher.index(searchParams.index.name);
    searchParams.indexParts.forEach(part => {
      switch (part.criteria) {
        case 'Between':
          searcher.between(
            part.name,
            part.value.values.get(0),
            part.value.values.get(1),
          );
          break;
        case 'Is Equal To':
          if (part.value.size > 1) {
            searcher.in(part.name, part.value.values.toJS());
          } else {
            searcher.eq(part.name, part.value.values.get(0));
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
        case 'All':
          // Don't do anything with 'All'.
          break;
        default:
          console.warn(`Invalid criteria: "${part.criteria}"`);
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
      yield put(actions.setPageOffset(0));
    }

    yield put(actions.setSubmissions(submissions));
  }
}

export function* fetchSubmissionSaga(action) {
  const include =
    'details,values,form,form.attributes,activities,activities.details';
  const { submission, serverError } = yield call(
    CoreAPI.fetchSubmission,
    { id: action.payload, include, datastore: true },
  );

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
      yield put(
        push(`/datastore/${form.slug}/${cloneSubmission.id}`),
      );
    }
  }
}

export function* deleteSubmissionSaga(action) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id: action.payload.id,
    datastore: true
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

export function* watchDatastore() {
  yield takeEvery(types.FETCH_FORMS, fetchFormsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
  yield takeEvery(types.FETCH_SUBMISSION, fetchSubmissionSaga);
  yield takeEvery(types.FETCH_SUBMISSIONS, fetchSubmissionsSaga);
  yield takeEvery(types.CLONE_SUBMISSION, cloneSubmissionSaga);
  yield takeEvery(types.DELETE_SUBMISSION, deleteSubmissionSaga);
  //yield takeEvery(types.UPDATE_FORM, updateFormSaga);
}
