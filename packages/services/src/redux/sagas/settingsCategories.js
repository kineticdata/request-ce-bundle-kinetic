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
    yield put(actions.setCategoriesErrors(serverError));
  } else {
    yield put(actions.setCategories(categories));
  }
}

export function* updateCategorySaga(action) {
  const data = {
    name: action.payload.name,
    slug: action.payload.slug,
    attributesMap: {
      'Sort Order': [action.payload.sort],
      Parent: [action.payload.parent],
    },
  };

  const response = yield call(updateCategory, {
    method: 'put',
    url: `${bundle.apiLocation()}/kapps/services/categories/${
      action.payload.slug
    }`,
    data: JSON.stringify(data),
  });

  if (response.category) {
  } else {
  }

  let promise = axios.request({
    method: 'put',
    url: `${bundle.apiLocation()}/kapps/services/categories/${
      action.payload.slug
    }`,
    data: JSON.stringify(data),
  });
  promise = promise.then(response => ({ category: response.data.category }));
  promise = promise.catch(response => ({ error: response }));
  return promise;
}

export function* watchSettingsCategories() {
  yield takeEvery(types.UPDATE_CATEGORY, updateCategorySaga);
  yield takeEvery(types.FETCH_CATEGORIES, fetchCategoriesSaga);
}
