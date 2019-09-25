import { reducer as schedulers } from './modules/schedulers';
import { reducer as searchHistory } from './modules/searchHistory';
import { reducer as discussions } from './modules/discussions';
import { reducer as discussionsDetails } from './modules/discussionsDetails';
import { reducer as discussionsPanel } from './modules/discussionsPanel';
import { reducer as toasts } from './modules/toasts';
import { reducer as modalForm } from './modules/modalForm';
import { reducer as activityFeed } from './modules/activityFeed';

export default {
  discussions,
  discussionsDetails,
  discussionsPanel,
  schedulers,
  searchHistory,
  toasts,
  modalForm,
  activityFeed,
};
