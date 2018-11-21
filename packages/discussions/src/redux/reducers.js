import { reducer as discussions } from './modules/discussions';
import { reducer as discussionsList } from './modules/discussionsList';
import { reducer as socket } from './modules/socket';

export default {
  socket,
  discussions,
  discussionsList,
};
