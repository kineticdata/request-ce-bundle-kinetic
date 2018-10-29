import { reducer as appointmentsReducer } from './modules/appointments';
import { reducer as techBarAppReducer } from './modules/techBarApp';

export default {
  appointments: appointmentsReducer,
  techBarApp: techBarAppReducer,
};
