import { reducer as modalForm } from './modules/modalForm';
import { reducer as schedulers } from './modules/schedulers';
import { reducer as searchHistory } from './modules/searchHistory';
import { reducer as discussions } from './modules/discussions';
import { reducer as discussionsDetails } from './modules/discussionsDetails';
import { reducer as discussionsList } from './modules/discussionsList';
import { reducer as toasts } from './modules/toasts';

export default {
  discussions,
  discussionsDetails,
  discussionsList,
  modalForm,
  schedulers,
  searchHistory,
  toasts,
};
