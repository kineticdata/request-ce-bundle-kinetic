import { takeEvery, all, call, put } from 'redux-saga/effects';
import { Map } from 'immutable';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/kinops';

// Fetch Entire App
export function* fetchAppTask() {
  const { profile } = yield call(CoreAPI.fetchProfile, {
    include:
      'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user,attributes,space,space.details,space.attributes,space.kapps,space.kapps.attributes',
  });

  const space = Map(profile.space)
    .delete('kapps')
    .toJS();
  const kapps = profile.space.kapps;
  const me = Map(profile)
    .delete('space')
    .toJS();

  const appData = {
    space,
    kapps,
    profile: me,
  };

  yield put(actions.setApp(appData));
}

export function* watchKinops() {
  yield takeEvery(types.LOAD_APP, fetchAppTask);
}
