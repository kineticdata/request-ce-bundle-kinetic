import appReducer from './modules/app';
import errorsReducer from './modules/errors';
import surveyAppReducer from './modules/surveyApp';
import settingsDatastoreReducer from './modules/settingsDatastore';

export default {
  app: appReducer,
  errors: errorsReducer,
  settingsDatastore: settingsDatastoreReducer,
  surveyApp: surveyAppReducer,
};
