import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
  fetchBridgedResource,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';
import { actions, types } from '../modules/walkIns';
import { addToastAlert } from 'common';
import { WALK_IN_FORM_SLUG } from '../../constants';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchTodayWalkInsRequestSaga({
  payload: { schedulerId, status },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .eq('values[Scheduler Id]', schedulerId)
    .eq('values[Date]', moment().format('YYYY-MM-DD'));
  if (isarray(status) && status.length > 0) {
    searchBuilder.in('values[Status]', status);
  } else if (status) {
    searchBuilder.eq('values[Status]', status);
  }

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: WALK_IN_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchWalkInsFailure(error));
    addToastAlert({
      title: "Failed to fetch today's walk-ins.",
      message: error.message,
    });
  } else {
    yield put(
      actions.fetchTodayWalkInsSuccess(
        submissions.filter(s => s.coreState !== 'Draft'),
      ),
    );
  }
}

export function* fetchWalkInsOverviewRequestSaga({ payload: { id } }) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const { records, error } = yield call(fetchBridgedResource, {
    kappSlug,
    formSlug: 'bridged-resources',
    bridgedResourceName: 'Tech Bar Walk-Ins Overview',
    values: { Id: id, Date: moment().format('YYYY-MM-DD') },
  });

  if (error) {
    yield put(actions.fetchWalkInsOverviewFailure(error));
    console.error('Failed to fetch walk-ins overview.', error.message);
  } else {
    yield put(actions.fetchWalkInsOverviewSuccess(records));
  }
}

export function* watchWalkIns() {
  yield takeEvery(
    types.FETCH_TODAY_WALK_INS_REQUEST,
    fetchTodayWalkInsRequestSaga,
  );
  yield takeEvery(
    types.FETCH_WALK_INS_OVERVIEW_REQUEST,
    fetchWalkInsOverviewRequestSaga,
  );
}
