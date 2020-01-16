import { reducer as app } from './modules/app';
import surveyAppReducer from './modules/surveyApp';
import formsReducer from './modules/forms';
import settingsFormsReducer from './modules/settingsForms';
import submissionsReducer from './modules/submissions';

export default {
  app,
  forms: formsReducer,
  settingsForms: settingsFormsReducer,
  surveyApp: surveyAppReducer,
  submissions: submissionsReducer,
};
