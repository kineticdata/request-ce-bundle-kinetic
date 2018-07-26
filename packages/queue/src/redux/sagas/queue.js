import { select, call, put, takeEvery } from 'redux-saga/effects';
import moment from 'moment';
import { CoreAPI } from 'react-kinetic-core';
import isFunction from 'is-function';

import { types, actions } from '../modules/queue';
import { actions as errorActions } from '../modules/errors';

export const ERROR_STATUS_STRING = 'There was a problem retrieving items.';
export const TOO_MANY_STATUS_STRING =
  'Your filter matches too many items. Try a more specific filter.';

export const SUBMISSION_INCLUDES =
  'details,values,attributes,form,children,children.details,children.form,children.values,form.attributes,parent,parent.details,parent.values,parent.form,parent.form.kapp';

export const getAppSettings = state => state.queue.queueApp;
export const getCurrentItem = state => state.queue.queue.currentItem;
export const getKappSlug = state => state.app.config.kappSlug;

/* eslint-disable no-param-reassign */
export const prepareStatusFilter = (searcher, filter) => {
  // There is at least one status add the criteria.
  if (filter.status.size > 0) {
    if (filter.status.size === 1) {
      searcher = searcher.eq('values[Status]', filter.status.first());
    } else {
      searcher = searcher.in('values[Status]', filter.status.toJS());
    }
  }

  return searcher;
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

export const prepareUnassignedFilter = (searcher, filter, appSettings) => {
  if (filter.assignments.unassigned && appSettings.myTeams.size > 0) {
    searcher.and();
    searcher.eq('values[Assigned Individual]', null);
    searcher.in(
      'values[Assigned Team]',
      calculateTeams(appSettings.myTeams, filter.teams).toJS(),
    );
    searcher.end();
  }
};

export const prepareMineFilter = (searcher, filter, appSettings) => {
  if (filter.assignments.mine) {
    searcher.and();
    if (filter.teams.size > 0) {
      searcher.in('values[Assigned Team]', filter.teams.toJS());
    }
    searcher.eq('values[Assigned Individual]', appSettings.profile.username);
    searcher.end();
  }
};

export const prepareTeammatesFilter = (searcher, filter, appSettings) => {
  if (filter.assignments.teammates && appSettings.myTeammates.size > 0) {
    searcher.and();
    searcher.in(
      'values[Assigned Individual]',
      appSettings.myTeammates.map(u => u.username).toJS(),
    );
    searcher.in(
      'values[Assigned Team]',
      calculateTeams(appSettings.myTeams, filter.teams).toJS(),
    );
    searcher.end();
  }
};

export const prepareCreatedByMeFilter = (searcher, filter, appSettings) => {
  if (filter.createdByMe) {
    searcher.and();
    searcher.eq('createdBy', appSettings.profile.username);
    searcher.end();
  }
};

export const buildSearch = (filter, appSettings) => {
  let searcher = new CoreAPI.SubmissionSearch();

  searcher = prepareStatusFilter(searcher, filter);
  searcher = prepareDateRangeFilter(searcher, filter, moment());

  searcher.or();
  // Capture the context of the assignment query operations. We will use this
  // later in the saga to determine if any of the assignment filters were
  // able to properly prepare their query criteria.
  let assignmentContext =
    searcher.queryContext[searcher.queryContext.length - 1];

  prepareMineFilter(searcher, filter, appSettings);
  prepareTeammatesFilter(searcher, filter, appSettings);
  prepareUnassignedFilter(searcher, filter, appSettings);
  prepareCreatedByMeFilter(searcher, filter, appSettings);

  searcher.end();

  return {
    search: searcher.include('details,form,values').build(),
    assignmentContext,
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
  const { search, assignmentContext } = yield call(
    buildSearch,
    filter,
    appSettings,
  );

  // If the assignment query context has nothing then there is a problem
  // with the query and we should immediately yield an empty list.
  if (assignmentContext.length === 0) {
    yield put(actions.setListItems(filter, []));
  } else {
    const { submissions, messages, nextPageToken, serverError } = yield call(
      CoreAPI.searchSubmissions,
      { kapp: kappSlug, search, limit: 1000 },
    );

    if (serverError || (messages && messages.length > 0)) {
      yield put(actions.setListStatus(filter, ERROR_STATUS_STRING));
      yield put(errorActions.addError('Failed to retrieve items!'));
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
  const { submission, serverError } = yield call(CoreAPI.fetchSubmission, {
    id: action.payload,
    include: SUBMISSION_INCLUDES,
  });

  if (!serverError) {
    yield put(actions.setCurrentItem(submission));
  } else {
    yield put(errorActions.addError('Failed to retrieve item!'));
  }
}

export function* updateQueueItemTask(action) {
  const { submission } = yield call(CoreAPI.updateSubmission, {
    id: action.payload.id,
    values: action.payload.values,
    include: SUBMISSION_INCLUDES,
  });

  if (submission) {
    if (isFunction(action.payload.onSuccess)) {
      action.payload.onSuccess(submission);
    }
  } else {
    yield put(errorActions.addError('Failed to update item!'));
  }
}

export function* watchQueue() {
  yield takeEvery(types.FETCH_LIST, fetchListTask);
  yield takeEvery(types.FETCH_CURRENT_ITEM, fetchCurrentItemTask);
  yield takeEvery(types.UPDATE_QUEUE_ITEM, updateQueueItemTask);
}
