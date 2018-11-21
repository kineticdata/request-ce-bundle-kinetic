import reducers from './redux/reducers';
import {
  actions,
  types,
  Discussion as DiscussionRecord,
  newDiscussion,
  newDiscussionsList,
} from './redux/modules/discussions';
import {
  actions as listActions,
  types as listTypes,
} from './redux/modules/discussionsList';
import { sagas, combineSagas } from './redux/sagas';
import { DiscussionContainer as Discussion } from './components/DiscussionContainer';
import {
  TextMessage,
  UploadMessage,
  MessagesGroup,
} from './components/MessagesGroup';
import { DiscussionCard } from './components/summary/DiscussionCard';
import { DiscussionsList } from './components/summary/DiscussionsList';
import { DiscussionsPanel } from './components/summary/DiscussionsPanel';
import { ViewDiscussionsModal } from './components/summary/ViewDiscussionsModal';
import * as DiscussionAPI from './discussion_api';

// Components
export {
  Discussion,
  TextMessage,
  UploadMessage,
  MessagesGroup,
  DiscussionsList,
  DiscussionsPanel,
  DiscussionCard,
  ViewDiscussionsModal,
};
// Redux / Saga
export {
  reducers,
  sagas,
  combineSagas,
  actions,
  types,
  newDiscussion,
  newDiscussionsList,
  DiscussionRecord,
};

// APIs
export { DiscussionAPI };
