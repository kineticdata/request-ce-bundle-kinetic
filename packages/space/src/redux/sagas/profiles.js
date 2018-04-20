import { takeEvery, call, put, select } from 'redux-saga/effects';
import { actions, types } from '../modules/profiles';
import { actions as kinopsActions } from 'kinops/src/redux/modules/kinops';
import { CoreAPI } from 'react-kinetic-core';

const PROFILE_INCUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export function* fetchProfileSaga({ payload }) {
  const { serverError, profile, user } = payload
    ? yield call(CoreAPI.fetchUser, {
        include: PROFILE_INCUDES,
        username: payload,
      })
    : yield call(CoreAPI.fetchProfile, { include: PROFILE_INCUDES });

  if (serverError) {
    yield put(actions.setProfileError(serverError));
  } else {
    yield put(actions.setProfile(user || profile));
  }
}

export function* updateProfileSaga({ payload }) {
  const { serverError, profile, user } = payload.username
    ? yield call(CoreAPI.updateUser, {
        include: PROFILE_INCUDES,
        username: payload.username,
        user: payload,
      })
    : yield call(CoreAPI.updateProfile, {
        include: PROFILE_INCUDES,
        profile: payload,
      });

  if (serverError) {
    yield put(actions.setProfileError(serverError));
  } else {
    const username = yield select(state => state.kinops.profile.username);
    if (username === user.username) {
      yield put(kinopsActions.loadApp());
    }
    yield put(actions.setProfile(user || profile));
  }
}

export function* watchProfiles() {
  yield takeEvery(types.FETCH_PROFILE, fetchProfileSaga);
  yield takeEvery(types.UPDATE_PROFILE, updateProfileSaga);
}
