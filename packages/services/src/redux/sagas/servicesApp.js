import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { fetchCategories, fetchForms } from '@kineticdata/react';

import * as constants from '../../constants';
import { actions, types } from '../modules/servicesApp';

export function* fetchAppDataRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const [
    { categories, error: categoriesError },
    { forms, error: formsError },
    { forms: searchableForms, error: searchableFormsError, nextPageToken },
  ] = yield all([
    call(fetchCategories, {
      kappSlug,
      include:
        'attributes,categorizations.form,categorizations.form.attributes[Icon],categorizations.form.kapp',
    }),
    call(fetchForms, {
      kappSlug,
      include: 'details,categorizations,attributes,kapp',
      q: 'category = "home-page-services" AND status = "Active"',
      limit: 1000,
    }),
    call(fetchForms, {
      kappSlug,
      include: 'attributes[Icon],attributes[Keyword]',
      q: `type IN (${constants.SUBMISSION_FORM_TYPES.map(v => `"${v}"`).join(
        ',',
      )}) AND status IN (${constants.SUBMISSION_FORM_STATUSES.map(
        v => `"${v}"`,
      ).join(',')})`,
      limit: 1000,
    }),
  ]);

  if (categoriesError || formsError || searchableFormsError) {
    yield put(actions.fetchAppDataFailure(categoriesError || formsError));
  } else {
    yield put(
      actions.fetchAppDataSuccess({
        categories,
        forms,
        searchableForms,
        searchableLimitReached: !!nextPageToken,
      }),
    );
  }
}

export function* watchServicesApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
}
