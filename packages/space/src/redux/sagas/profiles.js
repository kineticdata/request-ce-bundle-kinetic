import { takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/profiles';
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
    // Fetch a specific user.
    yield put(actions.setProfileError(serverError));
  } else {
    yield put(actions.setProfile(user || profile));
  }
}

export function* updateProfileSaga({ payload }) {
  const { serverError, profile } = yield call(CoreAPI.updateProfile, {
    include: PROFILE_INCUDES,
    profile: payload,
  });

  if (serverError) {
    // Fetch a specific user.
    yield put(actions.setProfileError(serverError));
  } else {
    yield put(actions.setProfile(profile));
  }
}

export function* watchProfiles() {
  yield takeEvery(types.FETCH_PROFILE, fetchProfileSaga);
  yield takeEvery(types.UPDATE_PROFILE, updateProfileSaga);
}
