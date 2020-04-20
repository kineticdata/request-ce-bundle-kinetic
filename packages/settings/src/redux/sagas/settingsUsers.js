import { takeEvery, call, put } from 'redux-saga/effects';
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsers,
} from '@kineticdata/react';
import { types, actions } from '../modules/settingsUsers';
import { actions as errorActions } from '../modules/errors';
import { addToast, addToastAlert } from 'common';

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
  yield console.log('payload:', payload);
  // const { error: cloneError, user: cloneUser } = yield call(fetchUser, {
  //   include: USER_INCLUDES,
  //   username: payload.cloneUserUsername,
  // });

  // if (cloneError) {
  //   yield put(actions.setUserError(cloneError));
  // } else {
  //   const { error, user } = yield call(createUser, {
  //     user: {
  //       ...cloneUser,
  //       spaceAdmin: payload.spaceAdmin,
  //       enabled: payload.enabled,
  //       email: payload.email,
  //       displayName: payload.displayName,
  //     },
  //   });

  //   if (error) {
  //     addToastAlert({
  //       title: 'Error Cloning User',
  //       message: error.message,
  //     });
  //     yield put(actions.cloneUserComplete(payload));
  //   }

  //   addToast(`${user.username} cloned successfully from ${cloneUser.username}`);
  //   if (typeof payload.callback === 'function') {
  //     payload.callback(user);
  //   }
  //   yield put(actions.cloneUserComplete(payload));
  // }
}

export function* deleteUserSaga({ payload }) {
  const { serverError } = yield call(deleteUser, { username: payload });

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(actions.fetchUsers());
  }
}

export function* fetchAllUsersSaga(action) {
  const { users, serverError } = yield call(fetchUsers, {
    limit: 1000,
  });
  yield put(actions.setExportCount(users.length));

  if (serverError) {
    // What should we do?
    console.log(serverError);
  } else {
    yield put(actions.setExportUsers(users));
  }
}

export function* watchSettingsUsers() {
  yield takeEvery(types.CREATE_USER, createUserSaga);
  yield takeEvery(types.DELETE_USER, deleteUserSaga);
  yield takeEvery(types.CLONE_USER_REQUEST, cloneUserSaga);
  yield takeEvery(types.FETCH_ALL_USERS, fetchAllUsersSaga);
}
