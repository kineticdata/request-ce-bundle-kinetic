import { all } from 'redux-saga/effects';

import { watchCategories } from './sagas/categories';
import { watchForms } from './sagas/forms';
import { watchSubmissions } from './sagas/submissions';
import { watchSubmission, watchSubmissionPoller } from './sagas/submission';
import { watchSubmissionCounts } from './sagas/submissionCounts';
import { watchSettingsServices } from './sagas/settingsServices';
import { watchSettingsForms } from './sagas/settingsForms';
import { watchSettingsCategories } from './sagas/settingsCategories';

export default function*() {
  yield all([
    watchCategories(),
    watchForms(),
    watchSubmissions(),
    watchSubmission(),
    watchSubmissionPoller(),
    watchSubmissionCounts(),
    watchSettingsServices(),
    watchSettingsForms(),
    watchSettingsCategories(),
  ]);
}
