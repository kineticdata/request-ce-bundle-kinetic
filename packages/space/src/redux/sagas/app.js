import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import { commonActions } from 'common';
import { actions, types, selectServerUrl } from '../modules/app';
import { actions as errorActions } from '../modules/errors';

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
    yield put(commonActions.addSuccess('Deleted alert.'));
    yield put(commonActions.fetchAlerts());
  }
}

export function* createDiscussionSaga({ payload }) {
  const responseUrl = yield select(selectServerUrl);

  const { error, issue } = yield call(
    DiscussionAPI.createIssue,
    { name: payload },
    responseUrl,
  );

  if (error) {
    yield put(actions.setDiscussionsError(error));
  } else {
    yield put(push(`/discussions/${issue.guid}`));
  }
}

export function* fetchRecentDiscussionsSaga() {
  const responseUrl = yield select(selectServerUrl);

  // First we need to determine if the user is authenticated in Response.
  const { error: authenticationError } = yield call(
    DiscussionAPI.fetchResponseProfile,
    responseUrl,
  );
  if (authenticationError) {
    yield call(DiscussionAPI.getResponseAuthentication, responseUrl);
  }

  const { limit, offset, search } = yield select(state => ({
    limit: state.app.discussionsLimit,
    offset: state.app.discussionsOffset,
    search: state.app.discussionsSearchTerm,
  }));

  const { error, issues } = !!search
    ? yield call(DiscussionAPI.searchIssues, responseUrl, search, limit, offset)
    : yield call(DiscussionAPI.fetchMyOpenIssues, responseUrl, limit, offset);

  if (error) {
    yield put(actions.setDiscussionsError(error));
  } else {
    yield put(actions.setDiscussions(issues));
  }
}

export function* watchApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
  yield takeEvery(
    [types.FETCH_DISCUSSIONS, types.SET_DISCUSSIONS_SEARCH_TERM],
    fetchRecentDiscussionsSaga,
  );
  yield takeEvery(types.CREATE_DISCUSSION, createDiscussionSaga);
  yield takeEvery(types.DELETE_ALERT, deleteAlertSaga);
}
