import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
  fetchSubmission,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';
import { actions, types, WALK_IN_FORM_SLUG } from '../modules/walkIns';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchWalkInSaga({ payload }) {
  const { submission, errors, serverError } = yield call(fetchSubmission, {
    id: payload,
    include: 'details,values',
  });

  if (serverError) {
    yield put(
      actions.setWalkInErrors([serverError.error || serverError.statusText]),
    );
  } else if (errors) {
    yield put(actions.setWalkInErrors(errors));
  } else {
    yield put(actions.setWalkIn(submission));
  }
}

export function* fetchTodayWalkInsSaga({ payload: { schedulerId, status } }) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
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

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: WALK_IN_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setTodayWalkInErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setTodayWalkInErrors(errors));
  } else {
    yield put(
      actions.setTodayWalkIns(submissions.filter(s => s.coreState !== 'Draft')),
    );
  }
}

export function* fetchWalkInsOverviewSaga({ payload: { id } }) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const { records, serverError } = yield call(CoreAPI.fetchBridgedResource, {
    kappSlug,
    formSlug: 'bridged-resources',
    bridgedResourceName: 'Tech Bar Walk-Ins Overview',
    values: { Id: id, Date: moment().format('YYYY-MM-DD') },
  });

  if (serverError) {
    yield put(
      actions.setWalkInsOverviewErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else {
    yield put(actions.setWalkInsOverview(records));
  }
}

export function* watchWalkIns() {
  yield takeEvery(types.FETCH_WALK_IN, fetchWalkInSaga);
  yield takeEvery(types.FETCH_TODAY_WALK_INS, fetchTodayWalkInsSaga);
  yield takeEvery(types.FETCH_WALK_INS_OVERVIEW, fetchWalkInsOverviewSaga);
}
