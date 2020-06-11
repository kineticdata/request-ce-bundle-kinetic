import { takeEvery, call, put } from 'redux-saga/effects';
import { push } from 'redux-first-history';
import { fetchUsers, createTeam, deleteTeam } from '@kineticdata/react';
import {
  actions as currentActions,
  types as currentTypes,
} from '../modules/team';
import { actions as errorActions } from '../modules/errors';

export function* fetchUsersSaga() {
  const { users, serverError } = yield call(fetchUsers);

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(
      currentActions.setUsers(
        users.filter(user => !user.username.endsWith('@kinops.io')),
      ),
    );
  }
}

export function* createTeamSaga(action) {
  const { team, serverError } = yield call(createTeam, {
    team: action.payload,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (serverError) {
    yield put(currentActions.setSubmitError(serverError));
  } else {
    yield put(currentActions.setTeam(team));
    yield put(push(`/teams/${team.slug}`));
  }
}

export function* deleteTeamSaga(action) {
  const teamSlug = action.payload.slug;
  const { serverError } = yield call(deleteTeam, {
    teamSlug,
  });

  if (serverError) {
    yield put(currentActions.setDeleteError(serverError));
  } else {
    yield put(push('/settings/teams'));
    yield put(currentActions.resetTeam());
  }
}

export function* watchTeams() {
  yield takeEvery(currentTypes.CREATE_TEAM, createTeamSaga);
  yield takeEvery(currentTypes.DELETE_TEAM, deleteTeamSaga);
  yield takeEvery(currentTypes.FETCH_TEAM, fetchUsersSaga);
}
