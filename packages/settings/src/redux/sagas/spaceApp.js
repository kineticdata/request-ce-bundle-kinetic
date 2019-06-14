import { takeEvery, put, call } from 'redux-saga/effects';
import { fetchSpace } from '@kineticdata/react';
import { actions, types } from '../modules/spaceApp';
import { actions as errorActions } from '../modules/errors';

export function* fetchAppSettingsSaga() {
  const { space, spaceServerError } = yield call(fetchSpace, {
    include: 'userAttributeDefinitions,userProfileAttributeDefinitions',
  });

  if (spaceServerError) {
    yield put(errorActions.setSystemError(spaceServerError));
  } else {
    yield put(
      actions.setAppSettings({
        userAttributeDefinitions: space.userAttributeDefinitions.reduce(
          (memo, item) => {
            memo[item.name] = item;
            return memo;
          },
          {},
        ),
        userProfileAttributeDefinitions: space.userProfileAttributeDefinitions.reduce(
          (memo, item) => {
            memo[item.name] = item;
            return memo;
          },
          {},
        ),
      }),
    );
  }
}

export function* watchSpaceApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
}
