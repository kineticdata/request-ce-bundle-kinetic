import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import {
  actions,
  types,
  SCHEDULER_FORM_SLUG,
  SCHEDULER_CONFIG_FORM_SLUG,
  SCHEDULER_AVAILABILITY_FORM_SLUG,
  SCHEDULER_OVERRIDE_FORM_SLUG,
  SCHEDULER_OVERRIDES_PAGE_SIZE,
  SCHEDULED_EVENT_FORM_SLUG,
} from '../modules/techBarApp';

export function* fetchAppSettingsSaga() {
  const query = new CoreAPI.SubmissionSearch(true);
  query.include('details,values');
  query.limit('1000');
  query.index('values[Status],values[Type],values[Name]');
  query.eq('values[Status]', 'Active');
  query.eq('values[Type]', 'TechBar');

  const kappSlug = yield select(state => state.app.config.kappSlug);

  const [
    { submissions: schedulers, serverError: schedulersServerError },
    { forms, serverError: formsServerError },
  ] = yield all([
    call(CoreAPI.searchSubmissions, {
      search: query.build(),
      datastore: true,
      form: SCHEDULER_FORM_SLUG,
      include: 'form,values',
    }),
    call(CoreAPI.fetchForms, {
      kappSlug,
      include: 'details,attributes',
    }),
  ]);

  if (schedulersServerError || formsServerError) {
    yield put(
      actions.setAppErrors([
        (schedulersServerError &&
          (schedulersServerError.error || schedulersServerError.statusText)) ||
          (formsServerError &&
            (formsServerError.error || formsServerError.statusText)),
      ]),
    );
  } else {
    yield put(
      actions.setAppSettings({
        schedulers,
        forms,
      }),
    );
  }
}

export function* watchTechBarApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
}
