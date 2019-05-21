import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import {
  SubmissionSearch,
  searchSubmissions,
  fetchTeam,
  createUser,
  fetchForms,
  createMembership,
  deleteMembership,
} from '@kineticdata/react';
import { actions, types, Settings } from '../modules/techBarApp';
import {
  SCHEDULER_FORM_SLUG,
  TECH_BAR_SETTINGS_FORM_SLUG,
} from '../../constants';
import { addToast, addToastAlert } from 'common';
import md5 from 'md5';

export function* fetchAppDataRequestSaga() {
  const schedulersQuery = new SubmissionSearch(true);
  schedulersQuery.include('details,values');
  schedulersQuery.limit('1000');
  schedulersQuery.index('values[Type],values[Name]');
  schedulersQuery.eq('values[Type]', 'TechBar');

  const settingsQuery = new SubmissionSearch(true);
  settingsQuery.include('details,values');
  settingsQuery.limit('1000');
  settingsQuery.index('values[Scheduler Id]:UNIQUE');

  const kappSlug = yield select(state => state.app.kappSlug);

  const [
    { submissions: schedulers, error: schedulersError },
    { submissions: techBarSettings, error: settingsError },
    { forms, error: formsError },
  ] = yield all([
    call(searchSubmissions, {
      search: schedulersQuery.build(),
      datastore: true,
      form: SCHEDULER_FORM_SLUG,
    }),
    call(searchSubmissions, {
      search: settingsQuery.build(),
      datastore: true,
      form: TECH_BAR_SETTINGS_FORM_SLUG,
    }),
    call(fetchForms, {
      kappSlug,
      include: 'details,attributes',
    }),
  ]);

  if (schedulersError || settingsError || formsError) {
    yield put(
      actions.fetchAppDataFailure(
        schedulersError || settingsError || formsError,
      ),
    );
    addToastAlert({
      title: 'Failed to load Tech Bar App.',
      message: (schedulersError || settingsError || formsError).message,
    });
  } else {
    yield put(
      actions.fetchAppDataSuccess({
        schedulers: schedulers.map(scheduler => ({
          ...scheduler,
          settings: Settings(
            techBarSettings.find(
              s => s.values['Scheduler Id'] === scheduler.values['Id'],
            ),
          ),
        })),
        forms,
      }),
    );
  }
}

export function* fetchDisplayTeamRequestSaga({ payload: { techBarName } }) {
  const { team, error } = yield call(fetchTeam, {
    teamSlug: md5(`Role::Tech Bar Display::${techBarName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  if (error) {
    yield put(actions.fetchDisplayTeamFailure(error));
  } else {
    yield put(actions.fetchDisplayTeamSuccess(team));
  }
}

export function* createDisplayTeamMembershipRequestSaga({
  payload: { username, usernames = [], techBarName },
}) {
  const toAdd = username ? [username] : usernames;
  if (toAdd.length === 0) {
    addToast({ message: 'No users selected to add.', severity: 'danger' });
    return;
  }

  const results = yield all(
    toAdd.map(u =>
      call(createMembership, {
        team: {
          name: `Role::Tech Bar Display::${techBarName}`,
        },
        user: { username: u },
      }),
    ),
  );

  let success = false;
  const errorList = results.reduce((errorList, { error }) => {
    if (error) {
      return [...errorList, error];
    } else {
      success = true;
      return errorList;
    }
  }, []);

  if (errorList.length > 0) {
    addToastAlert({
      title: 'Error adding new users.',
      message: errorList.map(e => e.message).join('\n'),
    });
  }

  if (success) {
    addToast(`User${toAdd.length > 1 ? 's' : ''} added successfully.`);
    yield put(actions.fetchDisplayTeamRequest({ techBarName }));
  }
}

export function* deleteDisplayTeamMembershipRequestSaga({
  payload: { username, techBarName },
}) {
  const { error } = yield call(deleteMembership, {
    teamSlug: md5(`Role::Tech Bar Display::${techBarName}`),
    username,
  });

  if (error) {
    addToastAlert({
      title: 'Error removing user.',
      message: error.message,
    });
  } else {
    addToast(`User was removed successfully.`);
    yield put(actions.fetchDisplayTeamRequest({ techBarName }));
  }
}

export function* createDisplayTeamUserRequestSaga({
  payload: { user, teamName, techBarName },
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
            name: `Role::Tech Bar Display::${techBarName}`,
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
      title: 'Error creating user.',
      message: error.message,
    });
  } else {
    addToast(`User was created successfully.`);
    yield put(actions.fetchDisplayTeamRequest({ techBarName }));
  }
}

export function* watchTechBarApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
  yield takeEvery(
    types.FETCH_DISPLAY_TEAM_REQUEST,
    fetchDisplayTeamRequestSaga,
  );
  yield takeEvery(
    types.CREATE_DISPLAY_TEAM_MEMBERSHIP_REQUEST,
    createDisplayTeamMembershipRequestSaga,
  );
  yield takeEvery(
    types.DELETE_DISPLAY_TEAM_MEMBERSHIP_REQUEST,
    deleteDisplayTeamMembershipRequestSaga,
  );
  yield takeEvery(
    types.CREATE_DISPLAY_TEAM_USER_REQUEST,
    createDisplayTeamUserRequestSaga,
  );
}
