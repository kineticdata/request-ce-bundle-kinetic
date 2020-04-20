import { takeEvery, call, put } from 'redux-saga/effects';
import {
  createUser,
  updateUser,
  deleteUser,
  fetchUser,
  fetchUsers,
} from '@kineticdata/react';
import { types, actions } from '../modules/settingsUsers';
import { actions as errorActions } from '../modules/errors';
import { addToast, addToastAlert } from 'common';

const USER_INCLUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export function* cloneUserSaga({ payload }) {
  yield console.log('payload:', payload);
  const { error: cloneError, user: cloneUser } = yield call(fetchUser, {
    include: USER_INCLUDES,
    username: payload.cloneUserUsername,
  });

  if (cloneError) {
    yield put(actions.setUserError(cloneError));
  } else {
    const { error, user } = yield call(updateUser, {
      username: payload.user.username,
      user: {
        ...payload.user,
        preferredLocale: cloneUser.preferredLocale,
        timezone: cloneUser.timezone,
        attributesMap: cloneUser.attributesMap,
        memberships: cloneUser.memberships,
      },
    });

    if (error) {
      addToastAlert({
        title: 'Error Cloning User',
        message: error.message,
      });
      yield put(actions.cloneUserComplete(payload));
    }

    addToast(
      `${user.username} cloned successfully from ${payload.cloneUserUsername}`,
    );
    if (typeof payload.callback === 'function') {
      payload.callback(user);
    }
    yield put(actions.cloneUserComplete(payload));
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

export function* fetchAllUsersSaga(action) {
  const { users, serverError } = yield call(fetchUsers, {});
  yield put(actions.setExportCount(users.length));

  if (serverError) {
    // What should we do?
    console.log(serverError);
  } else {
    yield put(actions.setExportUsers(users));
  }
}

export function* watchSettingsUsers() {
  yield takeEvery(types.DELETE_USER, deleteUserSaga);
  yield takeEvery(types.CLONE_USER_REQUEST, cloneUserSaga);
  yield takeEvery(types.FETCH_ALL_USERS, fetchAllUsersSaga);
}
