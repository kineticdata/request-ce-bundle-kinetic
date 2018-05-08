import { reducer as errors } from './modules/errors';
import { reducer as about } from './modules/about';
import { reducer as app } from './modules/app';
import { reducer as profiles } from './modules/profiles';
import { reducer as team } from './modules/team';
import { reducer as teamList } from './modules/teamList';
import { reducer as spaceForms } from './modules/spaceForms';
import { reducer as settingsDatastore } from './modules/settingsDatastore';
import { reducer as settingsNotifications } from './modules/settingsNotifications';
import { reducer as settingsUsers } from './modules/settingsUsers';
import { reducer as settingsSpace } from './modules/settingsSpace';

export default {
  errors,
  app,
  about,
  settingsDatastore,
  settingsNotifications,
  settingsUsers,
  profiles,
  team,
  teamList,
  spaceForms,
  settingsSpace,
};
