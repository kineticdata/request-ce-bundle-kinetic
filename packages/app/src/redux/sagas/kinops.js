import { takeEvery, call, put } from 'redux-saga/effects';
import { Map } from 'immutable';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/kinops';
import semver from 'semver';

const MINIMUM_CE_VERSION = '2.0.2';

// Fetch Entire App
export function* fetchAppTask() {
  const { version } = yield call(CoreAPI.fetchVersion);

  // Check to make sure the version is compatible with this bundle.
  if (
    semver.satisfies(semver.coerce(version.version), `>=${MINIMUM_CE_VERSION}`)
  ) {
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
      version,
    };

    yield put(actions.setApp(appData));
  } else {
    window.alert(
      `You must be running Kinetic Request v${MINIMUM_CE_VERSION} or later in order to use this app. You are currently running v${version}.`,
    );
  }
}

export function* watchKinops() {
  yield takeEvery(types.LOAD_APP, fetchAppTask);
}
