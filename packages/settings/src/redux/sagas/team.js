import { takeEvery, call, put, select } from 'redux-saga/effects';
import { push } from 'redux-first-history';
import {
  fetchUsers,
  fetchTeams,
  fetchTeam,
  updateTeam,
  createTeam,
  deleteTeam,
} from '@kineticdata/react';

import {
  actions as listActions,
  types as listTypes,
} from '../modules/teamList';
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

export function* fetchTeamsSaga() {
  const { teams, serverError } = yield call(fetchTeams, {
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(listActions.setTeams(teams));
    yield put(listActions.setRoles(teams));
  }
}

export function* fetchTeamSaga(action) {
  const { team, serverError } = yield call(fetchTeam, {
    teamSlug: action.payload,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(currentActions.setTeam(team));
  }
}

export function* updateTeamSaga(action) {
  const { team, serverError } = yield call(updateTeam, {
    teamSlug: action.payload.slug,
    team: action.payload,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (serverError) {
    yield put(currentActions.setSubmitError(serverError));
  } else {
    yield put(currentActions.setTeam(team));
    yield put(listActions.fetchTeams());
    yield put(push(`/teams/${team.slug}`));
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
    yield put(listActions.addTeam(team));
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
    yield put(listActions.removeTeam(teamSlug));
    yield put(push('/settings/teams'));
    yield put(currentActions.resetTeam());
  }
}

export function* cancelSaveTeamSaga(action) {
  const teamSlug = action.payload.slug;
  if (teamSlug) {
    yield put(push(`/teams/${teamSlug}`));
  } else {
    yield put(push('/settings/teams'));
  }
  yield put(currentActions.resetTeam());
}

export function* watchTeams() {
  yield takeEvery(listTypes.FETCH_TEAMS, fetchTeamsSaga);
  yield takeEvery(currentTypes.FETCH_TEAM, fetchTeamSaga);
  yield takeEvery(currentTypes.UPDATE_TEAM, updateTeamSaga);
  yield takeEvery(currentTypes.CREATE_TEAM, createTeamSaga);
  yield takeEvery(currentTypes.DELETE_TEAM, deleteTeamSaga);
  yield takeEvery(currentTypes.CANCEL_SAVE_TEAM, cancelSaveTeamSaga);
  yield takeEvery(currentTypes.FETCH_TEAM, fetchUsersSaga);
}
