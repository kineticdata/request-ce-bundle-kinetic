import errorsReducer from './modules/errors';
import { reducer as queueApp } from './modules/queueApp';
import { reducer as queue } from './modules/queue';
import { reducer as filterMenu } from './modules/filterMenu';
import { reducer as workMenu } from './modules/workMenu';

export default {
  errors: errorsReducer,
  queueApp,
  queue,
  filterMenu,
  workMenu,
};
