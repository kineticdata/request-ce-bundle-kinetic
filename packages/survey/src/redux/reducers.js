import appReducer from './modules/app';
import notificationsReducer from './modules/notifications';
import robotsReducer from './modules/robots';
import surveysReducer from './modules/surveys';
import surveyAppReducer from './modules/surveyApp';

export default {
  app: appReducer,
  notifications: notificationsReducer,
  robots: robotsReducer,
  surveys: surveysReducer,
  surveyApp: surveyAppReducer,
};
