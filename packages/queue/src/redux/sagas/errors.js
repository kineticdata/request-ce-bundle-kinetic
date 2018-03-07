import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/errors';

export function* addNotificationTask(action) {
  window.console.log('DELAY', action);
  yield delay(3000);
  yield put(actions.removeNotification(action.payload.id));
}

export function* watchErrors() {
  yield takeEvery(types.ADD_NOTIFICATION, addNotificationTask);
}
