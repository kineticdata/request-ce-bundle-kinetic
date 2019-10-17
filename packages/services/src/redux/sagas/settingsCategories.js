import { call, put, select, takeEvery } from 'redux-saga/effects';
import { fetchCategories, updateKapp } from '@kineticdata/react';
import { addToast, addToastAlert } from 'common';
import { actions, types } from '../modules/settingsCategories';

export function* fetchCategoriesSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const { error, categories } = yield call(fetchCategories, {
    kappSlug,
    include: 'attributesMap',
  });

  if (error) {
    addToastAlert('Failed to fetch categories.');
    yield put(actions.fetchCategoriesFailure(error));
  } else {
    yield put(actions.fetchCategoriesSuccess(categories));
  }
}

export function* updateCategoriesSaga(action) {
  const kappSlug = yield select(state => state.app.kappSlug);

  const { error, kapp } = yield call(updateKapp, {
    kappSlug,
    kapp: {
      categories: action.payload,
    },
    include: 'categories,categories.attributesMap',
  });

  if (error) {
    addToastAlert('Error saving categories.');
    yield put(actions.fetchCategoriesFailure(error));
  } else {
    addToast('Categories updated successfully.');
    yield put(actions.fetchCategoriesSuccess(kapp.categories));
    // yield* fetchCategoriesSaga();
  }
}

export function* watchSettingsCategories() {
  yield takeEvery(types.FETCH_CATEGORIES_REQUEST, fetchCategoriesSaga);
  yield takeEvery(types.UPDATE_CATEGORIES_REQUEST, updateCategoriesSaga);
}
