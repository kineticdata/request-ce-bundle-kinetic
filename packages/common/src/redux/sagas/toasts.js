import { call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../modules/toasts';

export function* resolveConfirm({ payload: decision = false }) {
  const confirm = yield select(state => state.toasts.confirm);

  if (confirm) {
    if (decision && typeof confirm.ok === 'function') {
      yield call(confirm.ok);
    }
    if (!decision && typeof confirm.cancel === 'function') {
      yield call(confirm.cancel);
    }
  }

  yield put(actions.closeConfirm());
}

export function* watchToasts() {
  yield takeEvery(types.RESOLVE_CONFIRM, resolveConfirm);
}
