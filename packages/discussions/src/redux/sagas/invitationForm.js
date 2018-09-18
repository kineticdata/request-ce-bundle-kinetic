import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { actions as discussionsActions } from '../modules/discussions';
import { actions, types } from '../modules/invitationForm';
import { selectToken } from '../modules/socket';
import { createInvite } from '../../discussion_api';

export function* loadUsersTeamsTask() {
  const shouldFetch = yield select(
    state =>
      state.discussions.invitationForm.users.isEmpty() &&
      !state.discussions.invitationForm.loading,
  );
  if (shouldFetch) {
    yield put(actions.setLoading(true));
    const [{ users }, { teams }] = yield all([
      call(CoreAPI.fetchUsers),
      call(CoreAPI.fetchTeams, { include: 'memberships' }),
    ]);
    yield put(
      users && teams
        ? actions.setUsersTeams(users, teams)
        : actions.setError('There was an error loading the users and teams.'),
    );
  }
}

export function* sendTask(action) {
  const token = yield select(selectToken);
  const { discussion, invitees } = action.payload;

  const existingUsernames = discussion.participants
    .concat(discussion.invitations)
    .filter(involvement => involvement.user)
    .map(involvement => involvement.user.username);
  const existingEmails = discussion.invitations.map(
    invitation => invitation.email,
  );

  const argsList = invitees
    .flatMap(item => (item.team ? item.team.memberships : [item]))
    .map(item => ({
      token,
      discussionId: discussion.id,
      type: item.user ? 'username' : 'email',
      value: item.user ? item.user.username : item.label,
    }))
    .filter(
      args =>
        args.type === 'username'
          ? !existingUsernames.contains(args.value)
          : !existingEmails.contains(args.value),
    );
  const responses = yield all(argsList.map(args => call(createInvite, args)));
  const errors = responses.filter(response => response.error);
  yield put(
    errors.length > 0
      ? actions.setError('There was an error inviting users and/or teams')
      : discussionsActions.closeModal('invitation'),
  );
}

export function* watchInvitationForm() {
  yield all([
    takeEvery(types.LOAD_USERS_TEAMS, loadUsersTeamsTask),
    takeEvery(types.SEND, sendTask),
  ]);
}
