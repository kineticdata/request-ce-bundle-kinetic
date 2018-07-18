import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { CoreAPI, bundle } from 'react-kinetic-core';
import { toastActions } from 'common';
import axios from 'axios';
import { actions, types } from '../modules/settingsCategories';

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

  axios.request({
    method: 'put',
    url: `${bundle.apiLocation()}/kapps/services/categories/${
      action.payload.slug
    }`,
    data: JSON.stringify(data),
  });
}

export function* addCategorySaga(action) {
  const data = {
    name: action.payload.name,
    slug: action.payload.slug,
    attributesMap: {
      'Sort Order': [action.payload.sort],
      Parent: [action.payload.parent],
    },
  };

  console.log(JSON.stringify(data));

  axios.request({
    method: 'post',
    url: `${bundle.apiLocation()}/kapps/services/categories/`,
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
  });
}

export function* watchSettingsCategories() {
  yield takeEvery(types.UPDATE_CATEGORY, updateCategorySaga);
  yield takeEvery(types.ADD_CATEGORY, addCategorySaga);
  yield takeEvery(types.FETCH_CATEGORIES, fetchCategoriesSaga);
}
