import { call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';

import { actions, types } from '../modules/forms';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchFormsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const { forms, errors, serverError } = yield call(fetchForms, {
    kappSlug,
    include: 'details,categorizations,attributes,kapp',
  });

  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
  } else if (errors) {
    yield put(actions.setFormsErrors(errors));
  } else {
    yield put(actions.setForms(forms));
  }
}

export function* watchForms() {
  yield takeEvery(types.FETCH_FORMS, fetchFormsSaga);
}
