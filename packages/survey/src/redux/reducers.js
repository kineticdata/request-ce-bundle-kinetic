import appReducer from './modules/app';
import errorsReducer from './modules/errors';
import notificationsReducer from './modules/notifications';
import robotsReducer from './modules/robots';
import surveysReducer from './modules/surveys';
import surveyAppReducer from './modules/surveyApp';

export default {
  app: appReducer,
  errors: errorsReducer,
  notifications: notificationsReducer,
  robots: robotsReducer,
  surveys: surveysReducer,
  surveyApp: surveyAppReducer,
};
