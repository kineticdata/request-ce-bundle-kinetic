import appReducer from './modules/app';
import errorsReducer from './modules/errors';
import surveyAppReducer from './modules/surveyApp';
import settingsDatastoreReducer from './modules/settingsDatastore';
import settingsNotificationsReducer from './modules/settingsNotifications';

export default {
  app: appReducer,
  errors: errorsReducer,
  settingsDatastore: settingsDatastoreReducer,
  settingsNotifications: settingsNotificationsReducer,
  surveyApp: surveyAppReducer,
};
