import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import { CoreAPI } from 'react-kinetic-core';
import { List } from 'immutable';
import {
  actions,
  types,
  Settings,
  SCHEDULER_FORM_SLUG,
} from '../modules/techBarApp';

const TECH_BAR_SETTINGS_FORM_SLUG = 'tech-bar-settings';

export function* fetchAppSettingsSaga() {
  const schedulersQuery = new CoreAPI.SubmissionSearch(true);
  schedulersQuery.include('details,values');
  schedulersQuery.limit('1000');
  schedulersQuery.index('values[Type],values[Name]');
  schedulersQuery.eq('values[Type]', 'TechBar');

  const settingsQuery = new CoreAPI.SubmissionSearch(true);
  settingsQuery.include('details,values');
  settingsQuery.limit('1000');
  settingsQuery.index('values[Scheduler Id]:UNIQUE');

  const kappSlug = yield select(state => state.app.config.kappSlug);

  const [
    { submissions: schedulers, serverError: schedulersServerError },
    { submissions: techBarSettings, serverError: settingsServerError },
    { forms, serverError: formsServerError },
  ] = yield all([
    call(CoreAPI.searchSubmissions, {
      search: schedulersQuery.build(),
      datastore: true,
      form: SCHEDULER_FORM_SLUG,
    }),
    call(CoreAPI.searchSubmissions, {
      search: settingsQuery.build(),
      datastore: true,
      form: TECH_BAR_SETTINGS_FORM_SLUG,
    }),
    call(CoreAPI.fetchForms, {
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

export function* watchTechBarApp() {
  yield takeEvery(types.FETCH_APP_SETTINGS, fetchAppSettingsSaga);
}
