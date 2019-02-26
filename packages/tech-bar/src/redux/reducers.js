import { reducer as appointmentsReducer } from './modules/appointments';
import { reducer as techBarAppReducer } from './modules/techBarApp';
import { reducer as walkInsReducer } from './modules/walkIns';
import { reducer as metricsReducer } from './modules/metrics';

export default {
  appointments: appointmentsReducer,
  techBarApp: techBarAppReducer,
  walkIns: walkInsReducer,
  metrics: metricsReducer,
};
