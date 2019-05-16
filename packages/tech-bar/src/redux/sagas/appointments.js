import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
  fetchBridgedResource,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';
import { actions, types } from '../modules/appointments';
import { addToastAlert } from 'common';
import { APPOINTMENT_FORM_SLUG } from '../../constants';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchUpcomingAppointmentsRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .coreState('Submitted')
    .eq('values[Requested For]', username);

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchAppointmentsFailure(error));
    addToastAlert({
      title: 'Failed to fetch upcoming appointments.',
      message: error.message,
    });
  } else {
    yield put(actions.fetchUpcomingAppointmentsSuccess(submissions));
  }
}

export function* fetchPastAppointmentsRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .coreState('Closed')
    .eq('values[Requested For]', username);

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchAppointmentsFailure(error));
    addToastAlert({
      title: 'Failed to fetch past appointments.',
      message: error.message,
    });
  } else {
    yield put(actions.fetchPastAppointmentsSuccess(submissions));
  }
}

export function* fetchTodayAppointmentsRequestSaga({
  payload: { schedulerId, status },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .eq('values[Scheduler Id]', schedulerId)
    .eq('values[Event Date]', moment().format('YYYY-MM-DD'));
  if (isarray(status) && status.length > 0) {
    searchBuilder.in('values[Status]', status);
  } else if (status) {
    searchBuilder.eq('values[Status]', status);
  }

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchAppointmentsFailure(error));
    addToastAlert({
      title: "Failed to fetch today's appointments.",
      message: error.message,
    });
  } else {
    yield put(
      actions.fetchTodayAppointmentsSuccess(
        submissions.filter(s => s.coreState !== 'Draft'),
      ),
    );
  }
}

export function* setAppointmentsListDateSaga({ payload }) {
  yield put(actions.fetchAppointmentsListRequest(payload));
}

export function* fetchAppointmentsListRequestSaga({
  payload: { schedulerId },
}) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const date = yield select(state => state.appointments.listDate);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .eq('values[Scheduler Id]', schedulerId)
    .eq('values[Event Date]', date.format('YYYY-MM-DD'));

  const { submissions, error } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchAppointmentsFailure(error));
    addToastAlert({
      title: 'Failed to fetch appointments.',
      message: error.message,
    });
  } else {
    yield put(actions.fetchAppointmentsListSuccess(submissions));
  }
}

export function* fetchAppointmentsOverviewRequestSaga({ payload: { id } }) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const { records, error } = yield call(fetchBridgedResource, {
    kappSlug,
    formSlug: 'bridged-resources',
    bridgedResourceName: 'Tech Bar Appointments Overview',
    values: { Id: id, Date: moment().format('YYYY-MM-DD') },
  });

  if (error) {
    yield put(actions.fetchAppointmentsOverviewFailure(error));
    console.error('Failed to fetch appointments overview.', error.message);
  } else {
    yield put(actions.fetchAppointmentsOverviewSuccess(records));
  }
}

export function* watchAppointments() {
  yield takeEvery(
    types.FETCH_UPCOMING_APPOINTMENTS_REQUEST,
    fetchUpcomingAppointmentsRequestSaga,
  );
  yield takeEvery(
    types.FETCH_PAST_APPOINTMENTS_REQUEST,
    fetchPastAppointmentsRequestSaga,
  );
  yield takeEvery(
    types.FETCH_TODAY_APPOINTMENTS_REQUEST,
    fetchTodayAppointmentsRequestSaga,
  );
  yield takeEvery(
    types.SET_APPOINTMENTS_LIST_DATE,
    setAppointmentsListDateSaga,
  );
  yield takeEvery(
    types.FETCH_APPOINTMENTS_LIST_REQUEST,
    fetchAppointmentsListRequestSaga,
  );
  yield takeEvery(
    types.FETCH_APPOINTMENTS_OVERVIEW_REQUEST,
    fetchAppointmentsOverviewRequestSaga,
  );
}
