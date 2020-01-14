import { reducer as app } from './modules/app';
import surveyAppReducer from './modules/surveyApp';
import formsReducer from './modules/forms';
import searchReducer from './modules/search';
import submissionsReducer from './modules/submissions';
// import submissionReducer from './modules/submission';
// import submissionCountsReducer from './modules/submissionCounts';
// import settingsFormsReducer from './modules/settingsForms';
// import settingsCategoriesReducer from './modules/settingsCategories';

export default {
  app,
  forms: formsReducer,
  search: searchReducer,
  surveyApp: surveyAppReducer,
  submissions: submissionsReducer,
  // submission: submissionReducer,
  // submissionCounts: submissionCountsReducer,
  // settingsForms: settingsFormsReducer,
  // settingsCategories: settingsCategoriesReducer,
};
