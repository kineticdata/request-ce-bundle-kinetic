import { call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';

import { actions, types } from '../modules/forms';

export function* fetchFormsSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);
  const { forms, error } = yield call(fetchForms, {
    kappSlug,
    include: 'details,categorizations,attributes,kapp',
  });

  if (error) {
    yield put(actions.fetchFormsFailure(error));
  } else {
    yield put(actions.fetchFormsSuccess(forms));
  }
}

export function* watchForms() {
  yield takeEvery(types.FETCH_FORMS_REQUEST, fetchFormsSaga);
}
