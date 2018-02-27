import { call, put, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { SERVICES_KAPP as kappSlug } from '../../constants';
import { actions, types } from '../modules/categories';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchCategoriesSaga() {
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
