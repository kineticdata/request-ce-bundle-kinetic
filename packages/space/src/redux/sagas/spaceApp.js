import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import { commonActions, toastActions } from 'common';
import { actions, types } from '../modules/spaceApp';
import { actions as errorActions } from '../modules/errors';
import { selectToken } from 'discussions/src/redux/modules/socket';
import { DiscussionAPI } from 'discussions';

export function* fetchAppSettingsSaga() {
  const [{ users, usersServerError }, { space, spaceServerError }] = yield all([
    call(CoreAPI.fetchUsers),
    call(CoreAPI.fetchSpace, {
      include: 'userAttributeDefinitions,userProfileAttributeDefinitions',
    }),
  ]);

  if (usersServerError || spaceServerError) {
    yield put(
      errorActions.setSystemError(usersServerError || spaceServerError),
    );
  } else {
    yield put(
      actions.setAppSettings({
        spaceAdmins: List(users).filter(u => u.spaceAdmin),
        userAttributeDefinitions: space.userAttributeDefinitions.reduce(
          (memo, item) => {
            memo[item.name] = item;
            return memo;
          },
          {},
        ),
        userProfileAttributeDefinitions: space.userProfileAttributeDefinitions.reduce(
          (memo, item) => {
            memo[item.name] = item;
            return memo;
          },
          {},
        ),
      }),
    );
  }
}

export function* deleteAlertSaga(action) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id: action.payload,
  });

  if (serverError || errors) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(toastActions.addSuccess('Deleted alert.'));
    yield put(commonActions.fetchAlerts());
  }
}

export function* createDiscussionSaga({ payload }) {
  const token = yield select(selectToken);
  const { error, discussion } = yield call(DiscussionAPI.createDiscussion, {
    title: payload.title,
    description: payload.description || payload.title,
    token,
  });

  if (error) {
    yield put(actions.setDiscussionsError(error));
  } else {
    // Invite members to discussion
    if (payload.members) {
      const invites = payload.members.split(',').map(i => i.trim());
      yield all(
        invites.map(invite =>
          call(
            DiscussionAPI.createInvite,
            discussion.id,
            invite,
            payload.description,
          ),
        ),
      );
    }
    yield put(push(`/discussions/${discussion.id}`));
  }
}

export function* fetchRecentDiscussionsSaga() {
  const token = yield select(selectToken);

  const { limit, offset, search } = yield select(state => ({
    limit: state.space.spaceApp.discussionsLimit,
    offset: state.space.spaceApp.discussionsOffset,
    search: state.space.spaceApp.discussionsSearchTerm,
  }));

  const user = yield select(state => state.app.profile.username);

  const { error, discussions } = yield call(DiscussionAPI.fetchDiscussions, {
    token,
    pageToken: offset,
    user,
    title: search,
  });

  if (error) {
    yield put(actions.setDiscussionsError(error));
  } else {
    yield put(actions.setDiscussions(discussions));
  }
}

export function* watchSpaceApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
  yield takeEvery(
    [types.FETCH_DISCUSSIONS, types.SET_DISCUSSIONS_SEARCH_TERM],
    fetchRecentDiscussionsSaga,
  );
  yield takeEvery(types.CREATE_DISCUSSION, createDiscussionSaga);
  yield takeEvery(types.DELETE_ALERT, deleteAlertSaga);
}
