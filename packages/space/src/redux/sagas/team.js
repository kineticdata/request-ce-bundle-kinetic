import { takeEvery, call, put, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import md5 from 'md5';
import { CoreAPI } from 'react-kinetic-core';
import { selectToken } from 'discussions/src/redux/modules/socket';
import { DiscussionAPI } from 'discussions';

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
  const { users, serverError } = yield call(CoreAPI.fetchUsers);

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
  const { teams, serverError } = yield call(CoreAPI.fetchTeams, {
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
  const token = yield select(selectToken);
  const profile = yield select(state => state.app.profile);

  const { team, serverError } = yield call(CoreAPI.fetchTeam, {
    teamSlug: action.payload,
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });

  if (serverError) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(currentActions.setTeam(team));

    const { discussions } = yield call(DiscussionAPI.fetchDiscussions, {
      token,
      relatedItem: {
        type: 'Team',
        key: md5(team.name),
      },
    });

    if (discussions && discussions.length > 0) {
      // Save all of the related discussions.
      yield put(currentActions.setRelatedDiscussions(discussions));

      // If there is only 1 and the user is already a participant, auto-subscribe.
      if (discussions.length === 1) {
        const participating = discussions[0].participants.find(
          p => p.user.username === profile.username,
        );

        if (participating) {
          yield put(currentActions.setCurrentDiscussion(discussions[0]));
        }
      }
    }
  }
}

export function* fetchRelatedDiscussions(action) {
  const token = yield select(selectToken);

  const { discussions } = yield call(DiscussionAPI.fetchDiscussions, {
    token,
    relatedItem: {
      type: 'Team',
      key: action.payload,
    },
  });

  yield put(currentActions.setRelatedDiscussions(discussions));
}

export function* updateTeamSaga(action) {
  const { team, serverError } = yield call(CoreAPI.updateTeam, {
    teamSlug: action.payload.slug,
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

export function* createTeamSaga(action) {
  const { team, serverError } = yield call(CoreAPI.createTeam, {
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
  const { serverError } = yield call(CoreAPI.deleteTeam, {
    teamSlug,
  });

  if (serverError) {
    yield put(currentActions.setDeleteError(serverError));
  } else {
    yield put(listActions.removeTeam(teamSlug));
    yield put(push('/teams'));
    yield put(currentActions.resetTeam());
  }
}

export function* cancelSaveTeamSaga(action) {
  const teamSlug = action.payload.slug;
  if (teamSlug) {
    yield put(push(`/teams/${teamSlug}`));
  } else {
    yield put(push('/teams'));
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
  yield takeEvery(
    currentTypes.FETCH_RELATED_DISCUSSIONS,
    fetchRelatedDiscussions,
  );
}
