import { call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions, types } from '../modules/categories';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchCategoriesSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);

  const { categories, errors, serverError } = yield call(
    CoreAPI.fetchCategories,
    { kappSlug, include: 'categorizations,attributes' },
  );

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setCategoriesErrors(errors));
  } else {
    yield put(actions.setCategories(categories));
  }
}

export function* watchCategories() {
  yield takeEvery(types.FETCH_CATEGORIES, fetchCategoriesSaga);
}
