import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/toasts';

export function* addNotificationTask(action) {
  yield delay(3000);
  yield put(actions.removeNotification(action.payload.id));
}

export function* watchToasts() {
  yield takeEvery(types.ADD_NOTIFICATION, addNotificationTask);
}
