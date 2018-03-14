import { reducer as errors } from './modules/errors';
import { reducer as about } from './modules/about';
import { reducer as app } from './modules/app';
import { reducer as profiles } from './modules/profiles';
import { reducer as datastore } from './modules/datastore';
import { reducer as team } from './modules/team';
import { reducer as teamList } from './modules/teamList';
import { reducer as forms } from './modules/forms';

export default {
  errors,
  app,
  about,
  datastore,
  profiles,
  team,
  teamList,
  forms,
};
