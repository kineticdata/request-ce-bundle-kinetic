import reducers from './redux/reducers';
import { actions, types } from './redux/modules/discussions';
import { sagas, combineSagas } from './redux/sagas';
import { DiscussionContainer as Discussion } from './components/DiscussionContainer';
import {
  TextMessage,
  UploadMessage,
  MessagesGroup,
} from './components/MessagesGroup';
import { DiscussionCard } from './components/summary/DiscussionCard';
import { DiscussionsList } from './components/summary/DiscussionsList';
import { ViewDiscussionsModal } from './components/summary/ViewDiscussionsModal';
import * as DiscussionAPI from './discussion_api';

// Components
export {
  Discussion,
  TextMessage,
  UploadMessage,
  MessagesGroup,
  DiscussionsList,
  DiscussionCard,
  ViewDiscussionsModal,
};
// Redux / Saga
export { reducers, sagas, combineSagas, actions, types };

// APIs
export { DiscussionAPI };
