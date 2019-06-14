import { takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/profile';
import { actions as appActions } from '../modules/app';
import { addToast, addToastAlert } from 'common';
import { fetchUser, fetchProfile, updateProfile } from '@kineticdata/react';

const PROFILE_INCLUDES = [
  'attributes',
  'attributesMap',
  'profileAttributes',
  'profileAttributesMap',
  'memberships',
  'memberships.team',
  'memberships.team.attributes',
  'memberships.team.memberships',
  'memberships.team.memberships.user',
  'space.userAttributeDefinitions',
  'space.userProfileAttributeDefinitions',
].join(',');

export function* fetchProfileRequestSaga({ payload }) {
  console.log('fetch', payload);
  const { user, profile, error } = payload
    ? yield call(fetchUser, {
        include: PROFILE_INCLUDES,
        username: payload,
      })
    : yield call(fetchProfile, { include: PROFILE_INCLUDES });

  if (error) {
    yield put(actions.fetchProfileFailure(error));
  } else {
    yield put(actions.fetchProfileSuccess(user || profile));
  }
}

export function* updateProfileRequestSaga({ payload }) {
  const { profile, error } = yield call(updateProfile, {
    include: PROFILE_INCLUDES,
    profile: payload,
  });

  if (error) {
    addToastAlert({
      title: 'Failed to update profile',
      message: error.message,
    });
  } else {
    addToast('Profile updated successfully');
    yield put(actions.updateProfileSuccess(profile));
    yield put(appActions.fetchProfileRequest());
  }
}

export function* watchProfile() {
  yield takeEvery(types.FETCH_PROFILE_REQUEST, fetchProfileRequestSaga);
  yield takeEvery(types.UPDATE_PROFILE_REQUEST, updateProfileRequestSaga);
}
