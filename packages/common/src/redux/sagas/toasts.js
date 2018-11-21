import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/toasts';

export function* addToastTask(action) {
  if (!action.payload.keep) {
    yield delay(action.payload.delay === 'long' ? 10000 : 3000);
    yield put(actions.removeToast(action.payload.id));
  }
}

export function* watchToasts() {
  yield takeEvery(types.ADD_TOAST, addToastTask);
}
