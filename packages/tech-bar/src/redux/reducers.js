import { reducer as app } from './modules/app';
import { reducer as appointments } from './modules/appointments';
import { reducer as techBarApp } from './modules/techBarApp';
import { reducer as walkIns } from './modules/walkIns';
import { reducer as metrics } from './modules/metrics';
import { reducer as exportReducer } from './modules/export';

export default {
  app,
  appointments,
  techBarApp,
  walkIns,
  metrics,
  export: exportReducer,
};
