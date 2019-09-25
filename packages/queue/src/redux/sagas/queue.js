import { select, call, put, takeEvery } from 'redux-saga/effects';
import moment from 'moment';
import {
  SubmissionSearch,
  searchSubmissions,
  fetchSubmission,
  updateSubmission,
} from '@kineticdata/react';
import isFunction from 'is-function';
import { addToastAlert } from 'common';

import { types, actions } from '../modules/queue';

export const ERROR_STATUS_STRING = 'There was a problem retrieving items.';
export const TOO_MANY_STATUS_STRING =
  'Your filter matches too many items. Try a more specific filter.';

export const SUBMISSION_INCLUDES =
  'details,values,attributes,form,form.kapp,children,children.details,children.form,children.form.kapp,children.values,form.attributes,parent,parent.details,parent.values,parent.form,parent.form.kapp';

export const getAppSettings = state => state.queueApp;
export const getCurrentItem = state => state.queue.currentItem;
export const getKappSlug = state => state.app.kappSlug;

/* eslint-disable no-param-reassign */
export const prepareStatusFilter = (searcher, filter) => {
  // There is at least one status add the criteria.
  if (filter.status.size > 0) {
    if (filter.status.size === 1) {
      searcher.eq('values[Status]', filter.status.first());
    } else {
      searcher.in('values[Status]', filter.status.toJS());
    }
  }
};

export const prepareDateRangeFilter = (searcher, filter, now) => {
  if (filter.dateRange.custom) {
    searcher.sortBy(
      filter.dateRange.timeline === 'completedAt'
        ? 'updatedAt'
        : filter.dateRange.timeline,
    );
    searcher.startDate(moment(filter.dateRange.start).toDate());
    searcher.endDate(
      moment(filter.dateRange.end)
        .add(1, 'day')
        .toDate(),
    );
  } else if (filter.dateRange.preset !== '') {
    // Compute the number of days specified in the preset date range, just use
    // regex to get the number. If the string does not match the pattern log a
    // warning and default to 7.
    const match = filter.dateRange.preset.match(/^(\d+)days$/);
    const numberOfDays = match ? parseInt(match[1], 10) : 7;
    if (!match) {
      window.console.warn(
        `Invalid date range filter preset: ${filter.dateRange.preset}`,
      );
    }
    searcher.sortBy(
      filter.dateRange.timeline === 'completedAt'
        ? 'updatedAt'
        : filter.dateRange.timeline,
    );
    searcher.startDate(
      now
        .clone()
        .startOf('day')
        .subtract(numberOfDays, 'days')
        .toDate(),
    );
    searcher.endDate(now.toDate());
  }
  return searcher;
};

const calculateTeams = (myTeams, teams) =>
  teams.isEmpty()
    ? myTeams.map(t => t.name)
    : teams.toSet().intersect(myTeams.map(t => t.name));

export const buildSearch = (filter, appSettings) => {
  let searcher = new SubmissionSearch();

  searcher = prepareDateRangeFilter(searcher, filter, moment());
  prepareStatusFilter(searcher, filter);

  // Make sure there is a valid assignment in the searcher
  let invalidAssignment = true;

  if (filter.createdByMe) {
    searcher.eq('createdBy', appSettings.profile.username);
    invalidAssignment = false;
  }

  if (filter.assignments === 'mine') {
    searcher.eq('values[Assigned Individual]', appSettings.profile.username);
    invalidAssignment = false;
  } else if (
    filter.assignments === 'unassigned' &&
    (appSettings.myTeams.size > 0 || filter.createdByMe)
  ) {
    searcher.eq('values[Assigned Individual]', null);
  }

  if (
    appSettings.myTeams.size > 0 &&
    (filter.teams.size > 0 ||
      (filter.assignments !== 'mine' && !filter.createdByMe))
  ) {
    searcher.in(
      'values[Assigned Team]',
      calculateTeams(appSettings.myTeams, filter.teams).toJS(),
    );
    invalidAssignment = false;
  }

  return {
    search: searcher.include('details,form,form.kapp,values').build(),
    invalidAssignment,
  };
};

export const getSubmissionDate = (submission, key) => {
  if (['createdAt', 'updatedAt', 'closedAt'].includes(key)) {
    return submission[key];
  } else {
    return submission.values[key];
  }
};

export const sortSubmissions = (submissions, filter) =>
  submissions.sort((s1, s2) => {
    const s1Date = getSubmissionDate(s1, filter.sortBy);
    const s2Date = getSubmissionDate(s2, filter.sortBy);

    const beforeIndex = -1;
    const afterIndex = 1;

    if (s1Date && s2Date) {
      if (moment(s1Date).isBefore(s2Date)) {
        return beforeIndex;
      } else if (moment(s1Date).isAfter(s2Date)) {
        return afterIndex;
      }
    } else if (s1Date && !s2Date) {
      return afterIndex;
    } else if (!s1Date && s2Date) {
      return beforeIndex;
    } else {
      const s1Created = getSubmissionDate(s1, 'createdAt');
      const s2Created = getSubmissionDate(s2, 'createdAt');

      if (moment(s1Created).isBefore(s2Created)) {
        return beforeIndex;
      } else if (moment(s1Created).isAfter(s2Created)) {
        return afterIndex;
      }
    }

    return 0;
  });

export function* fetchListTask(action) {
  const filter = action.payload;
  const appSettings = yield select(getAppSettings);
  const kappSlug = yield select(getKappSlug);
  const { search, invalidAssignment } = yield call(
    buildSearch,
    filter,
    appSettings,
  );

  // If invalidAssignment is true, then there is a problem with the query
  // and we should immediately yield an empty list.
  if (invalidAssignment) {
    yield put(actions.setListItems(filter, []));
  } else {
    const { submissions, messages, nextPageToken, error } = yield call(
      searchSubmissions,
      { kapp: kappSlug, search, limit: 1000 },
    );

    if (error || (messages && messages.length > 0)) {
      yield put(actions.setListStatus(filter, ERROR_STATUS_STRING));
      yield put(addToastAlert('Failed to retrieve items!'));
    } else if (nextPageToken) {
      yield put(actions.setListStatus(filter, TOO_MANY_STATUS_STRING));
    } else {
      // Post-process results:
      const sortedSubmissions = yield call(
        sortSubmissions,
        submissions,
        filter,
      );

      yield put(actions.setListItems(filter, sortedSubmissions));
    }
  }
}

export function* fetchCurrentItemTask(action) {
  const { submission, error } = yield call(fetchSubmission, {
    id: action.payload,
    include: SUBMISSION_INCLUDES,
  });

  if (!error) {
    yield put(actions.setCurrentItem(submission));
  } else {
    yield put(addToastAlert('Failed to retrieve item!'));
  }
}

export function* updateQueueItemTask(action) {
  const { submission } = yield call(updateSubmission, {
    id: action.payload.id,
    values: action.payload.values,
    include: SUBMISSION_INCLUDES,
  });

  if (submission) {
    if (isFunction(action.payload.onSuccess)) {
      action.payload.onSuccess(submission);
    }
  } else {
    yield put(addToastAlert('Failed to update item!'));
  }
}

export function* watchQueue() {
  yield takeEvery(types.FETCH_LIST, fetchListTask);
  yield takeEvery(types.FETCH_CURRENT_ITEM, fetchCurrentItemTask);
  yield takeEvery(types.UPDATE_QUEUE_ITEM, updateQueueItemTask);
}
