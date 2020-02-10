import appReducer from './modules/app';
import errorsReducer from './modules/errors';
import surveyAppReducer from './modules/surveyApp';
import surveysReducer from './modules/surveys';
import notificationsReducer from './modules/notifications';

export default {
  app: appReducer,
  errors: errorsReducer,
  surveys: surveysReducer,
  notifications: notificationsReducer,
  surveyApp: surveyAppReducer,
};
