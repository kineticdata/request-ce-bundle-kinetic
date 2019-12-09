import { all } from 'redux-saga/effects';

import { watchApp } from './sagas/app';
import { watchServicesApp } from './sagas/servicesApp';
import { watchForms } from './sagas/forms';
import { watchSubmissions } from './sagas/submissions';
import { watchSubmission, watchSubmissionPoller } from './sagas/submission';
import { watchSubmissionCounts } from './sagas/submissionCounts';
import { watchSettingsForms } from './sagas/settingsForms';
import { watchSettingsCategories } from './sagas/settingsCategories';

export default function*() {
  yield all([
    watchApp(),
    watchForms(),
    watchServicesApp(),
    watchSubmissions(),
    watchSubmission(),
    watchSubmissionPoller(),
    watchSubmissionCounts(),
    watchSettingsForms(),
    watchSettingsCategories(),
  ]);
}
