import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';
import { actions, types } from '../modules/scaffoldApp';
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
      title: 'Failed to load Scaffold App.',
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

export function* watchScaffoldApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
