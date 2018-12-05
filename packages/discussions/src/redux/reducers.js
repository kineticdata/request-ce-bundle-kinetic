import { reducer as discussions } from './modules/discussions';
import { reducer as discussionsList } from './modules/discussionsList';
import { reducer as discussionsDetails } from './modules/discussionsDetails';
import { reducer as socket } from './modules/socket';

export default {
  socket,
  discussions,
  discussionsList,
  discussionsDetails,
};
