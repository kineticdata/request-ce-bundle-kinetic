import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchCategories, fetchForms } from '@kineticdata/react';

import { actions, types } from '../modules/servicesApp';

export function* fetchAppDataRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const [
    { categories, error: categoriesError },
    { forms, error: formsError },
  ] = yield all([
    call(fetchCategories, {
      kappSlug,
      include:
        'attributes,categorizations.form,categorizations.form.attributes',
    }),
    call(fetchForms, {
      kappSlug,
      include: 'details,categorizations,attributes,kapp',
      q: 'category = "home-page-services" AND status = "Active"',
      limit: 1000,
    }),
  ]);

  if (categoriesError || formsError) {
    yield put(actions.fetchAppDataFailure(categoriesError || formsError));
  } else {
    yield put(actions.fetchAppDataSuccess({ categories, forms }));
  }
}

export function* watchServicesApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
