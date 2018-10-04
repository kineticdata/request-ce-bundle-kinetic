import errorsReducer from './modules/errors';
import { reducer as queueApp } from './modules/queueApp';
import { reducer as queue } from './modules/queue';
import { reducer as filterMenu } from './modules/filterMenu';
import { reducer as workMenu } from './modules/workMenu';
import { reducer as queueSettings } from './modules/settingsQueue';
import { reducer as settingsForms } from './modules/settingsForms';
import { reducer as forms } from './modules/forms';

export default {
  errors: errorsReducer,
  queueApp,
  queue,
  filterMenu,
  workMenu,
  queueSettings,
  settingsForms,
  forms,
};
