import { takeEvery, put, call, select } from 'redux-saga/effects';
import { fetchForms } from '@kineticdata/react';
import { actions, types } from '../modules/surveyApp';
import { addToastAlert } from 'common';

export function* fetchAppDataRequestSaga() {
  yield console.log('fetching App data');
  const authenticated = yield select(state => state.app.authenticated);
  const kappSlug = yield select(state => state.app.kappSlug);

  // check for prerequisites
  // 1. Form Attribute (Survey Configuration)
  // 2. Forms (Survey Template / OptOut)
  // 3. Ensure that "robots" exist (check for the robots datastore form)
  // 4. Probably some trees that need to exist.

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
    // check  for template requirement
    // const hasTemplate = !!forms.find(form => form.type === 'Template');
    // if (!hasTemplate) {
    //   yield put(actions.fetchAppDataRequired('template'));
    // }
    yield put(
      actions.fetchAppDataSuccess({
        forms: forms,
        surveys: forms.filter(form => form.type === 'Survey'),
        templates: forms.filter(form => form.type === 'Template'),
        formActions: forms.filter(form => form.type === 'Survey Action'),
      }),
    );
  }
}

export function* watchSurveyApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
