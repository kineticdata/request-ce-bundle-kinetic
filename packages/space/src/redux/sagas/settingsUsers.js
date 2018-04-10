import { takeEvery, call, put } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { types, actions } from '../modules/settingsUsers';

import { actions as errorActions } from '../modules/errors';

export function* fetchUsersSaga() {
  const { users, serverError } = yield call(CoreAPI.fetchUsers);

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(
      actions.setUsers(
        users.filter(user => !user.username.endsWith('@kinops.io')),
      ),
    );
  }
}

export function* updateUserSaga({ payload }) {
  debugger
  const { serverError, user } = yield call(CoreAPI.updateUser, {
    include: 'attributes,memberships,profileAttributes',
    username: payload.username,
    user: payload,
  });

  if (serverError) {
    yield put(actions.setUserError(serverError));
  } else {
    yield put(actions.setUser(user));
  }
}

export function* watchSettingsUsers() {
  yield takeEvery(types.FETCH_USERS, fetchUsersSaga);
  yield takeEvery(types.UPDATE_USER, updateUserSaga);
}
