import { call, put, takeEvery, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions, types } from '../modules/forms';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchFormsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const { forms, errors, serverError } = yield call(CoreAPI.fetchForms, {
    kappSlug,
    include: 'details,categorizations,attributes',
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
