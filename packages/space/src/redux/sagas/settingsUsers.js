import { takeEvery, call, put, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';

import { actions as kinopsActions } from 'kinops/src/redux/modules/kinops';
import { types, actions } from '../modules/settingsUsers';
import { actions as errorActions } from '../modules/errors';

const USER_INCLUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export function* fetchUserSaga({ payload }) {
  const { serverError, user } = yield call(CoreAPI.fetchUser, {
    include: USER_INCLUDES,
    username: payload,
  });
  if (serverError) {
    yield put(actions.setUserError(serverError));
  } else {
    yield put(actions.setUser(user));
  }
}

export function* updateUserSaga({ payload }) {
  const { serverError, user } = yield call(CoreAPI.updateUser, {
    include: USER_INCLUDES,
    username: payload.username,
    user: payload,
  });

  if (serverError) {
    yield put(actions.setUserError(serverError));
  } else {
    const username = yield select(state => state.kinops.profile.username);
    if (username === user.username) {
      yield put(kinopsActions.loadApp());
    }
    yield put(actions.setUser(user));
  }
}

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

export function* deleteUserSaga(payload) {
  yield call(CoreAPI.deleteUser, payload);
}

export function* watchSettingsUsers() {
  yield takeEvery(types.FETCH_USERS, fetchUsersSaga);
  yield takeEvery(types.FETCH_USER, fetchUserSaga);
  yield takeEvery(types.UPDATE_USER, updateUserSaga);
  yield takeEvery(types.DELETE_USER, deleteUserSaga);
}
