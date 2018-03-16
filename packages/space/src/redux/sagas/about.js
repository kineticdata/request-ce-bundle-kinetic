import { takeEvery, all, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { CoreAPI } from 'react-kinetic-core';

import { types, actions } from '../modules/about';
import { actions as systemErrorActions } from '../modules/errors';

export function* fetchAboutSaga() {
  const [teamResult, userResult] = yield all([
    call(CoreAPI.fetchTeams),
    call(CoreAPI.fetchUsers),
  ]);
  const serverError = teamResult.serverError || userResult.serverError;
  if (serverError) {
    yield put(systemErrorActions.setSystemError(serverError));
    yield put(push('/system-error'));
  } else {
    const about = {
      numberOfTeams: teamResult.teams.length,
      numberOfUsers: userResult.users.length,
      spaceAdmins: userResult.users.filter(user => user.spaceAdmin),
    };
    yield put(actions.setAbout(about));
  }
}

export function* watchAbout() {
  yield takeEvery(types.FETCH_ABOUT, fetchAboutSaga);
}
