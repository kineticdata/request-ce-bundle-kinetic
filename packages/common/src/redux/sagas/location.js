import { put, takeEvery } from 'redux-saga/effects';
import { actions } from '../modules/toasts';
import { LOCATION_CHANGE } from 'redux-first-history';

export function* locationChangedSaga() {
  yield put(actions.clearToastAlerts());
}

export function* watchLocationChange() {
  yield takeEvery(LOCATION_CHANGE, locationChangedSaga);
}
