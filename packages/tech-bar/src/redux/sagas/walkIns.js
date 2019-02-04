import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import { actions, types, WALK_IN_FORM_SLUG } from '../modules/walkIns';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchWalkInSaga({ payload }) {
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    {
      id: payload,
      include: 'details,values',
    },
  );

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
  const searchBuilder = new CoreAPI.SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .eq('values[Scheduler Id]', schedulerId)
    .eq('values[Date]', moment().format('YYYY-MM-DD'));
  if (isarray(status) && status.length > 0) {
    searchBuilder.in('values[Status]', status);
  } else if (status) {
    searchBuilder.eq('values[Status]', status);
  }

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: searchBuilder.build(),
      form: WALK_IN_FORM_SLUG,
      kapp: kappSlug,
    },
  );

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

export function* watchWalkIns() {
  yield takeEvery(types.FETCH_WALK_IN, fetchWalkInSaga);
  yield takeEvery(types.FETCH_TODAY_WALK_INS, fetchTodayWalkInsSaga);
}
