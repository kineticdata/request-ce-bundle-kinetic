import { takeEvery, call, put } from 'redux-saga/effects';
import { createUser, deleteUser, fetchUser } from '@kineticdata/react';
import { types, actions } from '../modules/settingsUsers';
import { actions as errorActions } from '../modules/errors';

const USER_INCLUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export function* createUserSaga({ payload }) {
  const { serverError, user } = yield call(createUser, {
    include: USER_INCLUDES,
    user: payload,
  });

  if (serverError) {
    yield put(actions.setUserError(serverError));
  } else {
    yield put(actions.setUser(user));
    yield put(actions.fetchUsers());
  }
}

export function* cloneUserSaga({ payload }) {
  const { error, user: origUser } = yield call(fetchUser, {
    include: USER_INCLUDES,
    username: payload.username,
  });

  if (error) {
    yield put(actions.setUserError(error));
  } else {
    yield call(createUserSaga, {
      ...origUser,
      spaceAdmin: payload.spaceAdmin,
      enabled: payload.enabled,
      email: payload.email,
      displayName: payload.displayName,
    });
  }
}

export function* deleteUserSaga({ payload }) {
  const { serverError } = yield call(deleteUser, { username: payload });

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(actions.fetchUsers());
  }
}

export function* watchSettingsUsers() {
  yield takeEvery(types.CREATE_USER, createUserSaga);
  yield takeEvery(types.DELETE_USER, deleteUserSaga);
}
