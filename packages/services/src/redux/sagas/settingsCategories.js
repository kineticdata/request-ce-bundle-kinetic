import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI, bundle } from 'react-kinetic-core';
import { toastActions } from 'common';
import axios from 'axios';
import { actions, types } from '../modules/settingsCategories';
import { Promise } from 'core-js';

export function* fetchCategoriesSaga(action) {
  const { serverError, categories } = yield call(CoreAPI.fetchCategories, {
    kappSlug: action.payload,
    include: 'attributes',
  });

  if (serverError) {
    yield put(
      toastActions.addError('Failed to fetch categories.', 'Fetch Categories'),
    );
    yield put(actions.setCategoriesErrors(serverError));
  } else {
    yield put(actions.setCategories(categories));
  }
}

export function* watchSettingsCategories() {
  yield takeEvery(types.FETCH_CATEGORIES, fetchCategoriesSaga);
}
