import { takeEvery, put, call, select } from 'redux-saga/effects';
import { fetchSpace, deleteSubmission } from '@kineticdata/react';
import moment from 'moment';
import { commonActions, toastActions } from 'common';
import { actions, types } from '../modules/spaceApp';
import { actions as errorActions } from '../modules/errors';
import { fetchDiscussions, createDiscussionList } from '@kineticdata/react';
import { calculateDateRange } from 'common/src/utils';

export function* fetchAppSettingsSaga() {
  const { space, spaceServerError } = yield call(fetchSpace, {
    include: 'userAttributeDefinitions,userProfileAttributeDefinitions',
  });

  if (spaceServerError) {
    yield put(errorActions.setSystemError(spaceServerError));
  } else {
    yield put(
      actions.setAppSettings({
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
  const { errors, serverError } = yield call(deleteSubmission, {
    datastore: true,
    id: action.payload,
  });

  if (serverError || errors) {
    yield put(errorActions.setSystemError(serverError));
  } else {
    yield put(toastActions.addSuccess('Deleted alert.'));
    yield put(commonActions.fetchAlerts());
  }
}

export function* fetchRecentDiscussionsSaga() {
  const { pageToken, search, isArchived, dateRange } = yield select(state => ({
    pageToken: state.spaceApp.discussionsPageToken,
    search: state.spaceApp.discussionsSearchTerm,
    isArchived: state.spaceApp.showingArchived,
    dateRange: state.spaceApp.searchDateRange,
  }));

  const user = yield select(state => state.app.profile.username);

  const dateParams = isArchived
    ? calculateDateRange(yield call(() => moment()), dateRange)
    : {};

  const { error, discussions, nextPageToken } = yield call(fetchDiscussions, {
    pageToken,
    user,
    title: search,
    isArchived,
    ...dateParams,
  });

  if (error) {
    yield put(actions.setDiscussionsError(error));
  } else {
    yield put(actions.setDiscussions(createDiscussionList(discussions)));
    yield put(actions.pushDiscussionPageToken(nextPageToken || null));
  }
}

export function* watchSpaceApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
  yield takeEvery(
    [
      types.FETCH_DISCUSSIONS,
      types.SET_DISCUSSIONS_SEARCH_TERM,
      types.TOGGLE_SHOWING_ARCHIVED,
      types.SUBMIT_DATE_RANGE_DROPDOWN,
    ],
    fetchRecentDiscussionsSaga,
  );
  yield takeEvery(types.DELETE_ALERT, deleteAlertSaga);
}
