import {
  all,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import { List } from 'immutable';
import {
  fetchProfile,
  fetchForms,
  fetchTeams,
  updateProfile,
} from '@kineticdata/react';
import { Utils } from 'common';
import { actions, types } from '../modules/queueApp';
import { filterReviver } from '../../records';

const PROFILE_INCLUDES =
  'attributes,profileAttributes,profileAttributesMap,memberships,memberships.team,memberships.team.attributes,memberships.team.memberships,memberships.team.memberships.user';

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
  const kappSlug = yield select(state => state.app.kappSlug);
  const {
    profile: { profile, error: profileError },
    forms: { forms, error: formsError },
    teams: { teams, error: teamsError },
  } = yield all({
    profile: call(fetchProfile, {
      include: PROFILE_INCLUDES,
    }),
    forms: call(fetchForms, {
      kappSlug,
      include: 'details,attributes,fields,fields.details,kapp',
    }),
    teams: call(fetchTeams, {
      include:
        'details,attributes,memberships.memberships.user,memberships.user.details',
    }),
  });

  if (profileError || formsError || teamsError) {
    yield put(
      actions.fetchAppDataFailure(
        List([profileError, formsError, teamsError]).filter(e => e),
      ),
    );
  } else {
    const allTeams = teams.filter(isAssignable);
    const myTeams = List(
      profile.memberships
        .map(membership => membership.team)
        .filter(isAssignable),
    ).sortBy(team => team.name);
    const myTeammates = myTeams
      // Get all of the users from all of the teams.
      .flatMap(t => t.memberships)
      // Clean up the odd 'memberships' wrapper on user.
      .map(u => u.user)
      // Remove duplicates
      .groupBy(u => u.username)
      .map(g => g.first())
      .toList()
      // Ditch any of those users that are me.
      .filter(u => u.username !== profile.username);

    const myFilters = Utils.getProfileAttributeValues(
      profile,
      'Queue Personal Filters',
    )
      .map(filterReviver)
      .filter(f => f);

    const appSettings = {
      profile,
      myTeams,
      myTeammates,
      myFilters,
      forms,
      allTeams,
    };

    yield put(actions.fetchAppDataSuccess(appSettings));
  }
}

export function* updatePersonalFilterTask() {
  const myFilters = yield select(state => state.queueApp.myFilters);
  const profile = yield select(state => state.queueApp.profile);

  const { error } = yield call(updateProfile, {
    profile: {
      profileAttributesMap: {
        ...profile.profileAttributesMap,
        'Queue Personal Filters': myFilters
          .toJS()
          .map(filter => JSON.stringify(filter)),
      },
    },
    include: PROFILE_INCLUDES,
  });
  if (!error) {
    // TODO: What should we do on success/error?
    // const newFilters = newProfile.profileAttributes['Queue Personal Filters']
    //   ? newProfile.profileAttributes['Queue Personal Filters'].map(f => f)
    //   : List();
  }
}

export function* watchApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppSettingsTask);
  yield takeLatest(
    [
      types.ADD_PERSONAL_FILTER,
      types.REMOVE_PERSONAL_FILTER,
      types.UPDATE_PERSONAL_FILTER,
    ],
    updatePersonalFilterTask,
  );
}
