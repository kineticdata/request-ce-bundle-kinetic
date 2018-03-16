import { call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions, types, DATASTORE_LIMIT } from '../modules/datastore';
import { actions as systemErrorActions } from '../modules/errors';

export function* fetchFormsSaga() {
  const { forms, errors, serverError } = yield call(CoreAPI.fetchForms, {
    datastore: true,
    include: 'details,attributes',
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFormsErrors(errors));
  } else {
    yield put(actions.setForms(forms));
  }
}

export function* fetchFormSaga(action) {
  const { form, errors, serverError } = yield call(CoreAPI.fetchForm, {
    datastore: true,
    formSlug: action.payload,
    include: 'details,fields,indexDefinitions',
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFormsErrors(errors));
  } else {
    yield put(actions.setForm(form));
  }
}

export const selectSearchParams = state => ({
  searchParams: state.datastore.searchParams,
  form: state.datastore.currentForm,
  pageToken: state.datastore.nextPageToken,
  pageTokens: state.datastore.pageTokens,
});

export function* fetchSubmissionsSaga() {
  const { searchParams, form, pageToken } = yield select(selectSearchParams);
  const searcher = new CoreAPI.SubmissionSearch(true);
  searcher.index(searchParams.index.name);
  searcher.include('values,details');
  searcher.limit(DATASTORE_LIMIT);
  if (pageToken) {
    searcher.pageToken(pageToken);
  }

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

export function* watchDatastore() {
  yield takeEvery(types.FETCH_FORMS, fetchFormsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
  yield takeEvery(types.FETCH_SUBMISSIONS, fetchSubmissionsSaga);
}
