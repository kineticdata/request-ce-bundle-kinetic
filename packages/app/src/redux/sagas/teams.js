import { takeEvery, call, put } from 'redux-saga/effects';
import { fetchTeams, fetchTeam } from '@kineticdata/react';

import { actions, types } from '../modules/teams';

export function* fetchTeamsRequestSaga() {
  const { teams, error } = yield call(fetchTeams, {
    limit: 1000,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (error) {
    yield put(actions.fetchTeamsFailure(error));
  } else {
    yield put(actions.fetchTeamsSuccess(teams));
  }
}

export function* fetchTeamRequestSaga({ payload }) {
  const { team, error } = yield call(fetchTeam, {
    limit: 1000,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
    teamSlug: payload,
  });

  if (error) {
    yield put(actions.fetchTeamFailure(error));
  } else {
    yield put(actions.fetchTeamSuccess(team));
  }
}

export function* watchTeams() {
  yield takeEvery(types.FETCH_TEAMS_REQUEST, fetchTeamsRequestSaga);
  yield takeEvery(types.FETCH_TEAM_REQUEST, fetchTeamRequestSaga);
}
