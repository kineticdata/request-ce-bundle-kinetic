import {
  all,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import { List } from 'immutable';
import { CoreAPI } from 'react-kinetic-core';
import { actions, types } from '../modules/queueApp';
import { filterReviver } from '../../records';

const PROFILE_INCLUDES =
  'attributes,profileAttributes,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

export const selectPersonalFilters = state => state.queue.queueApp.myFilters;
export const selectProfile = state => state.queue.queueApp.profile;

// We'll implicitly believe teams to be assignable.
export const isAssignable = team => {
  if (!team.attributes) {
    return true;
  }

  // Fetch the assignable attribute and determine if it is false.
  if (team.attributes instanceof Array) {
    // When we're dealing with sub-elements they're not "translated" for us.
    const assignable = team.attributes.find(a => a.name === 'Assignable');
    if (assignable && assignable.values[0].toUpperCase() === 'FALSE') {
      return false;
    }
  } else if (
    team.attributes.Assignable &&
    team.attributes.Assignable[0].toUpperCase() === 'FALSE'
  ) {
    return false;
  }

  return true;
};

// TODO decide on error handling for these calls.
export function* fetchAppSettingsTask() {
  const kappSlug = yield select(state => state.app.config.kappSlug);
  const {
    profile: { profile },
    forms: { forms },
    teams: { teams },
  } = yield all({
    profile: call(CoreAPI.fetchProfile, {
      include: PROFILE_INCLUDES,
    }),
    forms: call(CoreAPI.fetchForms, {
      kappSlug,
      include: 'details,attributes,fields,fields.details',
    }),
    teams: call(CoreAPI.fetchTeams, {
      include:
        'details,attributes,memberships.memberships.user,memberships.user.details',
    }),
  });

  const allTeams = teams.filter(isAssignable);
  const myTeams = List(
    profile.memberships.map(membership => membership.team).filter(isAssignable),
  );
  const myTeammates = myTeams
    // Get all of the users from all of the teams.
    .flatMap(t => t.memberships)
    // Clean up the odd 'memberships' wrapper on user.
    .map(u => u.user)
    // Ditch any of those users that are me.
    .filter(u => u.username !== profile.username);

  const myFilters = profile.profileAttributes['Queue Personal Filters']
    ? profile.profileAttributes['Queue Personal Filters']
        .map(filterReviver)
        .filter(f => f)
    : List();

  const appSettings = {
    profile,
    myTeams,
    myTeammates,
    myFilters,
    forms,
    allTeams,
  };

  yield put(actions.setAppSettings(appSettings));
}

export function* updatePersonalFilterTask() {
  const myFilters = yield select(selectPersonalFilters);
  const profile = yield select(selectProfile);

  const { serverError } = yield call(CoreAPI.updateProfile, {
    profile: {
      ...profile,
      profileAttributes: {
        ...profile.profileAttributes,
        'Queue Personal Filters': myFilters
          .toJS()
          .map(filter => JSON.stringify(filter)),
      },
    },
    include: PROFILE_INCLUDES,
  });
  if (!serverError) {
    // TODO: What should we do on success?
    // const newFilters = newProfile.profileAttributes['Queue Personal Filters']
    //   ? newProfile.profileAttributes['Queue Personal Filters'].map(f => f)
    //   : List();
  }
}

export function* watchApp() {
  yield takeEvery(types.LOAD_APP_SETTINGS, fetchAppSettingsTask);
  yield takeLatest(
    [
      types.ADD_PERSONAL_FILTER,
      types.REMOVE_PERSONAL_FILTER,
      types.UPDATE_PERSONAL_FILTER,
    ],
    updatePersonalFilterTask,
  );
}
