import { call, put, takeEvery, select } from 'redux-saga/effects';
import { types } from '../modules/app';

function* syncAppState(action) {
  // console.log('sync app state saga called...', action);
}

export function* watchApp() {
  yield takeEvery(types.SYNC_APP_STATE, syncAppState);
}
