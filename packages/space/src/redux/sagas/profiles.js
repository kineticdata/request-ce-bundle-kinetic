import { takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/profiles';
import { fetchUser, fetchProfile, updateProfile } from 'react-kinetic-lib';

const PROFILE_INCLUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export function* fetchProfileSaga({ payload }) {
  const { serverError, profile, user } = payload
    ? yield call(fetchUser, {
        include: PROFILE_INCLUDES,
        username: payload,
      })
    : yield call(fetchProfile, { include: PROFILE_INCLUDES });

  if (serverError) {
    yield put(actions.setProfileError(serverError));
  } else {
    yield put(actions.setProfile(user || profile));
  }
}

export function* updateProfileSaga({ payload }) {
  const { serverError, profile } = yield call(updateProfile, {
    include: PROFILE_INCLUDES,
    profile: payload,
  });

  if (serverError) {
    yield put(actions.setProfileError(serverError));
  } else {
    yield put(actions.setProfile(profile));
  }
}

export function* watchProfiles() {
  yield takeEvery(types.FETCH_PROFILE, fetchProfileSaga);
  yield takeEvery(types.UPDATE_PROFILE, updateProfileSaga);
}
