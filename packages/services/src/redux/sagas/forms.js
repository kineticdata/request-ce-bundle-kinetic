import { call, put, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { SERVICES_KAPP as kappSlug } from '../../constants';
import { actions, types } from '../modules/forms';
import { actions as systemErrorActions } from '../modules/systemError';

export function* fetchFormsSaga() {
  const { forms, errors, serverError } = yield call(CoreAPI.fetchForms, {
    kappSlug,
    include: 'categorizations,attributes',
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
