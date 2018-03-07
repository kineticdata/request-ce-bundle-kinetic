import errorsReducer from './modules/errors';
import { reducer as app } from './modules/app';
import { reducer as queue } from './modules/queue';
import { reducer as filterMenu } from './modules/filterMenu';
import { reducer as workMenu } from './modules/workMenu';

export default {
  errors: errorsReducer,
  app,
  queue,
  filterMenu,
  workMenu,
};
