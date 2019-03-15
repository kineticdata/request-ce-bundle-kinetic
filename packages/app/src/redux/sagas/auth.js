import { takeEvery, call } from 'redux-saga/effects';
import { socketIdentify } from '@kineticdata/react';
import { types } from '../modules/auth';

export function* setTokenTask(action) {
  yield call(socketIdentify, action.payload);
}

export function* watchAuth() {
  yield takeEvery(types.SET_TOKEN, setTokenTask);
}
