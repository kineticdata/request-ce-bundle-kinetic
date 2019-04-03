import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
  fetchSubmission,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';
import { actions, types, APPOINTMENT_FORM_SLUG } from '../modules/appointments';
import moment from 'moment';
import isarray from 'isarray';

export function* fetchAppointmentSaga({ payload }) {
  const { submission, errors, serverError } = yield call(fetchSubmission, {
    id: payload,
    include: 'details,values',
  });

  if (serverError) {
    yield put(
      actions.setAppointmentErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setAppointmentErrors(errors));
  } else {
    yield put(actions.setAppointment(submission));
  }
}

export function* fetchUpcomingAppointmentsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .coreState('Submitted')
    .eq('values[Requested For]', username);

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setUpcomingAppointmentErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setUpcomingAppointmentErrors(errors));
  } else {
    yield put(actions.setUpcomingAppointments(submissions));
  }
}

export function* fetchPastAppointmentsSaga() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .coreState('Closed')
    .eq('values[Requested For]', username);

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setPastAppointmentErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setPastAppointmentErrors(errors));
  } else {
    yield put(actions.setPastAppointments(submissions));
  }
}

export function* fetchTodayAppointmentsSaga({
  payload: { schedulerId, status },
}) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
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

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setTodayAppointmentErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setTodayAppointmentErrors(errors));
  } else {
    yield put(
      actions.setTodayAppointments(
        submissions.filter(s => s.coreState !== 'Draft'),
      ),
    );
  }
}

export function* fetchAppointmentsListSaga({ payload: { schedulerId } }) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const date = yield select(state => state.techBar.appointments.list.date);
  const searchBuilder = new SubmissionSearch()
    .limit(1000)
    .include('details,values')
    .eq('values[Scheduler Id]', schedulerId)
    .eq('values[Event Date]', date.format('YYYY-MM-DD'));

  const { submissions, errors, serverError } = yield call(searchSubmissions, {
    search: searchBuilder.build(),
    form: APPOINTMENT_FORM_SLUG,
    kapp: kappSlug,
  });

  if (serverError) {
    yield put(
      actions.setAppointmentsListErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setAppointmentsListErrors(errors));
  } else {
    yield put(actions.setAppointmentsList(submissions));
  }
}

export function* fetchAppointmentsOverviewSaga({ payload: { id } }) {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const { records, serverError } = yield call(CoreAPI.fetchBridgedResource, {
    kappSlug,
    formSlug: 'bridged-resources',
    bridgedResourceName: 'Tech Bar Appointments Overview',
    values: { Id: id, Date: moment().format('YYYY-MM-DD') },
  });

  if (serverError) {
    yield put(
      actions.setAppointmentsOverviewErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else {
    yield put(actions.setAppointmentsOverview(records));
  }
}

export function* watchAppointments() {
  yield takeEvery(types.FETCH_APPOINTMENT, fetchAppointmentSaga);
  yield takeEvery(
    types.FETCH_UPCOMING_APPOINTMENTS,
    fetchUpcomingAppointmentsSaga,
  );
  yield takeEvery(types.FETCH_PAST_APPOINTMENTS, fetchPastAppointmentsSaga);
  yield takeEvery(types.FETCH_TODAY_APPOINTMENTS, fetchTodayAppointmentsSaga);
  yield takeEvery(
    [types.FETCH_APPOINTMENTS_LIST, types.SET_APPOINTMENTS_DATE],
    fetchAppointmentsListSaga,
  );
  yield takeEvery(
    types.FETCH_APPOINTMENTS_OVERVIEW,
    fetchAppointmentsOverviewSaga,
  );
}
