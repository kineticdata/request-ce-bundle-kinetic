import { takeEvery, put, call, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';
import { actions, types } from '../modules/surveyApp';
import { addToastAlert } from 'common';

export function* fetchAppDataRequestSaga() {
  yield console.log('fetching App data');
  const authenticated = yield select(state => state.app.authenticated);
  const kappSlug = yield select(state => state.app.kappSlug);

  const { forms, error } = yield call(fetchForms, {
    kappSlug,
    include: 'details,attributes',
    public: !authenticated,
  });

  if (error) {
    yield put(actions.fetchAppDataFailure(error));
    addToastAlert({
      title: 'Failed to load Survey App.',
      message: error.message,
    });
  } else {
    const filteredForms = forms.filter(form => form.type !== 'Template');
    yield put(
      actions.fetchAppDataSuccess({
        forms: filteredForms,
      }),
    );
  }
}

export function* watchSurveyApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
