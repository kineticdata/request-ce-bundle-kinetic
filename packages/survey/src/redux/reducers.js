import appReducer from './modules/app';
import errorsReducer from './modules/errors';
import notificationsReducer from './modules/notifications';
import robotsReducer from './modules/settingsRobots';
import settingsFormsReducer from './modules/settingsForms';
import surveyAppReducer from './modules/surveyApp';

export default {
  app: appReducer,
  errors: errorsReducer,
  notifications: notificationsReducer,
  settingsRobots: robotsReducer,
  settingsForms: settingsFormsReducer,
  surveyApp: surveyAppReducer,
};
