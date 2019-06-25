import { takeEvery, all, call, put } from 'redux-saga/effects';
import { addToastAlert } from 'common';
import { fetchTeams, fetchUsers } from '@kineticdata/react';
import { types, actions } from '../modules/about';

export function* fetchAboutRequestSaga() {
  const [
    { teams, error: teamsError },
    { users, error: usersError },
  ] = yield all([call(fetchTeams), call(fetchUsers)]);
  if (teamsError || usersError) {
    addToastAlert({
      message: `Failed to load ${teamsError ? 'Teams' : ''}${
        teamsError && usersError ? ' and ' : ''
      }${usersError ? 'Users' : ''}.`,
    });
  }
  yield put(actions.fetchAboutComplete({ teams, users }));
}

export function* watchAbout() {
  yield takeEvery(types.FETCH_ABOUT_REQUEST, fetchAboutRequestSaga);
}
