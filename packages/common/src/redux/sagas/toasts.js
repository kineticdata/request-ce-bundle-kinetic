import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/toasts';

export function* addToastTask(action) {
  yield delay(3000);
  yield put(actions.removeToast(action.payload.id));
}

export function* watchToasts() {
  yield takeEvery(types.ADD_TOAST, addToastTask);
}
