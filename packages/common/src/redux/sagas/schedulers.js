import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import {
  fetchSubmission,
  deleteSubmission,
  searchSubmissions,
  fetchTeam,
  createUser,
  createMembership,
  deleteMembership,
  SubmissionSearch,
} from '@kineticdata/react';
import md5 from 'md5';
import moment from 'moment';
import { addToast, addToastAlert } from '../modules/toasts';
import {
  actions,
  types,
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULER_OVERRIDES_PAGE_SIZE,
} from '../modules/schedulers';

export function* fetchSchedulersSaga({
  payload: { isSchedulerAdmin = false, type },
}) {
  const query = new SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  if (type) {
    query.index('values[Type],values[Name]').eq('values[Type]', type);
  } else {
    query.index('values[Name]');
  }

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

  const { submissions, error } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: SCHEDULER_FORM_SLUG,
  });

  if (error) {
    yield put(actions.fetchSchedulersFailure(error));
  } else {
    yield put(actions.fetchSchedulersSuccess(submissions));
  }
}

export function* fetchSchedulerSaga({ payload: { id } }) {
  const { submission, error } = yield call(fetchSubmission, {
    id,
    include: 'details,values',
    datastore: true,
  });

  if (error) {
    yield put(actions.fetchSchedulerFailure(error));
  } else {
    yield put(actions.fetchSchedulerSuccess(submission));
    yield all([
      put(
        actions.fetchSchedulerManagersTeamRequest({
          schedulerName: submission.values['Name'],
        }),
      ),
      put(
        actions.fetchSchedulerAgentsTeamRequest({
          schedulerName: submission.values['Name'],
        }),
      ),
    ]);
  }
}

export function* deleteSchedulerSaga({ payload: { id, successCallback } }) {
  const { error } = yield call(deleteSubmission, {
    id,
    datastore: true,
  });

  if (error) {
    addToastAlert({ title: 'Delete failed', message: error.message });
  } else {
    addToast('Scheduler was deleted successfully');
    if (typeof successCallback === 'function') {
      successCallback();
    }
  }
}

export function* fetchSchedulerManagersTeamSaga({
  payload: { schedulerName },
}) {
  const { team } = yield call(fetchTeam, {
    teamSlug: md5(`Role::Scheduler::${schedulerName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  yield put(actions.fetchSchedulerTeamSuccess({ managers: team }));
}

export function* fetchSchedulerAgentsTeamSaga({ payload: { schedulerName } }) {
  const { team } = yield call(fetchTeam, {
    teamSlug: md5(`Scheduler::${schedulerName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  yield put(actions.fetchSchedulerTeamSuccess({ agents: team }));
}

export function* createSchedulerMembershipSaga({
  payload: { username, usernames = [], managers, schedulerName },
}) {
  const toAdd = username ? [username] : usernames;
  if (toAdd.length === 0) {
    addToast({ severity: 'danger', message: 'No users selected to add.' });
    return;
  }

  const results = yield all(
    toAdd.map(u =>
      call(createMembership, {
        team: {
          name: `${managers ? 'Role::' : ''}Scheduler::${schedulerName}`,
        },
        user: { username: u },
      }),
    ),
  );

  let success = false;
  const errorList = results.reduce((errorList, { error }) => {
    if (error) {
      return [...errorList, error.message];
    } else {
      success = true;
      return errorList;
    }
  }, []);

  if (errorList.length > 0) {
    addToastAlert({
      title: `Failed to add ${managers ? 'manager(s)' : 'agent(s)'}`,
      message: errorList.join('\n'),
    });
  } else {
    addToast(
      managers
        ? 'Manager(s) added successfully'
        : 'Agent(s) added successfully',
    );
  }

  if (success) {
    if (managers) {
      yield put(actions.fetchSchedulerManagersTeamRequest({ schedulerName }));
    } else {
      yield put(actions.fetchSchedulerAgentsTeamRequest({ schedulerName }));
    }
  }
}

export function* createUserWithSchedulerMembershipSaga({
  payload: { user, managers, schedulerName },
}) {
  const { error } = yield call(createUser, {
    user: {
      username: user.email,
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`,
      enabled: true,
      spaceAdmin: false,
      memberships: [
        {
          team: {
            name: `${managers ? 'Role::' : ''}Scheduler::${schedulerName}`,
          },
        },
      ],
      profileAttributesMap: {
        'First Name': [user.firstName],
        'Last Name': [user.lastName],
      },
    },
  });
  if (error) {
    addToastAlert({
      title: `Failed to create new ${managers ? 'manager' : 'agent'}`,
      message: error.message,
    });
  } else {
    addToast(
      managers ? 'Manager created successfully' : 'Agent created successfully',
    );
    if (managers) {
      yield put(actions.fetchSchedulerManagersTeamRequest({ schedulerName }));
    } else {
      yield put(actions.fetchSchedulerAgentsTeamRequest({ schedulerName }));
    }
  }
}

export function* deleteSchedulerMembershipSaga({
  payload: { username, managers, schedulerName },
}) {
  const { error } = yield call(deleteMembership, {
    teamSlug: md5(`${managers ? 'Role::' : ''}Scheduler::${schedulerName}`),
    username,
  });

  if (error) {
    addToastAlert({
      title: `Failed to remove ${managers ? 'manager' : 'agent'}`,
      message: error.message,
    });
  } else {
    addToast(
      managers ? 'Manager removed successfully' : 'Agent removed successfully',
    );
    if (managers) {
      yield put(actions.fetchSchedulerManagersTeamRequest({ schedulerName }));
    } else {
      yield put(actions.fetchSchedulerAgentsTeamRequest({ schedulerName }));
    }
  }
}

export function* fetchSchedulerConfigSaga() {
  const schedulerId = yield select(
    state => state.schedulers.scheduler.data.values['Id'],
  );

  const query = new SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index('values[Scheduler Id],values[Event Type]:UNIQUE');
  query.eq('values[Scheduler Id]', schedulerId);

  const { submissions, error } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: SCHEDULER_CONFIG_FORM_SLUG,
  });

  if (error) {
    yield put(actions.fetchSchedulerConfigFailure(error));
  } else {
    yield put(actions.fetchSchedulerConfigSuccess(submissions));
  }
}

export function* deleteSchedulerConfigSaga({ payload: { id } }) {
  const { error } = yield call(deleteSubmission, {
    id,
    datastore: true,
  });

  if (error) {
    addToastAlert({
      title: `Failed to remove event type`,
      message: error.message,
    });
  } else {
    addToast('Event type removed successfully');
    yield put(actions.fetchSchedulerConfigRequest());
  }
}

export function* fetchSchedulerAvailabilitySaga() {
  const schedulerId = yield select(
    state => state.schedulers.scheduler.data.values['Id'],
  );

  const query = new SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index(
    'values[Scheduler Id],values[Day],values[Start Time],values[End Time]',
  );
  query.eq('values[Scheduler Id]', schedulerId);

  const { submissions, error } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: SCHEDULER_AVAILABILITY_FORM_SLUG,
  });

  if (error) {
    yield put(actions.fetchSchedulerAvailabilityFailure(error));
  } else {
    yield put(actions.fetchSchedulerAvailabilitySuccess(submissions));
  }
}

export function* deleteSchedulerAvailabilitySaga({ payload: { id } }) {
  const { error } = yield call(deleteSubmission, {
    id,
    datastore: true,
  });

  if (error) {
    addToastAlert({
      title: `Failed to remove availability`,
      message: error.message,
    });
  } else {
    addToast('Availability removed successfully');
    yield put(actions.fetchSchedulerAvailability());
  }
}

export function* fetchSchedulerOverridesSaga() {
  const schedulerId = yield select(
    state => state.schedulers.scheduler.data.values['Id'],
  );
  const pageToken = yield select(
    state => state.schedulers.scheduler.overrides.pageToken,
  );
  const includePastOverrides = yield select(
    state => state.schedulers.scheduler.includePastOverrides,
  );

  const query = new SubmissionSearch(true);
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

  const { submissions, error, nextPageToken } = yield call(searchSubmissions, {
    search: query.build(),
    datastore: true,
    form: SCHEDULER_OVERRIDE_FORM_SLUG,
  });

  if (error) {
    yield put(actions.fetchSchedulerOverridesFailure(error));
  } else {
    yield put(
      actions.fetchSchedulerOverridesSuccess({
        data: submissions,
        nextPageToken,
      }),
    );
  }
}

export function* deleteSchedulerOverrideSaga({ payload: { id } }) {
  const { error } = yield call(deleteSubmission, {
    id,
    datastore: true,
  });

  if (error) {
    addToastAlert({
      title: `Failed to remove availability override`,
      message: error.message,
    });
  } else {
    addToast('Availability override removed successfully');
    yield put(actions.fetchSchedulerOverridesCurrent());
  }
}

export function* watchSchedulers() {
  yield takeEvery(types.FETCH_SCHEDULERS_REQUEST, fetchSchedulersSaga);
  yield takeEvery(types.FETCH_SCHEDULER_REQUEST, fetchSchedulerSaga);
  yield takeEvery(types.DELETE_SCHEDULER_REQUEST, deleteSchedulerSaga);
  yield takeEvery(
    types.FETCH_SCHEDULER_MANAGERS_TEAM_REQUEST,
    fetchSchedulerManagersTeamSaga,
  );
  yield takeEvery(
    types.FETCH_SCHEDULER_AGENTS_TEAM_REQUEST,
    fetchSchedulerAgentsTeamSaga,
  );
  yield takeEvery(
    types.CREATE_SCHEDULER_MEMBERSHIP_REQUEST,
    createSchedulerMembershipSaga,
  );
  yield takeEvery(
    types.DELETE_SCHEDULER_MEMBERSHIP_REQUEST,
    deleteSchedulerMembershipSaga,
  );
  yield takeEvery(
    types.CREATE_USER_WITH_SCHEDULER_MEMBERSHIP_REQUEST,
    createUserWithSchedulerMembershipSaga,
  );
  yield takeEvery(
    types.FETCH_SCHEDULER_CONFIG_REQUEST,
    fetchSchedulerConfigSaga,
  );
  yield takeEvery(
    types.DELETE_SCHEDULER_CONFIG_REQUEST,
    deleteSchedulerConfigSaga,
  );
  yield takeEvery(
    types.FETCH_SCHEDULER_AVAILABILITY_REQUEST,
    fetchSchedulerAvailabilitySaga,
  );
  yield takeEvery(
    types.DELETE_SCHEDULER_AVAILABILITY_REQUEST,
    deleteSchedulerAvailabilitySaga,
  );
  yield takeEvery(
    [
      types.FETCH_SCHEDULER_OVERRIDES_REQUEST,
      types.FETCH_SCHEDULER_OVERRIDES_CURRENT,
      types.FETCH_SCHEDULER_OVERRIDES_NEXT,
      types.FETCH_SCHEDULER_OVERRIDES_PREVIOUS,
    ],
    fetchSchedulerOverridesSaga,
  );
  yield takeEvery(
    types.DELETE_SCHEDULER_OVERRIDE_REQUEST,
    deleteSchedulerOverrideSaga,
  );
}
