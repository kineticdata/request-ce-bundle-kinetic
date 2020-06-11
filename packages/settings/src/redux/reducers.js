import { reducer as app } from './modules/app';
import { reducer as errors } from './modules/errors';
import { reducer as spaceApp } from './modules/spaceApp';
import { reducer as team } from './modules/team';
import { reducer as spaceForms } from './modules/spaceForms';
import { reducer as settingsDatastore } from './modules/settingsDatastore';
import { reducer as settingsNotifications } from './modules/settingsNotifications';
import { reducer as settingsRobots } from './modules/settingsRobots';
import { reducer as settingsUsers } from './modules/settingsUsers';
import { reducer as settingsTranslations } from './modules/settingsTranslations';

export default {
  app,
  errors,
  spaceApp,
  settingsDatastore,
  settingsNotifications,
  settingsRobots,
  settingsUsers,
  team,
  spaceForms,
  settingsTranslations,
};
