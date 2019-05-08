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
import { SCHEDULER_FORM_SLUG } from '../../constants';
import { addError } from 'common';
import md5 from 'md5';

const TECH_BAR_SETTINGS_FORM_SLUG = 'tech-bar-settings';

export function* fetchAppSettingsSaga() {
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
    { submissions: schedulers, serverError: schedulersServerError },
    { submissions: techBarSettings, serverError: settingsServerError },
    { forms, serverError: formsServerError },
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

  if (schedulersServerError || settingsServerError || formsServerError) {
    yield put(
      actions.setAppErrors([
        (schedulersServerError &&
          (schedulersServerError.error || schedulersServerError.statusText)) ||
          (settingsServerError &&
            (settingsServerError.error || settingsServerError.statusText)) ||
          (formsServerError &&
            (formsServerError.error || formsServerError.statusText)),
      ]),
    );
  } else {
    yield put(
      actions.setAppSettings({
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

export function* fetchDisplayTeamSaga({ payload: { techBarName } }) {
  const { team } = yield call(fetchTeam, {
    teamSlug: md5(`Role::Tech Bar Display::${techBarName}`),
    include:
      'attributes,memberships.user,memberships.user.attributes,memberships.user.profileAttributes',
  });
  yield put(actions.setDisplayTeam(team));
}

export function* addDisplayTeamMembershipSaga({
  payload: { username, usernames = [], techBarName },
}) {
  const toAdd = username ? [username] : usernames;
  if (toAdd.length === 0) {
    yield put(addError('No users selected to add.', 'Error'));
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
  const errorList = results.reduce((errorList, { errors, serverError }) => {
    if (serverError) {
      return [...errorList, serverError.error || serverError.statusText];
    } else if (errors) {
      return [...errorList, ...errors];
    } else {
      success = true;
      return errorList;
    }
  }, []);

  if (errorList.length > 0) {
    yield put(addError(errorList.join(' '), 'Error'));
  }

  if (success) {
    yield put(actions.fetchDisplayTeam({ techBarName }));
  }
}

export function* createUserWithDisplayTeamMembershipSaga({
  payload: { user, teamName, techBarName },
}) {
  const { errors, serverError } = yield call(createUser, {
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
  if (serverError) {
    yield put(addError(serverError.error || serverError.statusText, 'Error'));
  } else if (errors) {
    yield put(addError(errors.join(' '), 'Error'));
  } else {
    yield put(actions.fetchDisplayTeam({ techBarName }));
  }
}

export function* removeSchedulerDisplayTeamSaga({
  payload: { username, techBarName },
}) {
  const { errors, serverError } = yield call(deleteMembership, {
    teamSlug: md5(`Role::Tech Bar Display::${techBarName}`),
    username,
  });

  if (serverError) {
    yield put(addError(serverError.error || serverError.statusText, 'Error'));
  } else if (errors) {
    yield put(addError(errors.join(' '), 'Error'));
  } else {
    yield put(actions.fetchDisplayTeam({ techBarName }));
  }
}

export function* watchTechBarApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
  yield takeEvery(types.FETCH_DISPLAY_TEAM, fetchDisplayTeamSaga);
  yield takeEvery(
    types.ADD_DISPLAY_TEAM_MEMBERSHIP,
    addDisplayTeamMembershipSaga,
  );
  yield takeEvery(
    types.CREATE_USER_WITH_DISPLAY_TEAM_MEMBERSHIP,
    createUserWithDisplayTeamMembershipSaga,
  );
  yield takeEvery(
    types.REMOVE_DISPLAY_TEAM_MEMBERSHIP,
    removeSchedulerDisplayTeamSaga,
  );
}
