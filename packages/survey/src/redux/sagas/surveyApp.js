import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';
import { actions, types } from '../modules/surveyApp';
import { addToastAlert } from 'common';

export function* fetchAppDataRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const [{ forms, error }] = yield all([
    call(fetchForms, {
      kappSlug,
      include: 'details,attributes',
    }),
  ]);

  if (error) {
    yield put(actions.fetchAppDataFailure(error));
    addToastAlert({
      title: 'Failed to load Survey App.',
      message: error.message,
    });
  } else {
    yield put(
      actions.fetchAppDataSuccess({
        forms,
      }),
    );
  }
}

export function* watchSurveyApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
