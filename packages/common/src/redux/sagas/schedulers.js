import { Map } from 'immutable';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import md5 from 'md5';
import moment from 'moment';
import { actions as toastActions } from '../modules/toasts';
import {
  actions,
  types,
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULER_OVERRIDES_PAGE_SIZE,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../modules/schedulers';

export function* fetchSchedulersSaga({
  payload: { isSchedulerAdmin = false },
}) {
  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index('values[Name]');

  if (!isSchedulerAdmin) {
    const schedulerNames = yield select(state =>
      state.app.profile.memberships
        .filter(membership =>
          membership.team.name.startsWith('Role::Scheduler::'),
        )
        .map(membership =>
          membership.team.name.replace(/^Role::Scheduler::/, ''),
        ),
    );
    query.in('values[Name]', schedulerNames);
  }

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: SCHEDULER_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(
      actions.setSchedulersErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setSchedulersErrors(errors));
  } else {
    yield put(actions.setSchedulers(submissions));
  }
}

export function* fetchSchedulerSaga({ payload: { id } }) {
  const { submission, errors, serverError } = yield call(
    CoreAPI.fetchSubmission,
    {
      id,
      include: 'details,values',
      datastore: true,
    },
  );

  if (serverError) {
    yield put(
      actions.setSchedulerErrors([serverError.error || serverError.statusText]),
    );
  } else if (errors) {
    yield put(actions.setSchedulerErrors(errors));
  } else {
    yield put(actions.setScheduler(submission));
    yield all([
      put(
        actions.fetchSchedulerManagersTeam({
          schedulerName: submission.values['Name'],
        }),
      ),
      put(
        actions.fetchSchedulerAgentsTeam({
          schedulerName: submission.values['Name'],
        }),
      ),
    ]);
  }
}

export function* fetchSchedulerManagersTeamSaga({
  payload: { schedulerName },
}) {
  const { team } = yield call(CoreAPI.fetchTeam, {
    teamSlug: md5(`Role::Scheduler::${schedulerName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  yield put(actions.setSchedulerTeams({ managers: team }));
}

export function* fetchSchedulerAgentsTeamSaga({ payload: { schedulerName } }) {
  const { team } = yield call(CoreAPI.fetchTeam, {
    teamSlug: md5(`Scheduler::${schedulerName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  yield put(actions.setSchedulerTeams({ agents: team }));
}

export function* fetchSchedulerConfigSaga() {
  const schedulerId = yield select(
    state => state.common.schedulers.scheduler.data.values['Id'],
  );

  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index('values[Scheduler Id],values[Event Type]:UNIQUE');
  query.eq('values[Scheduler Id]', schedulerId);

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: SCHEDULER_CONFIG_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(
      actions.setSchedulerConfigErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setSchedulerConfigErrors(errors));
  } else {
    yield put(actions.setSchedulerConfig(submissions));
  }
}

export function* deleteSchedulerConfigSaga({ payload: { id } }) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id,
    datastore: true,
  });

  if (serverError) {
    yield put(
      toastActions.addError(
        serverError.error || serverError.statusText,
        'Error',
      ),
    );
  } else if (errors) {
    yield put(toastActions.addError(errors.join(' '), 'Error'));
  } else {
    yield put(actions.fetchSchedulerConfig());
  }
}

export function* fetchSchedulerAvailabilitySaga() {
  const schedulerId = yield select(
    state => state.common.schedulers.scheduler.data.values['Id'],
  );

  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index(
    'values[Scheduler Id],values[Day],values[Start Time],values[End Time]',
  );
  query.eq('values[Scheduler Id]', schedulerId);

  const { submissions, errors, serverError } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: SCHEDULER_AVAILABILITY_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(
      actions.setSchedulerAvailabilityErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setSchedulerAvailabilityErrors(errors));
  } else {
    yield put(actions.setSchedulerAvailability(submissions));
  }
}

export function* deleteSchedulerAvailabilitySaga({ payload: { id } }) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id,
    datastore: true,
  });

  if (serverError) {
    yield put(
      toastActions.addError(
        serverError.error || serverError.statusText,
        'Error',
      ),
    );
  } else if (errors) {
    yield put(toastActions.addError(errors.join(' '), 'Error'));
  } else {
    yield put(actions.fetchSchedulerAvailability());
  }
}

export function* fetchSchedulerOverridesSaga() {
  const schedulerId = yield select(
    state => state.common.schedulers.scheduler.data.values['Id'],
  );
  const pageToken = yield select(
    state => state.common.schedulers.scheduler.overrides.currentPageToken,
  );
  const includePastOverrides = yield select(
    state => state.common.schedulers.scheduler.includePastOverrides,
  );

  const query = new CoreAPI.SubmissionSearch(true);
  query.index(
    'values[Scheduler Id],values[Date],values[Start Time],values[End Time]',
  );
  query.include('details,values');
  query.limit(SCHEDULER_OVERRIDES_PAGE_SIZE);
  query.sortDirection('DESC');
  query.eq('values[Scheduler Id]', schedulerId);
  if (pageToken) {
    query.pageToken(pageToken);
  }
  if (!includePastOverrides) {
    query.gteq('values[Date]', moment().format('YYYY-MM-DD'));
  }

  const { submissions, errors, serverError, nextPageToken } = yield call(
    CoreAPI.searchSubmissions,
    {
      search: query.build(),
      datastore: true,
      form: SCHEDULER_OVERRIDE_FORM_SLUG,
    },
  );

  if (serverError) {
    yield put(
      actions.setSchedulerOverridesErrors([
        serverError.error || serverError.statusText,
      ]),
    );
  } else if (errors) {
    yield put(actions.setSchedulerOverridesErrors(errors));
  } else {
    yield put(
      actions.setSchedulerOverrides({
        data: submissions,
        nextPageToken,
      }),
    );
  }
}

export function* deleteSchedulerOverrideSaga({ payload: { id } }) {
  const { errors, serverError } = yield call(CoreAPI.deleteSubmission, {
    id,
    datastore: true,
  });

  if (serverError) {
    yield put(
      toastActions.addError(
        serverError.error || serverError.statusText,
        'Error',
      ),
    );
  } else if (errors) {
    yield put(toastActions.addError(errors.join(' '), 'Error'));
  } else {
    yield put(actions.fetchCurrentSchedulerOverrides());
  }
}

export function* watchSchedulers() {
  yield takeEvery(types.FETCH_SCHEDULERS, fetchSchedulersSaga);
  yield takeEvery(types.FETCH_SCHEDULER, fetchSchedulerSaga);
  yield takeEvery(
    types.FETCH_SCHEDULER_MANAGERS_TEAM,
    fetchSchedulerManagersTeamSaga,
  );
  yield takeEvery(
    types.FETCH_SCHEDULER_AGENTS_TEAM,
    fetchSchedulerAgentsTeamSaga,
  );
  yield takeEvery(types.FETCH_SCHEDULER_CONFIG, fetchSchedulerConfigSaga);
  yield takeEvery(types.DELETE_SCHEDULER_CONFIG, deleteSchedulerConfigSaga);
  yield takeEvery(
    types.FETCH_SCHEDULER_AVAILABILITY,
    fetchSchedulerAvailabilitySaga,
  );
  yield takeEvery(
    types.DELETE_SCHEDULER_AVAILABILITY,
    deleteSchedulerAvailabilitySaga,
  );
  yield takeEvery(
    [
      types.FETCH_SCHEDULER_OVERRIDES,
      types.FETCH_CURRENT_SCHEDULER_OVERRIDES,
      types.FETCH_NEXT_SCHEDULER_OVERRIDES,
      types.FETCH_PREVIOUS_SCHEDULER_OVERRIDES,
    ],
    fetchSchedulerOverridesSaga,
  );
  yield takeEvery(types.DELETE_SCHEDULER_OVERRIDE, deleteSchedulerOverrideSaga);
}
