import { Map } from 'immutable';
import { takeEvery, call, put } from 'redux-saga/effects';
import { actions, types } from '../modules/settingsSpace';
import { actions as kinopsActions } from 'kinops/src/redux/modules/kinops';

import { CoreAPI } from 'react-kinetic-core';

const SPACE_SETTING_INCLUDES =
  'kapps,kapps.forms,attributesMap';

const TEAMS_SETTING_INCLUDES =
  'teams';

export function* fetchSpaceSaga({ payload }) {
    const { serverError, space } = yield call(CoreAPI.fetchSpace, {
      include: SPACE_SETTING_INCLUDES,
      space: payload,
    });

    if (serverError) {
      yield put(actions.updateSpaceError(serverError));
    } else {
      yield put(actions.setSpaceSettings(space));
    }
}

export function* fetchTeamsSaga({ payload }) {
    const { serverError, teams } = yield call(CoreAPI.fetchTeams, {
      include: TEAMS_SETTING_INCLUDES,
      teams: payload,
    });

    if (serverError) {
      yield put(actions.updateSpaceError(serverError));
    } else {
      yield put(actions.setSpaceSettingsTeams(teams));
    }
}

export function* updateSpaceSaga({ payload }) {
    const attributes = Map(payload).filter(value => value).map(value => [value]).toJS();
    const { serverError, space } = yield call(CoreAPI.updateSpace, {
        include: SPACE_SETTING_INCLUDES,
        space: {
            attributesMap: attributes,
        }
    });

    if (serverError) {
        yield put(actions.updateSpaceError(serverError));
    } else {
        yield put(kinopsActions.loadApp());
    }
}

export function* watchSettingsSpace() {
  yield takeEvery(types.FETCH_SPACE_SETTINGS, fetchSpaceSaga);
  yield takeEvery(types.FETCH_SPACE_SETTINGS_TEAMS, fetchTeamsSaga);
  yield takeEvery(types.UPDATE_SPACE_SETTINGS, updateSpaceSaga);
}
